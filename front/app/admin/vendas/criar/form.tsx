"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface CreateSaleRequest {
  client_id: number;
  product: string;
  price: number;
  observation: string;
}

const CreateSale: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateSaleRequest>({
    client_id: 0,
    product: "",
    price: 0,
    observation: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Use the unary plus (+) or Number() to convert to numbers
    const numericValue = name === "client_id" ? +value : Number(value);

    setFormData({
      ...formData,
      [name]: isNaN(numericValue) ? 0 : numericValue, // Handle NaN if conversion fails
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");
    console.log(formData);

    try {
      const response = await fetch("http://localhost:8080/sales", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Sale created successfully!");
        const data = await response.json();
        console.log(data);
        //router.push(`/admin/vendas/${data.id}`);
      } else {
        console.error("Failed to create sale");
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='text-2xl wk-create-client'>
      <h1>Create Sale</h1>
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
          className='text-white px-4 py-3 bg-green-700 mt-4'
          type='submit'>
          Create Sale
        </button>
      </form>
    </div>
  );
};

export default CreateSale;
