"use client";
import { toast } from "react-toastify";
import HistoryArrows from "../../components/HistoryArrows";
import SaleForm, { formConfigInterface } from "../form";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { ChangeEvent, useEffect, useState } from "react";
import { Client, ListClientResponse } from "../criar/page";

interface EditSaleFormRequest {
  client_id: number;
  product: string;
  price: string;
  observation: string;
}
interface SaleDetails {
  id: number;
  client_id: number;
  client_name: string;
  product: string;
  price: string;
  observation: string;
}

export default function EditSale() {
  const pathname = usePathname();
  var urlParts = pathname.split("/");
  var currentId = urlParts.at(-1);
  const [currentSale, setCurrentSale] = useState<SaleDetails | null>(null);
  const [formData, setFormData] = useState<EditSaleFormRequest>({
    client_id: 0, // Update field names to match Go structure
    product: "",
    price: "",
    observation: "",
  });
  const [searchClient, setSearchClient] = useState();
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [displayPrice, setDisplayPrice] = useState("0,00");
  const [listClientResponse, setListClientResponse] =
    useState<ListClientResponse>({
      total: 0,
      clients: [],
    });

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
      //setLoading(true);

      if (response.ok) {
        const data: ListClientResponse = await response.json();
        setListClientResponse(data);
        setSearchResults(data.clients);
        console.log(data);
        //setLoading(false);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      //setLoading(false);
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

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/sales/${currentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: SaleDetails = await response.json();
          console.log(data);
          setCurrentSale(data);
        } else {
          console.error("Failed to fetch sales");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchSaleDetails();
  }, [currentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");
    console.log(formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/sales/${currentId}`,
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
        console.log("Sale Edited successfully!");
        toast.success("Venda editada com sucesso!");
        // Add further actions or redirection upon successful creation
      } else {
        toast.error("Houve um erro ao editar a venda!");
        console.error("Failed to edit sale");
        console.log(response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Update the form data when sale details are fetched
  useEffect(() => {
    if (currentSale) {
      setFormData({
        client_id: currentSale.client_id,
        product: currentSale.product,
        price: currentSale.price,
        observation: currentSale.observation,
      });
      setSearchClient(currentSale.client_name);
      setDisplayPrice(currentSale.price);
    }
  }, [currentSale]);

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
    submitButtonText: "Salvar",
  };
  return (
    <div className='wk-admin-page__wrapper'>
      <div className='container'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='list-clients-header'>
          <h1 className='wk-admin-page__title'>Editar Venda</h1>
        </div>
        <SaleForm formConfig={formConfig} />
      </div>
    </div>
  );
  return;
}
