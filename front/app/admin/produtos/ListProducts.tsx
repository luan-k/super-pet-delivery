"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export interface Product {
  name: string;
  description: string;
  userId: number;
  price: number;
  images: string[];
}

export default function ListProducts() {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [clientsPerPage, setClientsPerPage] = useState<number>(20);
  const [listProductsResponse, setListProductsResponse] = useState<Product[]>(
    []
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  async function fetchProducts(
    pageId: number,
    pageSize: number
    /* sortField: string | null,
    sortDirection: "asc" | "desc" | null,
    search?: string */
  ): Promise<void> {
    try {
      const token = Cookies.get("access_token");
      let url = `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/products?page_id=${pageId}&page_size=${pageSize}`;

      /*  if (sortField && sortDirection) {
        url += `&sort_field=${sortField}&sort_direction=${sortDirection}`;
      }

      if (search) {
        url += `&search=${search}`;
      } */
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        //const data: ListProductResponse = await response.json();
        const data: Product[] = await response.json();
        setListProductsResponse(data);
        console.log(data);
        //setTotalItems(data.total);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(1, 10);
  }, []);

  return (
    <div>
      <h1>Produtos</h1>
    </div>
  );
}
