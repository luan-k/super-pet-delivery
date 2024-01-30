"use client";
import React, {
  useEffect,
  useState,
  MouseEventHandler,
  FormEvent,
} from "react";
import Cookies from "js-cookie";
import { useContext } from "react";
import WkTable from "../components/WkTable";
import { TableConfig, TableColumn } from "../components/WkTable";
import { toast } from "react-toastify";

interface Sale {
  id: number;
  client_id: number;
  client_name: string;
  product: string;
  price: string;
  observation: string;
  created_at: string;
}

interface ListSalesResponse {
  sales: Sale[];
  total: number;
}

interface ListSalesProps {
  className?: string;
}

export default function ListSales({ className }: ListSalesProps) {
  const [listSalesResponse, setListSalesResponse] = useState<Sale[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [salesPerPage, setSalesPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string | null>(null);
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
  const fetchSales = async (
    pageId: number,
    pageSize: number,
    sortField: string | null,
    sortDirection: "asc" | "desc" | null,
    search?: string
  ) => {
    try {
      const token = Cookies.get("access_token");
      let url = `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/sales?page_id=${pageId}&page_size=${pageSize}`;

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
        const data: ListSalesResponse = await response.json();
        setListSalesResponse(data.sales);
        setTotalItems(data.total);
        console.log(data);
      } else {
        console.error("Failed to fetch sales");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(currentPage, salesPerPage, sortField, sortDirection, "");
  }, [currentPage, salesPerPage, sortField, sortDirection]);

  async function handleDelete(itemId: number): Promise<void> {
    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/sales/${itemId}`,
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
        console.log("Sale Deleted successfully!");
        fetchSales(currentPage, salesPerPage, sortField, sortDirection, "");
        toast.success("Venda deletada com sucesso!");
      } else {
        console.error("Failed to delete sale");
        console.log(response.json());
        toast.error("Houve um erro ao deletar a venda!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const tableConfig: TableConfig = {
    topClasses: "wk-table--sales",
    interact: {
      edit: listSalesResponse.map((sale) => `/admin/vendas/${sale.id}`),
      duplicate: false,
      delete: {
        eventFunction: handleDelete,
        items: listSalesResponse.map((sale) => sale.id),
      },
      report: true,
    },
    totalNumberOfItems: totalItems,
    pages: {
      currentPage: {
        value: currentPage,
        setter: setCurrentPage,
      },
      salesPerPage,
    },
    sortInfo: {
      field: sortField,
      direction: sortDirection,
      handleSort: handleSort,
    },
    columns: [
      {
        title: "Produto",
        key: "product",
        sortable: true,
        width: 20,
        items: listSalesResponse.map((sale) => (
          <>
            <span className='text-wk-main-yellow'> [ </span>
            {sale.id.toString().padStart(3, "0")}
            <span className='text-wk-main-yellow'> ] </span>
            {sale.product}
          </>
        )),
      },
      {
        title: "Preço",
        key: "price",
        sortable: true,
        width: 20,
        items: listSalesResponse.map((sale) => (
          <>
            <span className='text-wk-main-blue font-semibold'>R$ </span>
            {parseFloat(sale.price).toFixed(2).replace(".", ",")}
          </>
        )),
      },
      {
        title: "Observação",
        key: "observation",
        sortable: false,
        width: 20,
        items: listSalesResponse.map((sale) => sale.observation),
      },
      {
        title: "Cliente",
        key: "client_name",
        sortable: true,
        width: 20,
        items: listSalesResponse.map((sale) => sale.client_name),
      },
      {
        title: "Criado em",
        key: "created_at",
        sortable: true,
        width: 20,
        items: listSalesResponse.map((sale) =>
          new Date(sale.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        ),
      },
    ],
  };

  return (
    <>
      <WkTable config={tableConfig} />
    </>
  );
}
