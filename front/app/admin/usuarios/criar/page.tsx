"use client";
import { useRouter } from "next/navigation";
import HistoryArrows from "../../components/HistoryArrows";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import React from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import fetchClients, { Client, ListClientResponse } from "../../fetchClients";
import { EditUserFormRequest } from "../[userid]/page";
import UserForm, { formConfigInterface } from "../UserForm";

export interface CreateUserRequest {
  username: string;
  full_name: string;
  email: string;
  password: string;
  role: string;
}

export type handleChangeType = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFormData: (data: CreateUserRequest | EditUserFormRequest) => void,
  formData: CreateUserRequest | EditUserFormRequest
) => void;

const handleChange: handleChangeType = (e, setFormData, formData) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });
};
const handlePriceChange = (
  value: string,
  setDisplayPrice: (data: string) => void,
  setFormData: (data: CreateUserRequest | EditUserFormRequest) => void,
  formData: CreateUserRequest | EditUserFormRequest
) => {
  let newValue: string | number;

  newValue = value.replace(/\D/g, ""); // remove non-digits
  newValue = (parseInt(newValue) / 100).toFixed(2); // divide by 100 and fix 2 decimal places
  setDisplayPrice(newValue.replace(".", ",")); // replace dot with comma
  //newValue = parseFloat(newValue); // convert back to number

  setFormData({
    ...formData,
  });
};

export default function CreateUser() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    full_name: "",
    email: "",
    password: "",
    role: "User",
  });
  const [displayPrice, setDisplayPrice] = useState("0,00");
  const [searchResults, setSearchResults] = useState<Client[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/users`,
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

      if (response.ok) {
        const data = await response.json();

        router.push(`/admin/produtos/`); //${data.id}`);
        toast.success("Usuário criado com sucesso!");
      } else {
        console.error("Failed to create user");
        const data = await response.json();

        toast.error("Houve um erro ao criar a categoria!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formConfig: formConfigInterface = {
    handleSubmit,
    setFormData,
    formData,
    handleChange,
    submitButtonText: "Criar Usuário",
  };
  return (
    <div className='wk-admin-page__wrapper'>
      <div className='container'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='list-clients-header'>
          <h1 className='wk-admin-page__title'>Novo Usuário</h1>
        </div>
        <UserForm formConfig={formConfig} />
      </div>
    </div>
  );
  return;
}
