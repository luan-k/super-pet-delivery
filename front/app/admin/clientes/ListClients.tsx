"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";

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
interface ListClientsProps {
  className?: string;
  onClientSelect?: (clientId: number, clientName: string) => void;
  isInModal?: boolean;
}

const ListClients: React.FC<ListClientsProps> = ({
  className,
  onClientSelect,
  isInModal,
}) => {
  const [listClientResponse, setListClientResponse] =
    useState<ListClientResponse>({
      total: 0,
      clients: [],
    });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientsPerPage, setClientsPerPage] = useState<number>(20);
  const combinedClassName = `list-clients ${className}`;
  const [search, setSearch] = useState("");

  const fetchClients = async (
    pageId: number,
    pageSize: number,
    sortField: string | null,
    sortDirection: "asc" | "desc" | null,
    search?: string
  ) => {
    try {
      const token = Cookies.get("access_token");
      let url =
        `http://localhost:8080/clients?page_id=${pageId}&page_size=${pageSize}` +
        (sortField && sortDirection
          ? `&sort_field=${sortField}&sort_direction=${sortDirection}`
          : "");

      // Add the search parameter to the URL if it's provided
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
    fetchClients(currentPage, clientsPerPage, null, null, search);
  }, [currentPage, clientsPerPage, search]);

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

  // Add state for sort field and direction
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // Function to handle sorting
  const handleSort = (field: string) => {
    // If the field is already being sorted, toggle the direction
    if (sortField === field) {
      setSortDirection((prevDirection) => {
        const newDirection = prevDirection === "asc" ? "desc" : null;
        if (newDirection === null) {
          setSortField(null);
        }
        fetchClients(currentPage, clientsPerPage, sortField, newDirection);
        return newDirection;
      });
    } else {
      // Otherwise, sort the new field in ascending order
      setSortField(field);
      setSortDirection("asc");
      fetchClients(currentPage, clientsPerPage, field, "asc");
    }
  };

  return (
    <>
      <div className='list-clients__sorting-wrapper grid grid-cols-2 w-11/12 ml-auto mb-6'>
        <input
          className='text-black text-2xl pl-6 py-2 rounded-2xl w-1/2'
          type='text'
          id='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Pesquisar...'
        />
        <div className='clients-per-page ml-auto'>
          <label className='clientsPerPage mr-4'>Exibindo por pagina:</label>
          <input
            className='text-black text-2xl pl-6 py-2 w-20 rounded-2xl'
            type='number'
            id='clientsPerPage'
            value={clientsPerPage}
            onChange={(e) => setClientsPerPage(Number(e.target.value))}
            min={5}
            max={100}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : listClientResponse &&
        listClientResponse.clients &&
        listClientResponse.clients.length === 0 ? (
        <div>No clients available.</div>
      ) : (
        <table className={combinedClassName}>
          <tbody>
            <tr className='list-clients__header-row'>
              <th
                className='list-clients__client-name cursor-pointer'
                onClick={() => handleSort("full_name")}>
                Nome
                {sortField === "full_name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUpIcon />
                  ) : sortDirection === "desc" ? (
                    <ChevronDownIcon />
                  ) : null)}
              </th>
              <th className='list-clients__client-whatsapp'>WhatsApp</th>
              <th className='list-clients__client-pet-name'>Nome Pet</th>
              <th className='list-clients__client-pet-breed'>Nome Raça</th>
              <th className='list-clients__client-address'>Endereço</th>
              <th className='list-clients__client-address-number'>Número</th>
              <th className='list-clients__client-address-neighborhood'>
                Bairro
              </th>
              {!isInModal && (
                <th className='list-clients__client-actions'>Editar</th>
              )}
            </tr>
            {listClientResponse &&
              listClientResponse.clients &&
              listClientResponse.clients.map((client, index) => (
                <tr
                  className={`list-clients__client-row ${
                    index % 2 === 0 ? "list-clients--even" : "list-clients--odd"
                  }`}
                  key={client.id}
                  onClick={() =>
                    onClientSelect &&
                    onClientSelect(client.id, client.full_name)
                  }>
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
                  {!isInModal && (
                    <td className='list-clients__client-actions'>
                      <Link
                        href={`/admin/clientes/${client.id}`}
                        className='wk-btn wk-btn--sm wk-btn--yellow'>
                        Editar
                      </Link>
                    </td>
                  )}
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
