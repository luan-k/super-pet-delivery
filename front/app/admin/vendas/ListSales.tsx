"use client";
import React, { useEffect, useState, MouseEventHandler } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  SymbolIcon,
} from "@radix-ui/react-icons";
import { CheckedSalesContext } from "./CheckedSalesContext";
import { useContext } from "react";

interface Sale {
  id: number;
  client_id: number;
  client_name: string;
  product: string;
  price: number;
  observation: string;
  created_at: string;
}

interface Client {
  id: number;
  full_name: string;
}

interface ListSalesResponse {
  total: number;
  sales: Sale[];
}

interface ListSalesProps {
  className?: string;
}

const ListSales: React.FC<ListSalesProps> = ({ className }) => {
  const [listSalesResponse, setListSalesResponse] = useState<ListSalesResponse>(
    {
      total: 0,
      sales: [],
    }
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [salesPerPage, setSalesPerPage] = useState<number>(100);
  const [clientNames, setClientNames] = useState<Record<number, string>>({});
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const combinedClassName = `list-clients list-sales ${className}`;

  const { checkedSales, setCheckedSales } = useContext(CheckedSalesContext);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [allCheckedInPage, setAllCheckedInPage] = useState<boolean>(false);
  const [isDeliveryLoading, setIsDeliveryLoading] = useState(false);
  const [isSimpleLoading, setIsSimpleLoading] = useState(false);

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

  const handleCheck = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setCheckedSales((prevCheckedSales) => [...prevCheckedSales, id]);
    } else {
      setCheckedSales((prevCheckedSales) =>
        prevCheckedSales.filter((saleId) => saleId !== id)
      );
    }
  };

  useEffect(() => {
    console.log(checkedSales);
  }, [checkedSales]);

  const handleButtonClick = async (TypeOfPdf: string): Promise<void> => {
    if (TypeOfPdf === "delivery") {
      setIsDeliveryLoading(true);
    } else if (TypeOfPdf === "simple") {
      setIsSimpleLoading(true);
    }
    try {
      const token = Cookies.get("access_token");

      const response = await fetch("http://superpetdelivery.com.br:8080/pdf/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // replace with your token
        },
        body: JSON.stringify({
          sale_id: checkedSales,
          type_of_pdf: TypeOfPdf,
        }),
      });
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
      if (TypeOfPdf === "delivery") {
        fileName =
          formattedDate + " " + formattedTime + "-nota-de-entrega" + ".pdf";
      } else if (TypeOfPdf === "simple") {
        fileName =
          formattedDate + " " + formattedTime + "-relatorio-de-vendas" + ".pdf";
      }
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      if (TypeOfPdf === "delivery") {
        setIsDeliveryLoading(false);
      } else if (TypeOfPdf === "simple") {
        setIsSimpleLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (TypeOfPdf === "delivery") {
        setIsDeliveryLoading(false);
      } else if (TypeOfPdf === "simple") {
        setIsSimpleLoading(false);
      }
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
      let url = `http://superpetdelivery.com.br:8080/sales?page_id=${pageId}&page_size=${pageSize}`;

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
        setListSalesResponse(data);

        // Fetch client names for each sale
        const clientIds = data.sales.map((sale) => sale.client_id);
        await fetchClientNames(clientIds);
      } else {
        console.error("Failed to fetch sales");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientNames = async (clientIds: number[]) => {
    try {
      const token = Cookies.get("access_token");
      const promises = clientIds.map(async (clientId) => {
        const response = await fetch(
          `http://superpetdelivery.com.br:8080/clients/${clientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: Client = await response.json();
          setClientNames((prevClientNames) => ({
            ...prevClientNames,
            [clientId]: data.full_name,
          }));
        } else {
          console.error(
            `Failed to fetch client name for client ID: ${clientId}`
          );
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchSales(currentPage, salesPerPage, sortField, sortDirection, search);
  }, [currentPage, salesPerPage, sortField, sortDirection, search]);

  useEffect(() => {
    //setAllChecked(false);
    setAllCheckedInPage(false);
  }, [currentPage]);

  const totalPages = Math.ceil(listSalesResponse.total / salesPerPage);

  const renderPaginationButtons = () => {
    const maxButtonsToShow = 7;
    const buttons: JSX.Element[] = [];

    if (totalPages <= maxButtonsToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`font-semibold text-2xl p-7 rounded-2xl  transition-all hover:bg-white hover:text-black ${
              currentPage === i ? "bg-white text-black" : "bg-transparent"
            }`}
            onClick={() => setCurrentPage(i)}
            disabled={currentPage === i}>
            {i}
          </button>
        );
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxButtonsToShow / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

      if (startPage > 1) {
        buttons.push(
          <button
            key='first'
            className='font-semibold text-2xl p-7 rounded-2xl  transition-all hover:bg-white hover:text-black'
            onClick={() => setCurrentPage(1)}>
            {"<<"}
          </button>
        );

        buttons.push(
          <button
            key='prev'
            className='font-semibold text-2xl p-7 rounded-2xl  transition-all hover:bg-white hover:text-black'
            onClick={() => setCurrentPage(currentPage - 1)}>
            {"<"}
          </button>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            className={`font-semibold text-2xl p-7 rounded-2xl  transition-all hover:bg-white hover:text-black ${
              currentPage === i ? "bg-white text-black" : "bg-transparent"
            }`}
            onClick={() => setCurrentPage(i)}
            disabled={currentPage === i}>
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        buttons.push(
          <button
            key='next'
            className='font-semibold text-2xl p-7 rounded-2xl  transition-all hover:bg-white hover:text-black'
            onClick={() => setCurrentPage(currentPage + 1)}>
            {">"}
          </button>
        );

        buttons.push(
          <button
            key='last'
            className='font-semibold text-2xl p-7 rounded-2xl  transition-all hover:bg-white hover:text-black'
            onClick={() => setCurrentPage(totalPages)}>
            {">>"}
          </button>
        );
      }
    }

    return buttons;
  };

  const handleCheckAllInPage = () => {
    if (allCheckedInPage) {
      setCheckedSales([]);
    } else {
      const allSaleIds = listSalesResponse.sales.map((sale) => sale.id);
      setCheckedSales((prevCheckedSales) => [
        ...prevCheckedSales,
        ...allSaleIds,
      ]);
    }
    setAllCheckedInPage(!allCheckedInPage);
  };

  const handleCheckAll = async () => {
    const token = Cookies.get("access_token");

    if (allChecked) {
      setCheckedSales([]);
    } else {
      const response = await fetch(
        "http://superpetdelivery.com.br:8080/sales/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("all sales");
      console.log(data);
      setCheckedSales(data);
    }
    setAllChecked(!allChecked);
  };

  return (
    <>
      <div className='list-clients__sorting-wrapper grid grid-cols-6 w-11/12 ml-auto mb-6 items-center'>
        <input
          className='text-black text-2xl pl-6 py-2 rounded-2xl w-11/12'
          type='text'
          id='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Pesquisar...'
        />
        <div className='flex justify-center'>
          <button
            className='wk-btn wk-btn--bg wk-btn--yellow w-11/12 text-xl disabled:opacity-70 disabled:bg-yellow-900 disabled:hover:bg-yellow-900 disabled:border-yellow-900 disabled:hover:border-yellow-900'
            onClick={handleCheckAllInPage}
            disabled={allChecked}>
            {allCheckedInPage
              ? "Remover desta pagina"
              : "Checar Todos da Pagina"}
          </button>
        </div>
        <div className='flex justify-center'>
          <button
            className='wk-btn wk-btn--bg wk-btn--yellow w-11/12 text-xl disabled:opacity-70 disabled:bg-yellow-900 disabled:hover:bg-yellow-900 disabled:border-yellow-900 disabled:hover:border-yellow-900'
            onClick={handleCheckAll}
            disabled={allCheckedInPage}>
            {allChecked ? "Remover todos" : "Checar Todos"}
          </button>
        </div>
        <div className='flex justify-center'>
          <button
            className='wk-btn wk-btn--bg wk-btn--green w-11/12 text-2xl disabled:opacity-70 disabled:bg-green-900 disabled:hover:bg-green-900 disabled:border-green-900 disabled:hover:border-green-900'
            onClick={() => handleButtonClick("delivery")}
            disabled={
              checkedSales.length === 0 || isDeliveryLoading || isSimpleLoading
            }>
            {isDeliveryLoading ? <SymbolIcon /> : "Gerar Nota de Entrega"}
          </button>
        </div>
        <div className='flex justify-center'>
          <button
            className='wk-btn wk-btn--bg wk-btn--green w-11/12 text-2xl disabled:opacity-70 disabled:bg-green-900 disabled:hover:bg-green-900 disabled:border-green-900 disabled:hover:border-green-900'
            onClick={() => handleButtonClick("simple")}
            disabled={
              checkedSales.length === 0 || isDeliveryLoading || isSimpleLoading
            }>
            {isSimpleLoading ? <SymbolIcon /> : "Gerar Relatório de vendas"}
          </button>
        </div>
        <div className='clients-per-page ml-auto'>
          <label className='clientsPerPage mr-4'>Exibindo por página:</label>
          <input
            className='text-black text-2xl pl-6 py-2 w-20 rounded-2xl'
            type='number'
            id='clientsPerPage'
            value={salesPerPage}
            onChange={(e) => setSalesPerPage(Number(e.target.value))}
            min={5}
            max={100}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : !listSalesResponse.sales || listSalesResponse.sales.length === 0 ? (
        <div>Nenhuma venda disponível.</div>
      ) : (
        <table className={combinedClassName}>
          <tbody>
            <tr className='list-clients__header-row'>
              <th className='list-clients__client-checkbox'>Selecionar</th>
              <th
                className='list-clients__client-name  cursor-pointer'
                onClick={() => handleSort("product")}>
                Produto
                {sortField === "product" &&
                  (sortDirection === "asc" ? (
                    <ChevronUpIcon />
                  ) : sortDirection === "desc" ? (
                    <ChevronDownIcon />
                  ) : null)}
              </th>
              <th
                className='list-clients__client-whatsapp  cursor-pointer'
                onClick={() => handleSort("price")}>
                Preço
                {sortField === "price" &&
                  (sortDirection === "asc" ? (
                    <ChevronUpIcon />
                  ) : sortDirection === "desc" ? (
                    <ChevronDownIcon />
                  ) : null)}
              </th>
              <th className='list-clients__client-pet-name'>Observação</th>
              <th
                className='list-clients__client-pet-breed cursor-pointer'
                onClick={() => handleSort("client_name")}>
                Cliente
                {sortField === "client_name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUpIcon />
                  ) : sortDirection === "desc" ? (
                    <ChevronDownIcon />
                  ) : null)}
              </th>
              <th
                className='list-clients__client-actions cursor-pointer'
                onClick={() => handleSort("created_at")}>
                Criado em
                {sortField === "created_at" &&
                  (sortDirection === "asc" ? (
                    <ChevronUpIcon />
                  ) : sortDirection === "desc" ? (
                    <ChevronDownIcon />
                  ) : null)}
              </th>
              <th className='list-clients__client-actions'>Editar</th>
            </tr>
            {listSalesResponse.sales.map((sale, index) => (
              <tr
                className={`list-clients__client-row ${
                  index % 2 === 0 ? "list-clients--even" : "list-clients--odd"
                }`}
                key={sale.id}>
                <td className='list-clients__client-checkbox'>
                  <input
                    type='checkbox'
                    checked={checkedSales.includes(sale.id)}
                    onChange={(e) => handleCheck(sale.id, e.target.checked)}
                    className='list-clients__client-checkbox__input'
                  />
                </td>
                <td className='list-clients__client-name'>{sale.product}</td>
                <td className='list-clients__client-whatsapp'>{sale.price}</td>
                <td className='list-clients__client-pet-name'>
                  {sale.observation}
                </td>
                <td className='list-clients__client-pet-breed'>
                  {sale.client_name}
                </td>
                <td className='list-sales__table-data'>
                  {new Date(sale.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className='list-clients__client-actions'>
                  <Link
                    href={`/admin/vendas/${sale.id}`}
                    className='wk-btn wk-btn--sm wk-btn--yellow'>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className='pagination-wrapper flex justify-center gap-4 mt-24'>
        {renderPaginationButtons()}
      </div>
    </>
  );
};

export default ListSales;
