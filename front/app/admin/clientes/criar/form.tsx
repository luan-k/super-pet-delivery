"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface CreateClientRequest {
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

const CreateClient: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateClientRequest>({
    full_name: "",
    phone_whatsapp: "",
    phone_line: "",
    pet_name: "",
    pet_breed: "",
    address_street: "",
    address_number: "",
    address_neighborhood: "",
    address_reference: "",
  });

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
      const response = await fetch("http://localhost:8080/clients", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Client created successfully!");
        const data = await response.json();
        console.log(data);
        router.push(`/admin/clientes/${data.id}`);
      } else {
        console.error("Failed to create client");
        console.log(response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='text-2xl wk-create-client'>
      <h1>Create Client</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields corresponding to the createClientRequest structure */}
        <label>
          Full Name:
          <input
            type='text'
            name='full_name'
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Phone (WhatsApp):
          <input
            type='text'
            name='phone_whatsapp'
            value={formData.phone_whatsapp}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Phone (Line):
          <input
            type='text'
            name='phone_line'
            value={formData.phone_line}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Pet Name:
          <input
            type='text'
            name='pet_name'
            value={formData.pet_name}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Pet Breed:
          <input
            type='text'
            name='pet_breed'
            value={formData.pet_breed}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Address Street:
          <input
            type='text'
            name='address_street'
            value={formData.address_street}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Address Number:
          <input
            type='text'
            name='address_number'
            value={formData.address_number}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Address Neighborhood:
          <input
            type='text'
            name='address_neighborhood'
            value={formData.address_neighborhood}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Address Reference:
          <input
            type='text'
            name='address_reference'
            value={formData.address_reference}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type='submit'>Create Client</button>
      </form>
    </div>
  );
};

export default CreateClient;
