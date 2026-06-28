package com.ahmedesawy.flow.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ahmedesawy.flow.category.CategoryRepository;
import com.ahmedesawy.flow.color.Color;
import com.ahmedesawy.flow.color.ColorRepository;
import com.ahmedesawy.flow.common.exception.NotFoundException;
import com.ahmedesawy.flow.common.storage.FileStorageService;
import com.ahmedesawy.flow.occasion.OccasionRepository;
import com.ahmedesawy.flow.product.color.ProductColor;
import com.ahmedesawy.flow.product.color.ProductColorRepository;
import com.ahmedesawy.flow.product.dto.request.ColorMetaDto;
import com.ahmedesawy.flow.product.dto.request.CreateProductRequest;
import com.ahmedesawy.flow.product.dto.request.FullUpdateRequest;
import com.ahmedesawy.flow.product.dto.request.ProductFilterRequest;

import com.ahmedesawy.flow.product.dto.response.ProductPriceRangeResponse;
import com.ahmedesawy.flow.product.dto.response.ProductResponse;
import com.ahmedesawy.flow.product.dto.response.ProductSummaryResponse;
import com.ahmedesawy.flow.product.image.ProductColorImage;
import com.ahmedesawy.flow.product.image.ProductImage;
import com.ahmedesawy.flow.product.image.ProductImageRepository;
import com.ahmedesawy.flow.product.specification.ProductSpecification;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OccasionRepository occasionRepository;
    private final FileStorageService fileStorageService;
    private final ProductImageRepository productImageRepository;
    private final ColorRepository colorRepository;
    private final ProductColorRepository productColorRepository;
    private final ObjectMapper objectMapper;

    // ---- CREATE ---------------------------------------------------------------------

    public ProductResponse createProduct(
        CreateProductRequest req,
        MultipartHttpServletRequest multipartRequest
    ) {
        Product product = buildProduct(req);

        List<MultipartFile> generalImages = multipartRequest.getFiles("images");
        Map<Long, List<MultipartFile>> colorFilesMap = extractColorFiles(multipartRequest);

        if (Boolean.TRUE.equals(product.getHasColor())) {
            validateColorProduct(generalImages, colorFilesMap);
            saveColorVariants(product, colorFilesMap);
        } else {
            validateGeneralProduct(generalImages, colorFilesMap);
            saveGeneralImages(product, generalImages);
        }

        return ProductMapper.toResponse(productRepository.save(product));
    }

    // ---- FULL UPDATE ---------------------------------------------------------------------

    public ProductResponse fullUpdate(
        Long productId,
        FullUpdateRequest req,
        String colorsMeta,
        MultipartHttpServletRequest multipartRequest
    ) {
        Product product = findActiveProduct(productId);

        // 1. Update Basic Info
        if (req.getTitle() != null)       product.setTitle(req.getTitle());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPrice() != null)       product.setPrice(BigDecimal.valueOf(req.getPrice()));

        if (req.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found")));
        }
        if (req.getOccasionId() != null) {
            product.setOccasion(occasionRepository.findById(req.getOccasionId())
                    .orElseThrow(() -> new NotFoundException("Occasion not found")));
        }

        // 2. Handle Mode Switch (General | Color)
        if (Boolean.TRUE.equals(req.getModeSwitched())) {
            if (Boolean.TRUE.equals(req.getHasColor())) {
                // Now Color -> Wipe all General Images
                product.getImages().forEach(img ->
                    fileStorageService.deleteFile("products/" + img.getImageUrl())
                );
                product.getImages().clear();
            } else {
                // Now General -> Wipe all Color Variants and Their Images
                product.getProductColors().forEach(pc -> {
                    if (pc.getImages() != null) {
                        pc.getImages().forEach(img ->
                            fileStorageService.deleteFile("products/" + img.getImageUrl())
                        );
                    }
                });
                product.getProductColors().clear();
            }
            product.setHasColor(req.getHasColor());
        }

        // 3. General Images
        if (!Boolean.TRUE.equals(req.getHasColor())) {
            if (req.getRemoveImageIds() != null && !req.getRemoveImageIds().isEmpty()) {
                List<ProductImage> toDelete = productImageRepository
                        .findAllByIdInAndProductId(req.getRemoveImageIds(), productId);
                
                toDelete.forEach(img ->
                        fileStorageService.deleteFile("products/" + img.getImageUrl())
                );
                product.getImages().removeIf(img -> req.getRemoveImageIds().contains(img.getId()));
            }
            saveGeneralImages(product, multipartRequest.getFiles("images"));
        }

        // 4. Color Variants
        if (Boolean.TRUE.equals(req.getHasColor()) && colorsMeta != null) {
            List<ColorMetaDto> metaList = parseColorsMeta(colorsMeta);
            Map<Long, List<MultipartFile>> colorFilesMap = extractColorFiles(multipartRequest);
            // Remove Colors and their Images
            if (req.getRemoveColorIds() != null && !req.getRemoveColorIds().isEmpty()) {
                List<ProductColor> toRemove = product.getProductColors()
                        .stream()
                        .filter(pc -> req.getRemoveColorIds().contains(pc.getId()))
                        .toList();

                toRemove.forEach(pc -> {
                    if (pc.getImages() != null) {
                        pc.getImages().forEach(img ->
                            fileStorageService.deleteFile("products/" + img.getImageUrl())
                        );
                    }
                    product.getProductColors().remove(pc);
                    productColorRepository.delete(pc);
                });
            }

            for (ColorMetaDto meta : metaList) {
                List<MultipartFile> files = colorFilesMap.getOrDefault(meta.getColorId(), List.of());
                //  Add New Color and its Images
                if (meta.isNew()) {
                    Color color = colorRepository.findById(meta.getColorId())
                            .orElseThrow(() -> new NotFoundException("Color not found: " + meta.getColorId()));
                            
                    System.out.println("yes");
                    ProductColor pc = new ProductColor();
                    pc.setProduct(product);
                    pc.setColor(color);

                    int sort = 0;
                    for (MultipartFile file : files) {
                        if (file == null || file.isEmpty()) continue;
                        ProductColorImage img = new ProductColorImage();
                        img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                        img.setSortOrder(sort++);
                        img.setProductColor(pc);
                        pc.getImages().add(img);
                    }
                    product.getProductColors().add(pc);

                } else {
                    // Update Existed Color
                    ProductColor pc = product.getProductColors()
                            .stream()
                            .filter(c -> c.getId().equals(meta.getProductColorId()))
                            .findFirst()
                            .orElseThrow(() -> new NotFoundException("ProductColor not found: " + meta.getProductColorId()));
                    // Delete its Images
                    if (meta.getRemoveImageIds() != null && !meta.getRemoveImageIds().isEmpty()) {
                        List<ProductColorImage> toDelete = pc.getImages().stream()
                            .filter(img -> meta.getRemoveImageIds().contains(img.getId()))
                            .toList();
                        toDelete.forEach(img ->
                            fileStorageService.deleteFile("products/" + img.getImageUrl())
                        );
                        pc.getImages().removeAll(toDelete);
                    }

                    int sort = pc.getImages().size();
                    for (MultipartFile file : files) {
                        if (file == null || file.isEmpty()) continue;
                        ProductColorImage img = new ProductColorImage();
                        img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                        img.setSortOrder(sort++);
                        img.setProductColor(pc);
                        pc.getImages().add(img);
                    }
                }
            }
        }

        return ProductMapper.toResponse(productRepository.save(product));
    }

    // ---- SINGLE OPERATIONS ---------------------------------------------------------------------

    public void restore(Long id) {
        Product product = findProduct(id);
        product.setDeletedAt(null);
    }

    public void softDelete(Long id) {
        Product product = findProduct(id);
        product.setDeletedAt(LocalDateTime.now());
    }

    public void hardDelete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    // ---- BULK OPERATIONS ---------------------------------------------------------------------

    public void restoreBulk(List<Long> ids) {
        productRepository.restoreBulk(ids);
    }

    public void softDeleteBulk(List<Long> ids) {
        productRepository.softDeleteBulk(ids, LocalDateTime.now());
    }

    public void hardDeleteBulk(List<Long> ids) {
        List<Product> products = productRepository.findAllById(ids);
        if (products.isEmpty()) throw new NotFoundException("No products found");
        productRepository.deleteAll(products); 
    }

    // ---- BOTH (ADMIN & SHOP) QUERIES ---------------------------------------------------------------------

    public List<ProductSummaryResponse> getActiveProducts() {
        return productRepository.findByDeletedAtIsNullOrderByUpdatedAtDesc()
            .stream()
            .map(ProductMapper::toSummaryResponse)
            .toList();
    }

    public ProductResponse getActiveProductById(Long id) {
        return ProductMapper.toResponse(
            productRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new NotFoundException("Product not found"))
        );
    }

    // ---- ADMIN QUERIES ---------------------------------------------------------------------

    public List<ProductSummaryResponse> getTrashProducts() {
        return productRepository.findByDeletedAtIsNotNull()
            .stream()
            .map(ProductMapper::toSummaryResponse)
            .toList();
    }

    // ---- SHOP QUERIES ---------------------------------------------------------------------

    public Page<Product> getProducts(ProductFilterRequest request, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.filter(
            request.getCategoryIds(),
            request.getOccasionIds(),
            request.getColorIds(),
            request.getMinPrice(),
            request.getMaxPrice()
        );
        return productRepository.findAll(spec, pageable);
    }

    public ProductPriceRangeResponse getPriceRange() {
        return productRepository.getPriceRange();
    }

    public List<ProductSummaryResponse> getBestSellers() {
        Pageable limit = PageRequest.of(0, 15);
        return productRepository.findBestSellers(limit)
            .stream()
            .map(ProductMapper::toSummaryResponse)
            .toList();
    }

    public List<ProductSummaryResponse> getProductsByOccasion(Long occasionId) {
        return productRepository.findByOccasionIdAndDeletedAtIsNull(occasionId)
            .stream()
            .map(ProductMapper::toSummaryResponse)
            .toList();
    }

    public List<ProductSummaryResponse> getProductsByOccasionName(String name) {
        return productRepository.findByOccasionNameAndDeletedAtIsNull(name)
            .stream()
            .map(ProductMapper::toSummaryResponse)
            .toList();
    }

    // ---- HELPERS ---------------------------------------------------------------------

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
    }

    private Product findActiveProduct(Long id) {
        return productRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
    }

    // Extract Color and its Images Ex: [ {colorId: 1, [...images]} , ]
    private Map<Long, List<MultipartFile>> extractColorFiles(MultipartHttpServletRequest request) {
        Map<Long, List<MultipartFile>> result = new HashMap<>();
        final String PREFIX = "color_";

        request.getMultiFileMap().forEach((partName, files) -> {
            if (partName.startsWith(PREFIX)) {
                try {
                    Long colorId = Long.parseLong(partName.substring(PREFIX.length()));
                    result.put(colorId, files);
                } catch (NumberFormatException ignored) {}
            }
        });

        return result;
    }

    // Basic Product Info
    private Product buildProduct(CreateProductRequest req) {
        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setHasColor(req.getHasColor());

        if (req.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found")));
        }
        if (req.getOccasionId() != null) {
            product.setOccasion(occasionRepository.findById(req.getOccasionId())
                    .orElseThrow(() -> new NotFoundException("Occasion not found")));
        }
        return product;
    }

    // Validate General Images
    private void validateGeneralProduct(
        List<MultipartFile> generalImages,
        Map<Long, List<MultipartFile>> colorFilesMap
    ) {
        boolean hasGeneralImages = generalImages != null &&
            generalImages.stream().anyMatch(f -> f != null && !f.isEmpty());

        if (!hasGeneralImages) {
            throw new IllegalArgumentException("General images are required.");
        }
        if (colorFilesMap != null && !colorFilesMap.isEmpty()) {
            throw new IllegalArgumentException("Color images are not allowed for general products.");
        }
    }

    // Validate Product Color Images
    private void validateColorProduct(
        List<MultipartFile> generalImages,
        Map<Long, List<MultipartFile>> colorFilesMap
    ) {
        if (generalImages != null && generalImages.stream().anyMatch(f -> !f.isEmpty())) {
            throw new IllegalArgumentException("General images are not allowed when hasColor=true.");
        }
        if (colorFilesMap == null || colorFilesMap.isEmpty()) {
            throw new IllegalArgumentException("At least one color variant with images is required.");
        }
    }

    // Save General Images
    private void saveGeneralImages(Product product, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            ProductImage img = new ProductImage();
            img.setImageUrl(fileStorageService.uploadImage(file, "products"));
            img.setProduct(product);
            product.getImages().add(img);
        }
    }

    // Save Product Color Images
    private void saveColorVariants(Product product, Map<Long, List<MultipartFile>> colorFilesMap) {
        if (colorFilesMap == null || colorFilesMap.isEmpty()) return;

        for (Map.Entry<Long, List<MultipartFile>> entry : colorFilesMap.entrySet()) {
            Long colorId = entry.getKey();
            List<MultipartFile> files = entry.getValue();

            boolean hasValidFile = files != null &&
                files.stream().anyMatch(f -> f != null && !f.isEmpty());

            if (!hasValidFile) {
                throw new IllegalArgumentException("At least one image is required for color id: " + colorId);
            }

            Color color = colorRepository.findById(colorId)
                .orElseThrow(() -> new NotFoundException("Color not found: " + colorId));

            ProductColor productColor = new ProductColor();
            productColor.setProduct(product);
            productColor.setColor(color);

            int sort = 0;
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                ProductColorImage img = new ProductColorImage();
                img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                img.setSortOrder(sort++);
                img.setProductColor(productColor);
                productColor.getImages().add(img);
            }

            product.getProductColors().add(productColor);
        }
    }

    // Convert the JSON String into a Java List
    private List<ColorMetaDto> parseColorsMeta(String colorsMeta) {
        try {
            return objectMapper.readValue(colorsMeta, new TypeReference<List<ColorMetaDto>>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid colorsMeta format: " + e.getMessage());
        }
    }

}