"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ModalDialogClientsList from "../../components/ModalDialogClientsList";
import { toast } from "react-toastify";

interface EditSaleFormRequest {
  client_id: number;
  product: string;
  price: number;
  observation: string;
}
interface SaleDetails {
  id: number;
  client_id: number;
  product: string;
  price: number;
  observation: string;
}

const EditSaleForm: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  var urlParts = pathname.split("/");
  var currentId = urlParts.at(-1);
  const [selectedClientName, setSelectedClientName] = React.useState("");

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          `http://localhost:8080/sales/${currentId}`,
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
          setSelectedClientName(data.client_id.toString()); // Assuming client_id can be used as the client name
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

  const [currentSale, setCurrentSale] = useState<SaleDetails | null>(null);
  const [formData, setFormData] = useState<EditSaleFormRequest>({
    client_id: 0, // Update field names to match Go structure
    product: "",
    price: 0,
    observation: "",
  });

  //fetch client name
  useEffect(() => {
    const fetchClientName = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          `http://localhost:8080/clients/${currentSale?.client_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSelectedClientName(data.full_name);
        } else {
          console.error("Failed to fetch client name");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchClientName();
  }, [currentSale]);

  // Update the form data when sale details are fetched
  useEffect(() => {
    if (currentSale) {
      setFormData({
        client_id: currentSale.client_id,
        product: currentSale.product,
        price: currentSale.price,
        observation: currentSale.observation,
      });
      setSelectedClientName(currentSale.client_id.toString());
    }
  }, [currentSale]);

  // Define the handleChange function to update the form data
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
      const response = await fetch(`http://localhost:8080/sales/${currentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

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

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("access_token");

    try {
      const response = await fetch(`http://localhost:8080/sales/${currentId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Sale Deleted successfully!");
        router.push(`/admin/vendas/`);
        toast.success("Venda deletada com sucesso!");
      } else {
        console.error("Failed to delete sale");
        console.log(response.json());
        toast.error("Houve um erro ao deletar a venda!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='text-2xl wk-create-client'>
      <form className='grid grid-cols-1' onSubmit={handleSubmit}>
        {/* <div className='wk-create-client__input-wrapper'>
          <label>
            <h4 className='wk-create-client__title'>Cliente</h4>
            <div className='flex'>
              <input
                type='text'
                name='client_id'
                value={selectedClientName}
                readOnly
                className='wk-create-client__input'
              />
              <ModalDialogClientsList
                onClientSelect={(clientId, clientName) => {
                  setFormData({ ...formData, client_id: clientId });
                  setSelectedClientName(clientName);
                }}
              />
            </div>
          </label>
        </div> */}

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

        <div className='grid grid-cols-2'>
          <div>
            <button className='wk-btn wk-btn--bg wk-btn--green' type='submit'>
              Editar Venda
            </button>
          </div>
          <div className='flex justify-end'>
            <button
              className='wk-btn wk-btn--bg wk-btn--red'
              onClick={handleDelete}>
              Deletar Venda
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSaleForm;
