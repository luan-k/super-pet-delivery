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

const ListSales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          "http://localhost:8080/sales?page_id=1&page_size=10",
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
          setSales(data); // Assuming the response is an array of sales
        } else {
          console.error("Failed to fetch sales");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <div>
      <h1>List of Sales</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className='grid grid-cols-3 gap-32'>
          {sales.map((sale) => (
            <li className='' key={sale.id}>
              <strong>Client:</strong> {sale.client_id}
              <br />
              <strong>Product:</strong> {sale.product}
              <br />
              <strong>price:</strong> {sale.price}
              <br />
              <strong>Observation:</strong> {sale.observation}
              <br />
              <br />
              <Link
                href={`/admin/vendas/${sale.id}`}
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

export default ListSales;
