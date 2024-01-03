"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ModalDialogClientsList from "../../components/ModalDialogClientsList";
import { toast } from "react-toastify";

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
  const [selectedClientName, setSelectedClientName] = React.useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let newValue: string | number;

    if (name === "client_id" || name === "price") {
      // Use the unary plus (+) or Number() to convert to numbers for specific fields
      newValue = value !== "" ? +value : 0;
    } else {
      newValue = value;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");
    console.log(formData);

    try {
      const response = await fetch("http://18.228.64.21:8080/sales", {
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
        router.push(`/admin/vendas/`); //${data.id}`);
        toast.success("Venda criada com sucesso!");
      } else {
        console.error("Failed to create sale");
        const data = await response.json();
        console.log(data);
        toast.error("Houve um erro ao criar a venda!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='text-2xl wk-create-client'>
      <form className='grid grid-cols-1' onSubmit={handleSubmit}>
        <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title'>Cliente</h4>
            <div className='flex'>
              <input
                type='text'
                name='client_id'
                className='!w-9/12 !rounded-tr-none !rounded-br-none !border-r-0'
                value={selectedClientName}
                readOnly
                onClick={() => {}}
                required
              />
              <ModalDialogClientsList
                onClientSelect={(clientId, clientName) => {
                  console.log(clientId); // Log the client id
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    client_id: clientId,
                  }));
                  setSelectedClientName(clientName); // Set the selected client's name
                }}
              />
            </div>
          </label>
        </div>

        <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title'>Produto</h4>
            <input
              type='text'
              name='product'
              value={formData.product}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title'>Preço</h4>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title'>Observação</h4>
            <textarea
              name='observation'
              value={formData.observation}
              onChange={handleChange}
            />
          </label>
        </div>

        <div>
          <button className='wk-btn wk-btn--bg wk-btn--green' type='submit'>
            Criar Venda
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;
