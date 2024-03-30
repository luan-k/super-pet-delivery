"use client";
import { FaPaw } from "react-icons/fa";
import { Product } from "../admin/produtos/ListProducts";
import { useEffect, useState } from "react";
import { associatedImagesProps } from "../admin/produtos/ProductForm";
import Link from "next/link";

export default function Products() {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [productsPerPage, setProductsPerPage] = useState<number>(9);
  const [listProductResponse, setListProductResponse] = useState<Product[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  interface ListProductResponse {
    total: number;
    products: Product[];
  }
  /*   interface productsWithImages extends Product {
    images: string[];
  } */

  const getAssociatedImages = async ({
    currentId,
    setImages,
  }: associatedImagesProps) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/images/by_product/${currentId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        //toast.success("Imagem editada com sucesso!");
        const data = await response.json();
        console.log(data);
        setImages && setImages(data);
        return data;
      } else {
        console.error("Failed to edit product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getProductWithImages = async (product: Product) => {
    const images = await getAssociatedImages({
      currentId: product.id.toString(),
      setImages: () => {}, // Fix: Pass an empty function instead of null
    });
    if (Array.isArray(images) && images.length > 0) {
      // Fix: Check if images is an array
      return {
        ...product,
        images:
          `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080` +
          images[0].image_path,
      };
    } else {
      return { ...product, images: null };
    }
  };

  async function fetchProducts(
    pageId: number,
    pageSize: number,
    sortField: string | null,
    sortDirection: "asc" | "desc" | null,
    search?: string
  ): Promise<void> {
    try {
      let url = `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/products?page_id=${pageId}&page_size=${pageSize}`;

      if (sortField && sortDirection) {
        url += `&sort_field=${sortField}&sort_direction=${sortDirection}`;
      }

      if (search) {
        url += `&search=${search}`;
      }

      url += "&category_ids=1";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: ListProductResponse = await response.json();
        const productsWithImages = await Promise.all(
          data.products.map(getProductWithImages)
        );
        setListProductResponse(productsWithImages);
        setTotalItems(data.total);
        console.log(productsWithImages);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(
      currentPage,
      productsPerPage,
      sortField,
      sortDirection,
      search
    );
  }, [currentPage, productsPerPage, sortField, sortDirection, search]);

  return (
    <div className='wk-products'>
      <div className='container'>
        <div className='text-6xl text-front-blue text-center flex justify-center gap-7 mb-36'>
          <FaPaw /> Os Melhores Produtos
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-black gap-12'>
          {listProductResponse.map((product) => (
            <div key={product.id} className='product-card'>
              <Link
                href={`/produtos/${product.url}-florianopolis-sao-jose-palhoca-biguacu-santo-amaro`}>
                <div className='product-image'>
                  <img src={product.images} alt={product.name} />
                </div>
                <div className='product-info'>
                  <p className='product-price mb-3'>
                    R$ {parseFloat(product.price).toLocaleString("pt-BR")}
                  </p>
                  <h3 className='product-title'>{product.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
