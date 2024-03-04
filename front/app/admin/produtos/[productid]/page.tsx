"use client";
import { toast } from "react-toastify";
import HistoryArrows from "../../components/HistoryArrows";
import ProductForm, { formConfigInterface } from "../ProductForm";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { ChangeEvent, useEffect, useState } from "react";
import { CreateProductRequest, handleChangeType } from "../criar/page";
import NumberFormat from "react-number-format";

export interface EditProductFormRequest {
  name: string;
  description: string;
  price: string;
  user_id: number;
  sku: string;
}
export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: string;
  user_id: number;
  sku: string;
}

export default function EditProduct() {
  const pathname = usePathname();
  var urlParts = pathname.split("/");
  var currentId = urlParts.at(-1);
  const [currentProduct, setCurrentProduct] = useState<ProductDetails | null>(
    null
  );
  const [formData, setFormData] = useState<EditProductFormRequest>({
    name: "",
    description: "",
    price: "",
    user_id: 0,
    sku: "",
  });

  const [displayPrice, setDisplayPrice] = useState("0,00");
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

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/products/${currentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data: ProductDetails = await response.json();

          setCurrentProduct(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchProductDetails();
  }, [currentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/products/${currentId}`,
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
        toast.success("Venda editada com sucesso!");
        // Add further actions or redirection upon successful creation
      } else {
        toast.error("Houve um erro ao editar a venda!");
        console.error("Failed to edit product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Update the form data when product details are fetched
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        user_id: currentProduct.user_id,
        sku: currentProduct.sku,
      });
      let newValue: string | number;
      newValue = parseFloat(currentProduct.price).toFixed(2); // convert to float and fix 2 decimal places
      setDisplayPrice(newValue.replace(".", ","));
    }
  }, [currentProduct]);

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

  const formConfig: formConfigInterface = {
    handleSubmit,
    formData,
    setFormData,
    handleChange,
    displayPrice,
    setDisplayPrice,
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
          <h1 className='wk-admin-page__title'>Editar Produto</h1>
        </div>
        <ProductForm formConfig={formConfig} />
      </div>
    </div>
  );
  return;
}
