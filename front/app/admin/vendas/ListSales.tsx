"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

interface Sale {
  id: number;
  client_id: number;
  product: string;
  price: number;
  observation: string;
}

interface Client {
  id: number;
  full_name: string;
}

interface ListSalesResponse {
  total: number;
  sales: Sale[];
}

const ListSales: React.FC = () => {
  const [listSalesResponse, setListSalesResponse] = useState<ListSalesResponse>(
    {
      total: 0,
      sales: [],
    }
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [salesPerPage, setSalesPerPage] = useState<number>(10);
  const [clientNames, setClientNames] = useState<Record<number, string>>({});

  const fetchSales = async (pageId: number, pageSize: number) => {
    try {
      const token = Cookies.get("access_token");
      const response = await fetch(
        `http://localhost:8080/sales?page_id=${pageId}&page_size=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
          `http://localhost:8080/clients/${clientId}`,
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
    fetchSales(currentPage, salesPerPage);
  }, [currentPage, salesPerPage]);

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

  return (
    <>
      <div className='clients-per-page ml-auto mb-10'>
        <label className='clientsPerPage mr-4'>Exibindo por pagina:</label>
        <input
          className='text-black text-2xl pl-6 py-2 w-20 rounded-2xl'
          type='number'
          id='clientsPerPage'
          value={salesPerPage}
          onChange={(e) => setSalesPerPage(Number(e.target.value))}
          min={5}
          max={30}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : listSalesResponse.sales.length === 0 ? (
        <div>No sales available.</div>
      ) : (
        <table className='list-clients'>
          <tbody>
            <tr className='list-clients__header-row'>
              <th className='list-clients__client-name'>Produto</th>
              <th className='list-clients__client-whatsapp'>Preço</th>
              <th className='list-clients__client-pet-name'>Observação</th>
              <th className='list-clients__client-pet-breed'>Cliente</th>
              <th className='list-clients__client-actions'>Editar</th>
            </tr>
            {listSalesResponse.sales.map((sale, index) => (
              <tr
                className={`list-clients__client-row ${
                  index % 2 === 0 ? "list-clients--even" : "list-clients--odd"
                }`}
                key={sale.id}>
                <td className='list-clients__client-name'>{sale.product}</td>
                <td className='list-clients__client-whatsapp'>{sale.price}</td>
                <td className='list-clients__client-pet-name'>
                  {sale.observation}
                </td>
                <td className='list-clients__client-pet-breed'>
                  {clientNames[sale.client_id] || "Loading..."}
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
