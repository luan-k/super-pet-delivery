"use client";
import SaleIcon from "../../public/latest-sales.svg";
import UserIcon from "../../public/latest-client.svg";
import PlusIcon from "../../public/admin-plus.svg";
import "../styles/components/main.scss";
import HistoryArrows from "./components/HistoryArrows";
import DashboardWidget, {
  DashboardWidgetProps,
} from "./components/DashboardWidget";
import { TableConfig } from "./components/WkTable";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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

export default function Dashboard() {
  const [listSalesResponse, setListSalesResponse] = useState<Sale[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [salesPerPage, setSalesPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

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
        search = search.replace(",", ".");
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
      } else {
        console.error("Failed to fetch sales");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      //setLoading(false);
    }
  };

  const singleIconClick = async (sale: number): Promise<void> => {
    const TypeOfPdf = "delivery";
    setIsDocumentLoading(true);

    try {
      const token = Cookies.get("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/pdf/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // replace with your token
          },
          body: JSON.stringify({
            sale_id: [sale],
            type_of_pdf: TypeOfPdf,
          }),
        }
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date();
      const options = {
        timeZone: "America/Sao_Paulo",
        hour12: false,
      };
      const formattedDate = date.toLocaleDateString("pt-BR");
      const formattedTime = date
        .toLocaleTimeString("pt-BR", options)
        .replace(/:/g, "-");

      let fileName = "";

      fileName =
        formattedDate + " " + formattedTime + "-nota-de-entrega" + ".pdf";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      setIsDocumentLoading(false);
    } catch (error) {
      console.error(error);
      setIsDocumentLoading(false);
    }
  };

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

  useEffect(() => {
    fetchSales(currentPage, 5, sortField, sortDirection, "");
  }, [currentPage, sortField, sortDirection]);

  const salesButton: DashboardWidgetProps["button"] = {
    text: "Ver todas as vendas",
    href: "/admin/sales",
    icon: PlusIcon,
  };

  const latestSales: TableConfig = {
    topClasses: "wk-table--sales",
    interact: {
      edit: listSalesResponse
        ? listSalesResponse.map((sale) => `/admin/vendas/${sale.id}`)
        : [],
      duplicate: false,
      report: {
        eventFunction: singleIconClick,
        items: listSalesResponse
          ? listSalesResponse.map((sale) => sale.id)
          : [],
        isDocumentLoading: isDocumentLoading,
      },
    },
    totalNumberOfItems: totalItems,
    pages: {
      currentPage: {
        value: currentPage,
        setter: setCurrentPage,
      },
      itemsPerPage: salesPerPage,
      setItemsPerPage: setSalesPerPage,
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
        items: listSalesResponse
          ? listSalesResponse.map((sale) => (
              <>
                <span className='text-wk-secondary'> [ </span>
                {sale.id.toString().padStart(3, "0")}
                <span className='text-wk-secondary'> ] </span>
                {sale.product}
              </>
            ))
          : [],
      },
      {
        title: "Preço",
        key: "price",
        sortable: true,
        width: 20,
        items: listSalesResponse
          ? listSalesResponse.map((sale) => (
              <>
                <span className='text-wk-primary font-semibold'>R$ </span>
                {parseFloat(sale.price).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </>
            ))
          : [],
      },
      {
        title: "Cliente",
        key: "client_name",
        sortable: true,
        width: 20,
        items: listSalesResponse
          ? listSalesResponse.map((sale) => sale.client_name)
          : [],
      },
      {
        title: "Criado em",
        key: "created_at",
        sortable: true,
        width: 20,
        items: listSalesResponse
          ? listSalesResponse.map((sale) =>
              new Date(sale.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            )
          : [],
      },
    ],
  };
  return (
    <>
      <div className='list-clients-header wk-admin-page-wrapper w-full my-7 font-Inter'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='title-wrapper grid grid-cols-2 mt-7 mb-14'>
          <h1 className='text-5xl font-semibold '>Dashboard</h1>
        </div>
        <div className='wk-dashboard h-full w-full grid grid-cols-2'>
          <DashboardWidget
            icon={SaleIcon}
            title='Ultimas Vendas'
            button={salesButton}
            table={latestSales}
            widgetLink='/admin/vendas'
          />
        </div>
      </div>
    </>
  );
}
