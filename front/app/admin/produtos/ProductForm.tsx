"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import SaveIcon from "../../../public/admin-save.svg";
import Link from "next/link";
import NumberFormat from "react-number-format";
import { MdClear } from "react-icons/md";
import { Client } from "../fetchClients";
import { CreateProductRequest } from "./criar/page";
import { EditProductFormRequest } from "./[productid]/page";

export interface formConfigInterface {
  handleSubmit: (e: FormEvent) => void;
  setFormData: (data: CreateProductRequest) => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setDisplayPrice: (data: string) => void,
    setFormData: (data: CreateProductRequest | EditProductFormRequest) => void,
    formData: CreateProductRequest | EditProductFormRequest
  ) => void;
  formData: {
    name: string;
    description: string;
    price: string;
    sku?: string;
    user_id: number;
  };
  displayPrice: string;
  setDisplayPrice: (data: string) => void;
  handlePriceChange: (
    value: string,
    setDisplayPrice: (data: string) => void,
    setFormData: (data: CreateProductRequest | EditProductFormRequest) => void,
    formData: CreateProductRequest | EditProductFormRequest
  ) => void;
  submitButtonText: string;
}

export default function ProductForm({
  formConfig,
}: {
  formConfig: formConfigInterface;
}) {
  const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(
    null
  );

  return (
    <div className='wk-form'>
      <form className='' onSubmit={formConfig.handleSubmit}>
        <h2 className='wk-form__row-title'>Informações Básicas</h2>
        <div className='wk-form__row grid grid-cols-3 gap-9 gap-y'>
          <label>
            <h4 className=''>Nome</h4>
            <input
              type='text'
              name='name'
              value={formConfig.formData.name}
              required
              placeholder='Ex: Ração para cachorro'
              onChange={(e) =>
                formConfig.handleChange(
                  e,
                  formConfig.setDisplayPrice,
                  formConfig.setFormData,
                  formConfig.formData
                )
              }
            />
          </label>

          <div className=''>
            <label>
              <h4 className=''>Preço</h4>
              <NumberFormat
                value={formConfig.displayPrice}
                onValueChange={(values: any) => {
                  formConfig.handlePriceChange(
                    values.value,
                    formConfig.setDisplayPrice,
                    formConfig.setFormData,
                    formConfig.formData
                  );
                }}
                required
                thousandSeparator='.'
                decimalSeparator=','
                prefix={"R$ "}
              />
            </label>
          </div>
        </div>

        <div className='wk-form__row grid grid-cols-3 gap-9 gap-y'>
          <div className=''>
            <label>
              <h4 className=''>Descrição</h4>
              <textarea
                name='description'
                value={formConfig.formData.description}
                required
                onChange={(e) =>
                  formConfig.handleChange(
                    e,
                    formConfig.setDisplayPrice,
                    formConfig.setFormData,
                    formConfig.formData
                  )
                }
              />
            </label>
          </div>
          <div className=''>
            <label>
              <h4 className=''>Código (opcional)</h4>
              <input
                type='text'
                name='sku'
                value={formConfig.formData.sku}
                placeholder='Código Único ou SKU do produto'
                onChange={(e) =>
                  formConfig.handleChange(
                    e,
                    formConfig.setDisplayPrice,
                    formConfig.setFormData,
                    formConfig.formData
                  )
                }
              />
            </label>
          </div>
        </div>

        <div className='wk-form__footer'>
          <button className='wk-btn wk-btn--md wk-btn--primary' type='submit'>
            {formConfig.submitButtonText || "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
