"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import WkTable, { TableConfig } from "../components/WkTable";
import { toast } from "react-toastify";

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface ListCategoryResponse {
  total: number;
  categories: Category[];
}

export default function ListCategories() {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoriesPerPage, setCategoriesPerPage] = useState<number>(20);
  const [listCategoryResponse, setListCategoryResponse] = useState<Category[]>([]);
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

  async function fetchCategories(
    pageId: number,
    pageSize: number,
    sortField: string | null,
    sortDirection: "asc" | "desc" | null,
    search?: string
  ): Promise<void> {
    try {
      const token = Cookies.get("access_token");
      let url = `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/categories?page_id=${pageId}&page_size=${pageSize}`;

      if (sortField && sortDirection) {
        url += `&sort_field=${sortField}&sort_direction=${sortDirection}`;
      }

      if (search) {
        url += `&search=${search}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: ListCategoryResponse = await response.json();
        setListCategoryResponse(data.categories);
        console.log(data);
        setTotalItems(data.total);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories(
      currentPage,
      categoriesPerPage,
      sortField,
      sortDirection,
      search
    );
  }, [currentPage, categoriesPerPage, sortField, sortDirection, search]);

  async function handleDelete(itemId: number): Promise<void> {
    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/categories/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchCategories(
          currentPage,
          categoriesPerPage,
          sortField,
          sortDirection,
          search
        );
        toast.success("Categoria deletado com sucessa!");
      } else {
        console.error("Failed to delete category");

        toast.error("Houve um erro ao deletar a Categoria!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const tableConfig: TableConfig = {
    topClasses: "wk-table--sales",
    interact: {
      edit: listCategoryResponse
        ? listCategoryResponse.map((category) => `/admin/categorias/${category.id}`)
        : [],
      duplicate: false,
      delete: {
        eventFunction: handleDelete,
        items: listCategoryResponse
          ? listCategoryResponse.map((category) => category.id)
          : [],
      },
    },
    totalNumberOfItems: totalItems,
    pages: {
      currentPage: {
        value: currentPage,
        setter: setCurrentPage,
      },
      itemsPerPage: categoriesPerPage,
      setItemsPerPage: setCategoriesPerPage,
    },
    searchBar: {
      search: search,
      setSearch: setSearch,
      placeholder: "Pesquise por Nome, Descrição, etc...",
    },
    sortInfo: {
      field: sortField,
      direction: sortDirection,
      handleSort: handleSort,
    },
    columns: [
      {
        title: "Nome",
        key: "name",
        sortable: true,
        width: 30,
        items: listCategoryResponse
          ? listCategoryResponse.map((category) => (
              <>
                <span className='text-wk-secondary'> [ </span>
                {category.id.toString().padStart(3, "0")}
                <span className='text-wk-secondary'> ] </span>
                {category.name}
              </>
            ))
          : [],
      },
      {
        title: "Descrição",
        key: "description",
        sortable: true,
        width: 20,
        items: listCategoryResponse
            ? listCategoryResponse.map((category) => (
                    <>
                        <span className='text-wk-primary font-semibold'>R$ </span>
                        {parseFloat(category.description).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                        })}
                    </>
                ))
            : [],
      },
      {
        title: "Criado em",
        key: "created_at",
        sortable: true,
        width: 20,
        items: listCategoryResponse
          ? listCategoryResponse.map(
              (category: Category) =>
                new Date(category.created_at).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }) +
                " às " +
                new Date(category.created_at).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
            )
          : [],
      },
    ],
  };

  return (
    <>
      <WkTable config={tableConfig} />
    </>
  );
}
