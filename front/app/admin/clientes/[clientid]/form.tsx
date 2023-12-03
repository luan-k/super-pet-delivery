"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import MaskedInput from "react-text-mask";

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
      }
    };

    fetchClientDetails();
  }, [currentId]);

  const [currentClient, setCurrentClient] = useState<ClientDetails | null>(
    null
  );
  const [formData, setFormData] = useState<EditClientFormRequest>({
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const phoneMask = [
    "(",
    /[1-9]/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  return (
    <div className='text-2xl wk-create-client'>
      <form className='grid grid-cols-1' onSubmit={handleSubmit}>
        {/* Input fields corresponding to the EditClientFormRequest structure */}
        <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title font-light'>Nome</h4>
            <input
              type='text'
              name='full_name'
              value={formData.full_name}
              onChange={handleChange}
              required
              className='wk-input'
            />
          </label>
        </div>

        <div className='wk-create-client__input-wrapper wk-create-client__input-wrapper--grid'>
          <label>
            <h4 className='wk-create-client__title'>Whatsapp</h4>
            <MaskedInput
              mask={phoneMask}
              type='text'
              name='phone_whatsapp'
              value={formData.phone_whatsapp}
              onChange={handleChange}
              className='wk-input'
            />
          </label>

          <label>
            <h4 className='wk-create-client__title'>Telefone</h4>
            <MaskedInput
              mask={phoneMask}
              type='text'
              name='phone_line'
              value={formData.phone_line}
              onChange={handleChange}
              className='wk-input'
            />
          </label>
        </div>

        <div className='wk-create-client__input-wrapper wk-create-client__input-wrapper--grid'>
          <label>
            Nome Pet
            <input
              type='text'
              name='pet_name'
              value={formData.pet_name}
              onChange={handleChange}
              className='wk-input'
            />
          </label>

          <label>
            Raça Pet
            <input
              type='text'
              name='pet_breed'
              value={formData.pet_breed}
              onChange={handleChange}
              className='wk-input'
            />
          </label>
        </div>

        <div className='wk-create-client__input-wrapper wk-create-client__input-wrapper--grid'>
          <label>
            Endereço rua
            <input
              type='text'
              name='address_street'
              value={formData.address_street}
              onChange={handleChange}
              className='wk-input'
            />
          </label>

          <div className='grid grid-cols-2 gap-3'>
            <label>
              Numero
              <input
                type='text'
                name='address_number'
                value={formData.address_number}
                onChange={handleChange}
                className='wk-input'
              />
            </label>

            <label>
              Bairro
              <input
                type='text'
                name='address_neighborhood'
                value={formData.address_neighborhood}
                onChange={handleChange}
                className='wk-input'
              />
            </label>
          </div>
        </div>

        <div className='wk-create-client__input-wrapper'>
          <label>
            Referencia
            <textarea
              name='address_reference'
              value={formData.address_reference}
              onChange={handleChange}
              className='wk-input'
            />
          </label>
        </div>

        <div className='grid grid-cols-2'>
          <div>
            <button
              className='wk-btn wk-btn--green wk-btn--md mt-4'
              type='submit'>
              Editar Cliente
            </button>
          </div>
          <div className='flex justify-end'>
            <div
              className='wk-btn wk-btn--red wk-btn--md mt-4 cursor-pointer w-max self-end'
              onClick={handleDelete}>
              Excluir este cliente
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditClientForm;
