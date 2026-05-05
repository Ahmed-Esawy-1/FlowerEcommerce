"use client";
import { useEffect, useMemo, useState } from "react";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const productsData = [
  {
    id: 1,
    title: "Eternal Love Roses",
    body: "99 Premium Red Roses",
    price: 400,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLeuZVnRehax6JF53tJe-sex0k84TII56Z--tnPP_JL_ccOxoCRpkpf-pOkEQN27cC3qBeveuBjSJH-A6QCssm0C7Qx9WoPwySpWPKKyRdZ1kKZ-RFdhpQOG7LjSg1FO3PPrAPNjVWpGoA6sugg2Xwip0-PqegeUDVaWpvftISx7X_-lVrZk8r3HBryT49zjxtKgvMnui9oS2XqrDz9uCv_fE_syZ0HSmeZaIj4Ok7IO7QWJNRgip4t0tz5jDWlfF65NSqQL1wP3Z",
    category: "Roses",
    imgAlt: "ClassNameic Red Rose Bouquet",
  },
  {
    id: 2,
    title: "Vanilla Dream Spa",
    body: "Luxury Relaxation Set",
    price: 332,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByifH3omNp_Kmw739Bdi-Lp0KgxSD-OU1EaHXuowkLWbkNIHwJ0xm6dbk-EOi0RtxgwQhpEcOzj8jciIjqmVdBIrBbSccY6GXHpLQpd76TQ2v8bygq-sKtb2SpgPem8mPMWAUd9AhEkSiEF56EWrwHroEyfyzsOHUCJRMUs_MVPNbJqaCdWkbT7ipQFK87EB0_yc8n2HaHyuV36qbd4F22P0JRJ5WoaGDKHbDit0TT5YnEkJPWzABu4cibCk0DCaVJbTWUXFtPdmus",
    category: "Roses",
    imgAlt: "Vanilla &amp; Gold Spa Set",
  },
  {
    id: 3,
    title: "Royal Orchid Mix",
    body: "Ceramic Signature Box",
    price: 5672,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqT6gxQ4_Th0SUYlrjMEE0FUhoiWfS643ut624e0gn8Q2CvYJlCEkDqbeUbmbu-O2v6rmyhcVFLp6ZxaiiIKXZBSmQoBXnfSmA1YZIqsYc1NaMo5Q7VrH5EjZdHDfqNyBurIvoeQ28adT7hsOsI1ZTzrDneSNLA-8mzGOBb0yGDfA7dMlyjRRcVLJ50br-EhCqObXa8TvqHNDyymhPPndcPG-e-3TSYifVo9e3ld9WT_uDP751j16tKiVdToLZ1lNf-8XzBBeUNcZL",
    category: "Roses",
    imgAlt: "Orchid &amp; Rose Box",
  },
  {
    id: 4,
    title: "Pastel Symphony",
    body: "Mixed Seasonal Blooms",
    price: 600,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    category: "Roses",
    imgAlt: "Pastel Dreams Arrangement",
  },
  {
    id: 5,
    title: "Pastel Symphony",
    body: "Mixed Seasonal Blooms",
    price: 790,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    category: "Roses",
    imgAlt: "Pastel Dreams Arrangement",
  },
  {
    id: 6,
    title: "Eternal Love Roses",
    body: "99 Premium Red Roses",
    price: 1000,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLeuZVnRehax6JF53tJe-sex0k84TII56Z--tnPP_JL_ccOxoCRpkpf-pOkEQN27cC3qBeveuBjSJH-A6QCssm0C7Qx9WoPwySpWPKKyRdZ1kKZ-RFdhpQOG7LjSg1FO3PPrAPNjVWpGoA6sugg2Xwip0-PqegeUDVaWpvftISx7X_-lVrZk8r3HBryT49zjxtKgvMnui9oS2XqrDz9uCv_fE_syZ0HSmeZaIj4Ok7IO7QWJNRgip4t0tz5jDWlfF65NSqQL1wP3Z",
    category: "Roses",
    imgAlt: "ClassNameic Red Rose Bouquet",
  },
  {
    id: 7,
    title: "Vanilla Dream Spa",
    body: "Luxury Relaxation Set",
    price: 200,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByifH3omNp_Kmw739Bdi-Lp0KgxSD-OU1EaHXuowkLWbkNIHwJ0xm6dbk-EOi0RtxgwQhpEcOzj8jciIjqmVdBIrBbSccY6GXHpLQpd76TQ2v8bygq-sKtb2SpgPem8mPMWAUd9AhEkSiEF56EWrwHroEyfyzsOHUCJRMUs_MVPNbJqaCdWkbT7ipQFK87EB0_yc8n2HaHyuV36qbd4F22P0JRJ5WoaGDKHbDit0TT5YnEkJPWzABu4cibCk0DCaVJbTWUXFtPdmus",
    category: "Roses",
    imgAlt: "Vanilla &amp; Gold Spa Set",
  },
  {
    id: 8,
    title: "Royal Orchid Mix",
    body: "Ceramic Signature Box",
    price: 6489,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqT6gxQ4_Th0SUYlrjMEE0FUhoiWfS643ut624e0gn8Q2CvYJlCEkDqbeUbmbu-O2v6rmyhcVFLp6ZxaiiIKXZBSmQoBXnfSmA1YZIqsYc1NaMo5Q7VrH5EjZdHDfqNyBurIvoeQ28adT7hsOsI1ZTzrDneSNLA-8mzGOBb0yGDfA7dMlyjRRcVLJ50br-EhCqObXa8TvqHNDyymhPPndcPG-e-3TSYifVo9e3ld9WT_uDP751j16tKiVdToLZ1lNf-8XzBBeUNcZL",
    category: "Roses",
    imgAlt: "Orchid &amp; Rose Box",
  },
  {
    id: 9,
    title: "Pastel Symphony",
    body: "Mixed Seasonal Blooms",
    price: 7007,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    category: "Roses",
    imgAlt: "Pastel Dreams Arrangement",
  },
  {
    id: 10,
    title: "Pastel Symphony",
    body: "Mixed Seasonal Blooms",
    price: 707,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    category: "Roses",
    imgAlt: "Pastel Dreams Arrangement",
  },
  {
    id: 11,
    title: "Eternal Love Roses",
    body: "99 Premium Red Roses",
    price: 400,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLeuZVnRehax6JF53tJe-sex0k84TII56Z--tnPP_JL_ccOxoCRpkpf-pOkEQN27cC3qBeveuBjSJH-A6QCssm0C7Qx9WoPwySpWPKKyRdZ1kKZ-RFdhpQOG7LjSg1FO3PPrAPNjVWpGoA6sugg2Xwip0-PqegeUDVaWpvftISx7X_-lVrZk8r3HBryT49zjxtKgvMnui9oS2XqrDz9uCv_fE_syZ0HSmeZaIj4Ok7IO7QWJNRgip4t0tz5jDWlfF65NSqQL1wP3Z",
    category: "Roses",
    imgAlt: "ClassNameic Red Rose Bouquet",
  },
  {
    id: 12,
    title: "Vanilla Dream Spa",
    body: "Luxury Relaxation Set",
    price: 332,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByifH3omNp_Kmw739Bdi-Lp0KgxSD-OU1EaHXuowkLWbkNIHwJ0xm6dbk-EOi0RtxgwQhpEcOzj8jciIjqmVdBIrBbSccY6GXHpLQpd76TQ2v8bygq-sKtb2SpgPem8mPMWAUd9AhEkSiEF56EWrwHroEyfyzsOHUCJRMUs_MVPNbJqaCdWkbT7ipQFK87EB0_yc8n2HaHyuV36qbd4F22P0JRJ5WoaGDKHbDit0TT5YnEkJPWzABu4cibCk0DCaVJbTWUXFtPdmus",
    category: "Peonies",
    imgAlt: "Vanilla &amp; Gold Spa Set",
  },
  {
    id: 13,
    title: "Royal Orchid Mix",
    body: "Ceramic Signature Box",
    price: 5672,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqT6gxQ4_Th0SUYlrjMEE0FUhoiWfS643ut624e0gn8Q2CvYJlCEkDqbeUbmbu-O2v6rmyhcVFLp6ZxaiiIKXZBSmQoBXnfSmA1YZIqsYc1NaMo5Q7VrH5EjZdHDfqNyBurIvoeQ28adT7hsOsI1ZTzrDneSNLA-8mzGOBb0yGDfA7dMlyjRRcVLJ50br-EhCqObXa8TvqHNDyymhPPndcPG-e-3TSYifVo9e3ld9WT_uDP751j16tKiVdToLZ1lNf-8XzBBeUNcZL",
    category: "Roses",
    imgAlt: "Orchid &amp; Rose Box",
  },
  {
    id: 14,
    title: "Pastel Symphony",
    body: "Mixed Seasonal Blooms",
    price: 600,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    category: "Peonies",
    imgAlt: "Pastel Dreams Arrangement",
  },
  {
    id: 15,
    title: "Pastel Symphony",
    body: "Mixed Seasonal Blooms",
    price: 790,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc4hMWLvFJRJZnG8B2xau1ITkliHsK5hdUPReXL5ywfJrEv6g7bwI4Enr79xQCg4IsFrO-Htoo1W-D73MsYDPYzFTeZf4yXpcR1u0Jo5qQ9DuRj5Uy-RDk1XNRjLCCl56IKIn6Z64kPUMoVXTmGCbrkzdHMm1hmNVKf51kxZBFB2GoLwi-kRreg_ahiZ2btwZH5Re1TZD4zPw4u6jneZZNdoOQTr30jVTJEy9ZGLOoRM5_kD9hVg2pD7vDLEIRT7HIEPqXIJcZhTAy",
    category: "Lilies",
    imgAlt: "Pastel Dreams Arrangement",
  },
  {
    id: 16,
    title: "Eternal Love Roses",
    body: "99 Premium Red Roses",
    price: 1000,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLeuZVnRehax6JF53tJe-sex0k84TII56Z--tnPP_JL_ccOxoCRpkpf-pOkEQN27cC3qBeveuBjSJH-A6QCssm0C7Qx9WoPwySpWPKKyRdZ1kKZ-RFdhpQOG7LjSg1FO3PPrAPNjVWpGoA6sugg2Xwip0-PqegeUDVaWpvftISx7X_-lVrZk8r3HBryT49zjxtKgvMnui9oS2XqrDz9uCv_fE_syZ0HSmeZaIj4Ok7IO7QWJNRgip4t0tz5jDWlfF65NSqQL1wP3Z",
    category: "Lilies",
    imgAlt: "ClassNameic Red Rose Bouquet",
  },
  {
    id: 17,
    title: "Vanilla Dream Spa",
    body: "Luxury Relaxation Set",
    price: 200,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByifH3omNp_Kmw739Bdi-Lp0KgxSD-OU1EaHXuowkLWbkNIHwJ0xm6dbk-EOi0RtxgwQhpEcOzj8jciIjqmVdBIrBbSccY6GXHpLQpd76TQ2v8bygq-sKtb2SpgPem8mPMWAUd9AhEkSiEF56EWrwHroEyfyzsOHUCJRMUs_MVPNbJqaCdWkbT7ipQFK87EB0_yc8n2HaHyuV36qbd4F22P0JRJ5WoaGDKHbDit0TT5YnEkJPWzABu4cibCk0DCaVJbTWUXFtPdmus",
    category: "Lilies",
    imgAlt: "Vanilla &amp; Gold Spa Set",
  },
  {
    id: 18,
    title: "Royal Orchid Mix",
    body: "Ceramic Signature Box",
    price: 6489,
    imgPath:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqT6gxQ4_Th0SUYlrjMEE0FUhoiWfS643ut624e0gn8Q2CvYJlCEkDqbeUbmbu-O2v6rmyhcVFLp6ZxaiiIKXZBSmQoBXnfSmA1YZIqsYc1NaMo5Q7VrH5EjZdHDfqNyBurIvoeQ28adT7hsOsI1ZTzrDneSNLA-8mzGOBb0yGDfA7dMlyjRRcVLJ50br-EhCqObXa8TvqHNDyymhPPndcPG-e-3TSYifVo9e3ld9WT_uDP751j16tKiVdToLZ1lNf-8XzBBeUNcZL",
    category: "Lilies",
    imgAlt: "Orchid &amp; Rose Box",
  },
];
const priceRanges = [
  { label: "Less Than 500 EGP", min: 0, max: 499 },
  { label: "Between 500 and 1000 EGP", min: 500, max: 999 },
  { label: "Greater Than 1000 EGP", min: 1000, max: 10000 },
];
const categories = ["Roses", "Peonies", "Orchids", "Lilies"];

export default function Products() {
  const [allProducts, setAllProducts] = useState(productsData);
  const [filters, setFilters] = useState({
    category: [],
    price: [],
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchPrice =
        filters.price.length === 0 ||
        filters.price.some(
          (range) => product.price >= range.min && product.price <= range.max,
        );

      const matchCategory =
        filters.category.length === 0 ||
        filters.category.includes(product.category);

      return matchPrice && matchCategory;
    });
  }, [allProducts, filters]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  // Handle Pagination Buttons
  const maxVisiblePages = 4;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="flex gap-5 p-5">
      <Filters
        filters={filters}
        setFilters={setFilters}
        priceRanges={priceRanges}
        categories={categories}
      />

      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
