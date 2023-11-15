"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface EditSaleFormRequest {
  client_id: number;
  product: string;
  price: number;
  observation: string;
}
interface SaleDetails {
  id: number;
  client_id: number;
  product: string;
  price: number;
  observation: string;
}

const EditSaleForm: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  var urlParts = pathname.split("/");
  var currentId = urlParts.at(-1);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          `http://localhost:8080/sales/${currentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: SaleDetails = await response.json();
          console.log(data);
          setCurrentSale(data);
        } else {
          console.error("Failed to fetch sales");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [currentId]);

  const [currentSale, setCurrentSale] = useState<SaleDetails | null>(null);
  const [formData, setFormData] = useState<EditSaleFormRequest>({
    client_id: 0, // Update field names to match Go structure
    product: "",
    price: 0,
    observation: "",
  });

  // Update the form data when sale details are fetched
  useEffect(() => {
    if (currentSale) {
      setFormData({
        client_id: currentSale.client_id,
        product: currentSale.product,
        price: currentSale.price,
        observation: currentSale.observation,
      });
    }
  }, [currentSale]);

  // Define the handleChange function to update the form data
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");
    console.log(formData);

    try {
      const response = await fetch(`http://localhost:8080/sales/${currentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Sale Edited successfully!");
        // Add further actions or redirection upon successful creation
      } else {
        console.error("Failed to edit sale");
        console.log(response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("access_token");

    try {
      const response = await fetch(`http://localhost:8080/sales/${currentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Sale Deleted successfully!");
        router.push(`/admin/vendas/`);
      } else {
        console.error("Failed to delete sale");
        console.log(response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='text-2xl wk-create-client'>
      Current Pathname:{pathname}
      <br />
      and this is the current id: {currentId}
      <h1>Edit Sale</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields corresponding to the createSaleRequest structure */}
        <label>
          client id:
          <input
            type='number'
            name='client_id'
            value={formData.client_id}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          product:
          <input
            type='text'
            name='product'
            value={formData.product}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          price:
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          observation:
          <input
            type='text'
            name='observation'
            value={formData.observation}
            onChange={handleChange}
          />
        </label>
        <br />

        <button
          className='text-white px-4 py-3 bg-yellow-700 mt-4'
          type='submit'>
          Edit Sale
        </button>

        <button
          className='text-center p-1 bg-red-500 rounded-xl hover:bg-red-600 transition-all'
          onClick={handleDelete}>
          Delete this sale
        </button>
      </form>
    </div>
  );
};

export default EditSaleForm;
