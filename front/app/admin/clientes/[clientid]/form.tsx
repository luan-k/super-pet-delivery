"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import MaskedInput from "react-text-mask";
import ActionAlert from "../../components/ActionAlert";

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

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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

  // Use this state to track whether the form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

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
          setCurrentClient(data);

          // Set the form data here to update the input fields
          setFormData({
            full_name: data.full_name,
            phone_whatsapp: data.phone_whatsapp,
            phone_line: data.phone_line,
            pet_name: data.pet_name,
            pet_breed: data.pet_breed,
            address_street: data.address_street,
            address_number: data.address_number,
            address_neighborhood: data.address_neighborhood,
            address_reference: data.address_reference,
          });
        } else {
          console.error("Failed to fetch client details");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchClientDetails();
  }, [currentId]);

  useEffect(() => {
    if (formSubmitted) {
      // If the form has been submitted, show the success alert
      setShowSuccessAlert(true);

      // Hide the success alert after a certain duration (e.g., 3 seconds)
      const timeoutId = setTimeout(() => {
        setShowSuccessAlert(false);
        setFormSubmitted(false); // Reset the formSubmitted state
      }, 3000);

      // Clear the timeout to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [formSubmitted]);

  useEffect(() => {
    if (showDeleteAlert) {
      // If the delete was successful, show the delete alert
      const timeoutId = setTimeout(() => {
        setShowDeleteAlert(false);
      }, 3000);

      // Clear the timeout to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [showDeleteAlert]);

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
        setFormSubmitted(true); // Set the formSubmitted state to trigger the success alert
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
        setShowDeleteAlert(true); // Set the state to trigger the delete alert
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
      {showSuccessAlert && (
        <ActionAlert alertText='Cliente Editado com Sucesso!' color='green' />
      )}
      {showDeleteAlert && (
        <ActionAlert alertText='Cliente Excluído com Sucesso!' color='red' />
      )}
      <form className='grid grid-cols-1' onSubmit={handleSubmit}>
        <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title font-light'>Nome</h4>
            <input
              type='text'
              name='full_name'
              value={formData.full_name}
              onChange={handleInputChange}
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
              onChange={(e) => handleMaskedInputChange(e, phoneMask)}
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
              onChange={(e) => handleMaskedInputChange(e, phoneMask)}
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
              onChange={handleInputChange}
              className='wk-input'
            />
          </label>

          <label>
            Raça Pet
            <input
              type='text'
              name='pet_breed'
              value={formData.pet_breed}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
                onChange={handleInputChange}
                className='wk-input'
              />
            </label>

            <label>
              Bairro
              <input
                type='text'
                name='address_neighborhood'
                value={formData.address_neighborhood}
                onChange={handleInputChange}
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
              onChange={handleInputChange}
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
