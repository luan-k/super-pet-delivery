"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface EditClientFormRequest {
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
interface ClientDetails {
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

const EditClientForm: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  var urlParts = pathname.split("/");
  var currentId = urlParts.at(-1);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          `http://localhost:8080/clients/${currentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: ClientDetails = await response.json();
          console.log(data);
          setCurrentClient(data);
        } else {
          console.error("Failed to fetch clients");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchClientDetails();
  }, [currentId]);

  const [currentClient, setCurrentClient] = useState<ClientDetails | null>(
    null
  );
  const [formData, setFormData] = useState<EditClientFormRequest>({
    full_name: "", // Update field names to match Go structure
    phone_whatsapp: "",
    phone_line: "",
    pet_name: "",
    pet_breed: "",
    address_street: "",
    address_number: "",
    address_neighborhood: "",
    address_reference: "",
  });

  // Update the form data when client details are fetched
  useEffect(() => {
    if (currentClient) {
      setFormData({
        full_name: currentClient.full_name,
        phone_whatsapp: currentClient.phone_whatsapp,
        phone_line: currentClient.phone_line,
        pet_name: currentClient.pet_name,
        pet_breed: currentClient.pet_breed,
        address_street: currentClient.address_street,
        address_number: currentClient.address_number,
        address_neighborhood: currentClient.address_neighborhood,
        address_reference: currentClient.address_reference,
      });
    }
  }, [currentClient]);

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
      const response = await fetch(
        `http://localhost:8080/clients/${currentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("Client Edited successfully!");
        // Add further actions or redirection upon successful creation
      } else {
        console.error("Failed to edit client");
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
      const response = await fetch(
        `http://localhost:8080/clients/${currentId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Client Deleted successfully!");
        router.push(`/admin/clientes/`);
      } else {
        console.error("Failed to delete client");
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
      <h1>Edit Client</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields corresponding to the EditClientFormRequest structure */}
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

        <button
          className='text-white px-4 py-3 bg-yellow-700 mt-4'
          type='submit'>
          Edit Client
        </button>

        <button
          className='text-center p-1 bg-red-500 rounded-xl hover:bg-red-600 transition-all'
          onClick={handleDelete}>
          Delete this client
        </button>
      </form>
    </div>
  );
};

export default EditClientForm;
