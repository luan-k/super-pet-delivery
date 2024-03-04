"use client";
import { useRouter } from "next/navigation";
import HistoryArrows from "../../components/HistoryArrows";
//import ProductForm, { formConfigInterface } from "../ProductForm";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import React from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import fetchClients, { Client, ListClientResponse } from "../../fetchClients";
import { EditProductFormRequest } from "../[productid]/page";
import ProductForm, { formConfigInterface } from "../ProductForm";

export interface CreateProductRequest {
  name: string;
  description: string;
  price: string;
  sku: string;
  user_id: number;
}

export type handleChangeType = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setDisplayPrice: (data: string) => void,
  setFormData: (data: CreateProductRequest | EditProductFormRequest) => void,
  formData: CreateProductRequest | EditProductFormRequest
) => void;

const handleChange: handleChangeType = (
  e,
  setDisplayPrice,
  setFormData,
  formData
) => {
  const { name, value } = e.target;

  let newValue: string | number;

  if (name === "client_id") {
    newValue = value !== "" ? +value : 0;
  } else if (name === "price") {
    newValue = value.replace(/\D/g, ""); // remove non-digits
    newValue = (parseInt(newValue) / 100).toFixed(2); // divide by 100 and fix 2 decimal places
    setDisplayPrice(newValue.replace(".", ",")); // replace dot with comma
    newValue = parseFloat(newValue); // convert back to number
  } else {
    newValue = value;
  }

  setFormData({
    ...formData,
    [name]: newValue,
  });
};
const handlePriceChange = (
  value: string,
  setDisplayPrice: (data: string) => void,
  setFormData: (data: CreateProductRequest | EditProductFormRequest) => void,
  formData: CreateProductRequest | EditProductFormRequest
) => {
  let newValue: string | number;

  newValue = value.replace(/\D/g, ""); // remove non-digits
  newValue = (parseInt(newValue) / 100).toFixed(2); // divide by 100 and fix 2 decimal places
  setDisplayPrice(newValue.replace(".", ",")); // replace dot with comma
  //newValue = parseFloat(newValue); // convert back to number

  setFormData({
    ...formData,
    price: newValue,
  });
};

export default function CreateProduct() {
  const router = useRouter();
  const userId = parseInt(Cookies.get("user_id") as string);
  console.log(userId);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: "",
    sku: "",
    user_id: userId,
  });
  const [displayPrice, setDisplayPrice] = useState("0,00");
  const [searchResults, setSearchResults] = useState<Client[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/products`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      console.log(formData);

      if (response.ok) {
        const data = await response.json();

        router.push(`/admin/produtos/`); //${data.id}`);
        toast.success("Produto criado com sucesso!");
      } else {
        console.error("Failed to create product");
        const data = await response.json();

        toast.error("Houve um erro ao criar o produto!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formConfig: formConfigInterface = {
    handleSubmit,
    setFormData,
    formData,
    setDisplayPrice,
    handleChange,
    displayPrice,
    handlePriceChange,
    submitButtonText: "Criar Produto",
  };
  return (
    <div className='wk-admin-page__wrapper'>
      <div className='container'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='list-clients-header'>
          <h1 className='wk-admin-page__title'>Novo Produto</h1>
        </div>
        <ProductForm formConfig={formConfig} />
      </div>
    </div>
  );
  return;
}
