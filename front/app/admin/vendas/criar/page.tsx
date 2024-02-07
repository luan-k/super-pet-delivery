"use client";
import { useRouter } from "next/navigation";
import HistoryArrows from "../../components/HistoryArrows";
import SaleForm from "../form";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import React from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { formConfigInterface } from "../form";

interface CreateSaleRequest {
  client_id: number;
  product: string;
  price: string;
  observation: string;
}

export interface ListClientResponse {
  total: number;
  clients: Client[];
}

export interface Client {
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

export default function CreateSale() {
  const router = useRouter();
  const [listClientResponse, setListClientResponse] =
    useState<ListClientResponse>({
      total: 0,
      clients: [],
    });
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<CreateSaleRequest>({
    client_id: 0,
    product: "",
    price: "",
    observation: "",
  });
  const [selectedClientName, setSelectedClientName] = React.useState("");
  const [displayPrice, setDisplayPrice] = useState("0,00");
  const [searchClient, setSearchClient] = useState("");
  const [searchResults, setSearchResults] = useState<Client[]>([]);

  const fetchClients = async (
    pageId: number,
    pageSize: number,
    sortField: string | null,
    sortDirection: "asc" | "desc" | null,
    search?: string
  ) => {
    try {
      const token = Cookies.get("access_token");
      let url =
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/clients?page_id=${pageId}&page_size=${pageSize}` +
        (sortField && sortDirection
          ? `&sort_field=${sortField}&sort_direction=${sortDirection}`
          : "");

      // Add the search parameter to the URL if it's provided
      if (search) {
        url += `&search=${search}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(true);

      if (response.ok) {
        const data: ListClientResponse = await response.json();
        setListClientResponse(data);
        setSearchResults(data.clients);
        console.log(data);
        setLoading(false);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // Add a new function to handle when a client is selected from the search results
  const handleClientSelect = (client: Client) => {
    setFormData({
      ...formData,
      client_id: client.id,
    });
    setSearchClient(
      `[ ${client.id.toString().padStart(3, "0")} ] ${client.full_name}`
    );
    setSearchResults([]); // clear the search results
  };

  useEffect(() => {
    if (searchClient) {
      fetchClients(1, 10, null, null, searchClient);
    } else {
      setSearchResults([]); // clear the search results if the input is empty
    }
  }, [searchClient]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
  const handlePriceChange = (value: string) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");
    console.log(formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/sales`,
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

  const formConfig: formConfigInterface = {
    handleSubmit,
    searchClient,
    setSearchClient,
    searchResults,
    handleClientSelect,
    formData,
    handleChange,
    displayPrice,
    handlePriceChange,
    submitButtonText: "Criar Venda",
  };
  return (
    <div className='wk-admin-page__wrapper'>
      <div className='container'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='list-clients-header'>
          <h1 className='wk-admin-page__title'>Nova Venda</h1>
        </div>
        <SaleForm formConfig={formConfig} />
      </div>
    </div>
  );
  return;
}
