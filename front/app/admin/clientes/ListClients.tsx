"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

interface Client {
  id: number;
  full_name: string;
  phone_whatsapp: string;
  phone_line: string;
  pet_name: string;
  pet_breed: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_reference: string;
}

interface ListClientResponse {
  total: number;
  clients: Client[];
}

const ListClients: React.FC = () => {
  const [listClientResponse, setListClientResponse] =
    useState<ListClientResponse>({
      total: 0,
      clients: [],
    });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientsPerPage, setClientsPerPage] = useState<number>(10);

  const fetchClients = async (pageId: number, pageSize: number) => {
    try {
      const token = Cookies.get("access_token");
      const response = await fetch(
        `http://localhost:8080/clients?page_id=${pageId}&page_size=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: ListClientResponse = await response.json();
        setListClientResponse(data);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage, clientsPerPage);
  }, [currentPage, clientsPerPage]);

  const totalPages = Math.ceil(listClientResponse.total / clientsPerPage);

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
          value={clientsPerPage}
          onChange={(e) => setClientsPerPage(Number(e.target.value))}
          min={5}
          max={30}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : listClientResponse.clients.length === 0 ? (
        <div>No clients available.</div>
      ) : (
        <table className='list-clients'>
          <tbody>
            <tr className='list-clients__header-row'>
              <th className='list-clients__client-name'>Nome</th>
              <th className='list-clients__client-whatsapp'>WhatsApp</th>
              <th className='list-clients__client-pet-name'>Nome Pet</th>
              <th className='list-clients__client-pet-breed'>Nome Raça</th>
              <th className='list-clients__client-address'>Endereço</th>
              <th className='list-clients__client-address-number'>Número</th>
              <th className='list-clients__client-address-neighborhood'>
                Bairro
              </th>
              <th className='list-clients__client-actions'>Editar</th>
            </tr>
            {listClientResponse.clients.map((client, index) => (
              <tr
                className={`list-clients__client-row ${
                  index % 2 === 0 ? "list-clients--even" : "list-clients--odd"
                }`}
                key={client.id}>
                <td className='list-clients__client-name'>
                  {client.full_name}
                </td>
                <td className='list-clients__client-whatsapp'>
                  {client.phone_whatsapp}
                </td>
                <td className='list-clients__client-pet-name'>
                  {client.pet_name}
                </td>
                <td className='list-clients__client-pet-breed'>
                  {client.pet_breed}
                </td>
                <td className='list-clients__client-address'>
                  {client.address_street}
                </td>
                <td className='list-clients__client-address-number'>
                  {client.address_number}
                </td>
                <td className='list-clients__client-address-neighborhood'>
                  {client.address_neighborhood}
                </td>
                <td className='list-clients__client-actions'>
                  <Link
                    href={`/admin/clientes/${client.id}`}
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

export default ListClients;
