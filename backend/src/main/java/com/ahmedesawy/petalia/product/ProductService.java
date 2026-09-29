package com.ahmedesawy.petalia.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ahmedesawy.petalia.category.Category;
import com.ahmedesawy.petalia.category.CategoryRepository;
import com.ahmedesawy.petalia.color.Color;
import com.ahmedesawy.petalia.color.ColorRepository;
import com.ahmedesawy.petalia.common.exception.NotFoundException;
import com.ahmedesawy.petalia.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.petalia.common.storage.FileStorageService;
import com.ahmedesawy.petalia.occasion.Occasion;
import com.ahmedesawy.petalia.occasion.OccasionRepository;
import com.ahmedesawy.petalia.product.dto.request.ColorMetaDto;
import com.ahmedesawy.petalia.product.dto.request.CreateProductRequest;
import com.ahmedesawy.petalia.product.dto.request.FullUpdateRequest;
import com.ahmedesawy.petalia.product.dto.request.ProductFilterRequest;
import com.ahmedesawy.petalia.product.dto.response.ProductPriceRangeResponse;
import com.ahmedesawy.petalia.product.dto.response.ProductResponse;
import com.ahmedesawy.petalia.product.dto.response.ProductSearchResponse;
import com.ahmedesawy.petalia.product.dto.response.ProductSummaryResponse;
import com.ahmedesawy.petalia.product.dto.response.TrashProductResponse;
import com.ahmedesawy.petalia.product.helpers.MultipartRequestHelper;
import com.ahmedesawy.petalia.product.helpers.ProductValidationHelper;
import com.ahmedesawy.petalia.product.images.ProductColorImage;
import com.ahmedesawy.petalia.product.images.ProductImage;
import com.ahmedesawy.petalia.product.images.ProductImageRepository;
import com.ahmedesawy.petalia.product.images.ProductImageService;
import com.ahmedesawy.petalia.product.productOffer.ProductOffer;
import com.ahmedesawy.petalia.product.productOffer.ProductOfferRepository;
import com.ahmedesawy.petalia.product.productOffer.ProductOfferService;
import com.ahmedesawy.petalia.product.specification.ProductSpecification;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OccasionRepository occasionRepository;
    private final ProductImageRepository productImageRepository;
    private final ColorRepository colorRepository;
    private final ProductOfferRepository productOfferRepository;

    private final FileStorageService fileStorageService;
    private final ProductImageService productImageService;
    private final ProductOfferService productOfferService;

    private final MultipartRequestHelper multipartRequestHelper;
    private final ProductValidationHelper productValidationHelper;

    private final VectorStore vectorStore;

    // ---- QUERIES -----------------
    public Page<ProductSummaryResponse> getShopProducts(ProductFilterRequest request, Pageable pageable) {

        Pageable unsortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize());

        Specification<Product> spec = ProductSpecification.filter(
                request.getCategoryIds(),
                request.getOccasionIds(),
                request.getColorIds(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getSortBy());

        return productRepository.findAll(spec, unsortedPageable)
                .map(ProductMapper::toSummaryResponse);
    }

    public ProductResponse getActiveProductById(Long id) {
        return ProductMapper.toResponse(
                productRepository.findByIdAndDeletedAtIsNull(id)
                        .orElseThrow(() -> new NotFoundException("Product not found!")));
    }

    public ProductPriceRangeResponse getPriceRange() {
        return productRepository.getPriceRange();
    }

    public Page<ProductResponse> getActiveProducts(Pageable pageable) {
        return productRepository.findByDeletedAtIsNull(pageable)
                .map(ProductMapper::toResponse);
    }

    public ProductResponse getProductById(Long id) {
        return ProductMapper.toResponse(
                productRepository.findByIdAndDeletedAtIsNull(id)
                        .orElseThrow(() -> new NotFoundException("Product not found!")));
    }

    public List<TrashProductResponse> getTrashProducts() {
        return productRepository.findByDeletedAtIsNotNullOrderByUpdatedAtDesc()
                .stream()
                .map(ProductMapper::toTrashResponse)
                .toList();
    }

    // ---- CREATE -----------------
    public String createProduct(CreateProductRequest req, MultipartHttpServletRequest multipartRequest) {
        Product product = buildProduct(req);

        List<MultipartFile> generalImages = multipartRequest.getFiles("images");
        Map<Integer, List<MultipartFile>> colorFilesMap = multipartRequestHelper.extractColorFiles(multipartRequest);

        if (product.getHasColor()) {
            productValidationHelper.validateColorProduct(generalImages, colorFilesMap);
            productImageService.saveColorVariants(product, colorFilesMap);
        } else {
            productValidationHelper.validateGeneralProduct(generalImages, colorFilesMap);
            productImageService.saveGeneralImages(product, multipartRequest.getFiles("images"));
        }

        Product savedProduct = productRepository.save(product);

        // Create Offer
        if (req.getHasOffer()) {
            ProductOffer offer = new ProductOffer();

            offer.setProduct(product);
            offer.setDiscountType(req.getOffer().getDiscountType());
            offer.setDiscountValue(req.getOffer().getDiscountValue());
            offer.setStartAt(req.getOffer().getStartAt());
            offer.setEndAt(req.getOffer().getEndAt());
            offer.setIsActive(req.getOffer().getIsActive());

            productOfferRepository.save(offer);
            savedProduct.setOffer(offer);
        }

        upsertProductVector(savedProduct);

        return "Product created successfully.";
    }

    // ---- FULL UPDATE -----------------
    public ProductResponse fullUpdate(
            Long productId,
            FullUpdateRequest req,
            String colorsMeta,
            MultipartHttpServletRequest multipartRequest) {
        Product existing = productRepository.findByIdOrThrow(productId);

        updateBasicInfo(existing, req);

        if (Boolean.TRUE.equals(req.getModeSwitched())) {
            handleModeSwitch(existing, req.getHasColor());
        }

        if (!Boolean.TRUE.equals(req.getHasColor())) {
            updateGeneralImages(existing, productId, req, multipartRequest);
        }

        if (Boolean.TRUE.equals(req.getHasColor()) && colorsMeta != null) {
            updateColorVariants(existing, colorsMeta, multipartRequest, req.getRemoveColorIds());
        }

        if (req.getHasOffer() != null) {
            productOfferService.updateOffer(existing, req);
        }

        Product saved = productRepository.save(existing);

        productImageService.resortImagesInMemory(saved);

        upsertProductVector(saved);

        return ProductMapper.toResponse(saved);
    }

    // ---- SEARCH ---------------------------------
    public List<ProductSearchResponse> searchProducts(String keyword) {
        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(keyword)
                        .topK(5)
                        .similarityThreshold(.5)
                        .build());

        List<Long> productIds = results.stream()
                .map(doc -> doc.getMetadata().get("productId"))
                .filter(Objects::nonNull)
                .map(id -> Long.valueOf((String) id))
                .toList();

        if (productIds.isEmpty())
            return List.of();

        List<Product> products = productRepository.findAllById(productIds);

        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        return productIds.stream()
                .map(productMap::get)
                .filter(Objects::nonNull)
                .map(ProductMapper::toSearchResponse)
                .toList();

    }

    // ---- SINGLE OPERATIONS -----------------
    public void restore(Long id) {
        Product product = productRepository.findByIdOrThrow(id);
        product.setDeletedAt(null);

        upsertProductVector(product);
    }

    public void softDelete(Long id) {
        Product product = productRepository.findByIdOrThrow(id);
        product.setDeletedAt(LocalDateTime.now());

        removeProductVector(id);
    }

    public void hardDelete(Long id) {
        if (!productRepository.existsById(id))
            throw new NotFoundException("Product not found!");
        productRepository.deleteById(id);

        removeProductVector(id);
    }

    // ---- BULK OPERATIONS -----------------
    public void restoreBulk(List<Long> ids) {
        productRepository.restoreBulk(ids);
        List<Product> restored = productRepository.findAllById(ids);
        restored.forEach(this::upsertProductVector);
    }

    public void softDeleteBulk(List<Long> ids) {
        productRepository.softDeleteBulk(ids, LocalDateTime.now());
        ids.forEach(this::removeProductVector);
    }

    public void hardDeleteBulk(List<Long> ids) {
        List<Product> products = productRepository.findAllById(ids);
        if (products.isEmpty())
            throw new NotFoundException("No products found");
        productRepository.deleteAll(products);
        ids.forEach(this::removeProductVector);
    }

    // ---- HELPERS -----------------

    // Basic Product Info (create)
    private Product buildProduct(CreateProductRequest req) {

        String nameEn = req.getNameEn().trim();
        String nameAr = req.getNameAr().trim();

        if (productRepository.existsByNameEn(nameEn))
            throw new ResourceAlreadyExistsException("The name of product in english name alerady exist.");

        if (productRepository.existsByNameAr(nameAr))
            throw new ResourceAlreadyExistsException("The name of product in arabic name alerady exist.");

        Product product = new Product();
        product.setNameEn(nameEn);
        product.setNameAr(nameAr);
        product.setDescriptionEn(req.getDescriptionEn());
        product.setDescriptionAr(req.getDescriptionAr());
        product.setPrice(req.getPrice());
        product.setHasColor(req.getHasColor());

        if (req.getCategoryIds() != null && !req.getCategoryIds().isEmpty()) {
            product.setCategories(
                    new HashSet<>(categoryRepository.findAllById(req.getCategoryIds())));
        }

        if (req.getOccasionIds() != null && !req.getOccasionIds().isEmpty()) {
            product.setOccasions(
                    new HashSet<>(occasionRepository.findAllById(req.getOccasionIds())));
        }

        return product;
    }

    // Update Basic Info (update)
    private void updateBasicInfo(Product existing, FullUpdateRequest req) {

        String newNameEn = req.getNameEn() != null ? req.getNameEn().trim() : null;
        String newNameAr = req.getNameAr() != null ? req.getNameAr().trim() : null;

        if (newNameEn != null && !newNameEn.isEmpty()
                && !existing.getNameEn().equals(newNameEn)) {
            if (productRepository.existsByNameEn(newNameEn)) {
                throw new ResourceAlreadyExistsException("This english name is alerady exist");
            }
            existing.setNameEn(newNameEn);
        }

        if (newNameAr != null && !newNameAr.isEmpty()
                && !existing.getNameAr().equals(newNameAr)) {
            if (productRepository.existsByNameAr(newNameAr)) {
                throw new ResourceAlreadyExistsException("This arabic name is alerady exist");
            }
            existing.setNameAr(newNameAr);
        }

        if (req.getDescriptionEn() != null)
            existing.setDescriptionEn(req.getDescriptionEn());
        if (req.getDescriptionAr() != null)
            existing.setDescriptionAr(req.getDescriptionAr());
        if (req.getPrice() != null)
            existing.setPrice(BigDecimal.valueOf(req.getPrice()));

        updateCategories(existing, req);
        updateOccasions(existing, req);

    }

    private void updateCategories(Product existing, FullUpdateRequest req) {
        Set<Category> current = new HashSet<>(existing.getCategories());

        // Remove requested categories
        if (req.getRemoveCategoryIds() != null && !req.getRemoveCategoryIds().isEmpty()) {
            current.removeIf(c -> req.getRemoveCategoryIds().contains(c.getId()));
        }

        // Add requested categories
        if (req.getCategoryIds() != null && !req.getCategoryIds().isEmpty()) {
            Set<Integer> alreadyPresentIds = current.stream()
                    .map(Category::getId)
                    .collect(Collectors.toSet());

            List<Integer> idsToAdd = req.getCategoryIds()
                    .stream()
                    .filter(id -> !alreadyPresentIds.contains(id))
                    .toList();

            if (!idsToAdd.isEmpty()) {
                current.addAll(categoryRepository.findAllById(idsToAdd));
            }
        }

        existing.setCategories(current);
    }

    private void updateOccasions(Product existing, FullUpdateRequest req) {
        Set<Occasion> current = new HashSet<>(existing.getOccasions());

        if (req.getRemoveOccasionIds() != null && !req.getRemoveOccasionIds().isEmpty()) {
            current.removeIf(o -> req.getRemoveOccasionIds().contains(o.getId()));
        }

        if (req.getOccasionIds() != null && !req.getOccasionIds().isEmpty()) {
            Set<Integer> alreadyPresentIds = current.stream()
                    .map(Occasion::getId)
                    .collect(Collectors.toSet());

            List<Integer> idsToAdd = req.getOccasionIds().stream()
                    .filter(id -> !alreadyPresentIds.contains(id))
                    .toList();

            if (!idsToAdd.isEmpty()) {
                current.addAll(occasionRepository.findAllById(idsToAdd));
            }
        }

        existing.setOccasions(current);
    }

    // Handle Mode Sitch (update)
    private void handleModeSwitch(Product existing, Boolean newHasColor) {
        // Delete images
        if (Boolean.TRUE.equals(newHasColor)) {
            existing.getImages().forEach(img -> fileStorageService.deleteFile("products/" + img.getImageUrl()));
            existing.getImages().clear();
        } else {
            existing.getProductColors().forEach(pc -> {
                if (pc.getImages() != null) {
                    pc.getImages().forEach(img -> fileStorageService.deleteFile("products/" + img.getImageUrl()));
                }
            });
            existing.getProductColors().clear();
        }
        existing.setHasColor(newHasColor);
    }

    // Update General Images (update)
    private void updateGeneralImages(
            Product existing, Long productId, FullUpdateRequest req, MultipartHttpServletRequest multipartRequest) {
        if (req.getRemoveImageIds() != null && !req.getRemoveImageIds().isEmpty()) {
            List<ProductImage> toDelete = productImageRepository
                    .findAllByIdInAndProductId(req.getRemoveImageIds(), productId);

            toDelete.forEach(img -> fileStorageService.deleteFile("products/" + img.getImageUrl()));
            existing.getImages().removeIf(img -> req.getRemoveImageIds().contains(img.getId()));
        }

        productImageService.applyGeneralImageOrder(
                existing, multipartRequest.getFiles("images"), req.getGeneralImageOrder());
    }

    // Update Color Vriants (update)
    private void updateColorVariants(
            Product existing, String colorsMeta, MultipartHttpServletRequest multipartRequest,
            List<Long> removeColorIds) {
        List<ColorMetaDto> metaList = multipartRequestHelper.parseColorsMeta(colorsMeta);
        Map<Integer, List<MultipartFile>> colorFilesMap = multipartRequestHelper.extractColorFiles(multipartRequest);

        if (removeColorIds != null && !removeColorIds.isEmpty()) {
            List<ProductColor> toRemove = existing.getProductColors().stream()
                    .filter(pc -> removeColorIds.contains(pc.getId()))
                    .toList();

            toRemove.forEach(pc -> {
                if (pc.getImages() != null) {
                    pc.getImages().forEach(img -> fileStorageService.deleteFile("products/" + img.getImageUrl()));
                }
                existing.getProductColors().remove(pc); // from DB
            });
        }

        for (ColorMetaDto meta : metaList) {
            List<MultipartFile> files = colorFilesMap.getOrDefault(meta.getColorId(), List.of());

            if (meta.isNew()) {
                Color color = colorRepository.findByIdOrThrow(meta.getColorId());

                ProductColor pc = new ProductColor();
                pc.setProduct(existing);
                pc.setColor(color);

                int sort = 0;
                for (MultipartFile file : files) {
                    if (file == null || file.isEmpty())
                        continue;
                    ProductColorImage img = new ProductColorImage();
                    img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                    img.setSortOrder(sort++);
                    img.setProductColor(pc);
                    pc.getImages().add(img);
                }
                existing.getProductColors().add(pc);

            } else {
                ProductColor pc = existing.getProductColors().stream()
                        .filter(c -> c.getId().equals(meta.getProductColorId()))
                        .findFirst()
                        .orElseThrow(
                                () -> new NotFoundException("ProductColor not found: " + meta.getProductColorId()));

                if (meta.getRemoveImageIds() != null && !meta.getRemoveImageIds().isEmpty()) {
                    List<ProductColorImage> toDelete = pc.getImages().stream()
                            .filter(img -> meta.getRemoveImageIds().contains(img.getId()))
                            .toList();
                    toDelete.forEach(img -> fileStorageService.deleteFile("products/" + img.getImageUrl()));
                    pc.getImages().removeAll(toDelete);
                }

                productImageService.applyColorImageOrder(pc, files, meta.getImageOrder());
            }
        }
    }

    // ---- VECTOR HELPERS ----------------------------------------
    private String buildVectorContent(Product product) {
        String offerText = "No active offer";
        ProductOffer offer = product.getOffer();
        if (offer != null) {
            offerText = String.format(
                    "Discount: %s %s, valid from %s to %s, active: %s",
                    offer.getDiscountValue(),
                    offer.getDiscountType(),
                    offer.getStartAt(),
                    offer.getEndAt(),
                    offer.getIsActive());
        }

        List<String> categories = product.getCategories()
                .stream()
                .map(c -> c.getNameEn() + " / " + c.getNameAr())
                .toList();

        List<String> occasions = product.getOccasions()
                .stream()
                .map(o -> o.getNameEn() + " / " + o.getNameAr())
                .toList();

        return String.format(
                "%s / %s. %s %s. Price: %.2f EGP. Categories: %s. Occasions: %s.%s",
                product.getNameEn(),
                product.getNameAr(),
                product.getDescriptionEn(),
                product.getDescriptionAr(),
                product.getPrice(),
                String.join(", ", categories),
                String.join(", ", occasions),
                offerText).trim();
    }

    private String vectorDocId(Long productId) {
        return UUID.nameUUIDFromBytes(("product-" + productId).getBytes()).toString();
    }

    private void upsertProductVector(Product product) {
        vectorStore.delete(List.of(vectorDocId(product.getId())));

        Document document = new Document(
                vectorDocId(product.getId()),
                buildVectorContent(product),
                Map.of("productId", String.valueOf(product.getId())));

        vectorStore.add(List.of(document));
    }

    private void removeProductVector(Long productId) {
        vectorStore.delete(List.of(vectorDocId(productId)));
    }
}