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
    <div>
      <h1>List of Clients</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className='grid grid-cols-3 gap-32'>
          {clients.map((client) => (
            <li className='' key={client.id}>
              <strong>Name:</strong> {client.full_name}
              <br />
              <strong>WhatsApp:</strong> {client.phone_whatsapp}
              <br />
              <strong>Phone Line:</strong> {client.phone_line}
              <br />
              <strong>Pet Name:</strong> {client.pet_name}
              <br />
              <strong>Pet Breed:</strong> {client.pet_breed}
              <br />
              <strong>Address Street:</strong> {client.address_street}
              <br />
              <strong>Address Number:</strong> {client.address_number}
              <br />
              <strong>Address Neighborhood:</strong>{" "}
              {client.address_neighborhood}
              <br />
              <strong>Address Reference:</strong> {client.address_reference}
              <br />
              <Link
                href={`/admin/clientes/${client.id}`}
                className='text-white px-4 py-3 bg-yellow-700 mt-4'>
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListClients;
