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

const ListClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          "http://localhost:8080/clients?page_id=1&page_size=10",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setClients(data); // Assuming the response is an array of clients
        } else {
          console.error("Failed to fetch clients");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <table className='list-clients'>
      <tbody>
        {loading ? (
          <tr>
            <td>Loading...</td>
          </tr>
        ) : (
          <>
            <tr className='list-clients__header-row'>
              <th className='list-clients__client-name'>Name</th>
              <th className='list-clients__client-whatsapp'>WhatsApp</th>
              <th className='list-clients__client-pet-name'>Pet Name</th>
              <th className='list-clients__client-pet-breed'>Pet Breed</th>
              <th className='list-clients__client-address'>Address</th>
              <th className='list-clients__client-address-number'>Number</th>
              <th className='list-clients__client-address-neighborhood'>
                Neighborhood
              </th>
              <th className='list-clients__client-actions'>Edit</th>
            </tr>
            {clients.map((client, index) => (
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
          </>
        )}
      </tbody>
    </table>
  );
};

export default ListClients;
