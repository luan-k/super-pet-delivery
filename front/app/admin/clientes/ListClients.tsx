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

  return (
    <>
      {/* Input for selecting clients per page */}
      <label htmlFor='clientsPerPage'>Clients Per Page:</label>
      <input
        className='text-black'
        type='number'
        id='clientsPerPage'
        value={clientsPerPage}
        onChange={(e) => setClientsPerPage(Number(e.target.value))}
        min={5}
        max={30}
      />

      {/* Render pagination links */}
      {Array.from({
        length: Math.ceil(listClientResponse.total / clientsPerPage),
      }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          disabled={currentPage === index + 1}>
          {index + 1}
        </button>
      ))}

      {loading ? (
        <div>Loading...</div>
      ) : listClientResponse.clients.length === 0 ? (
        <div>No clients available.</div>
      ) : (
        <table className='list-clients'>
          <tbody>
            <tr className='list-clients__header-row'>
              {/* ... existing header cells ... */}
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
    </>
  );
};

export default ListClients;
