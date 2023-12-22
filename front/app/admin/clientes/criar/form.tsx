"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import MaskedInput from "react-text-mask";

interface CreateClientRequest {
  full_name: string;
  phone_whatsapp: string;
  phone_line: string;
  pet_name: string;
  pet_breed: string;
  address_street: string;
  address_city: string;
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
    address_city: "",
    address_number: "",
    address_neighborhood: "",
    address_reference: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    mask?: (string | RegExp)[]
  ) => {
    const maskedValue = mask
      ? e.target.value
      : e.target.value.replace(/\D/g, "");
    const pureNumber = mask ? maskedValue.replace(/\D/g, "") : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: pureNumber,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChange(e);
  };

  const handleMaskedInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    mask: (string | RegExp)[]
  ) => {
    handleChange(e, mask);
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
        {/* Input fields corresponding to the createClientRequest structure */}
        <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title font-light'>Nome</h4>
            <input
              type='text'
              name='full_name'
              value={formData.full_name}
              onChange={handleInputChange}
              required
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
              onChange={(e) => handleMaskedInputChange(e, phoneMask)}
            />
          </label>

          <label>
            <h4 className='wk-create-client__title'>Telefone</h4>

            <MaskedInput
              mask={phoneMask}
              type='text'
              name='phone_line'
              value={formData.phone_line}
              onChange={(e) => handleMaskedInputChange(e, phoneMask)}
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
              onChange={handleInputChange}
            />
          </label>

          <label>
            Raça Pet
            <input
              type='text'
              name='pet_breed'
              value={formData.pet_breed}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className='wk-create-client__input-wrapper wk-create-client__input-wrapper--grid'>
          <div className='grid grid-cols-2 gap-3'>
            <label>
              Endereço rua
              <input
                type='text'
                name='address_street'
                value={formData.address_street}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Endereço cidade
              <input
                type='text'
                name='address_city'
                value={formData.address_city}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <label>
              Numero
              <input
                type='text'
                name='address_number'
                value={formData.address_number}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Bairro
              <input
                type='text'
                name='address_neighborhood'
                value={formData.address_neighborhood}
                onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div>
          <button
            className='wk-btn wk-btn--green wk-btn--md mt-4'
            type='submit'>
            Criar Cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClient;
