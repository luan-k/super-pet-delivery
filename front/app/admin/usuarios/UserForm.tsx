"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import SaveIcon from "../../../public/admin-save.svg";
import Link from "next/link";
import NumberFormat from "react-number-format";
import { MdClear } from "react-icons/md";
import { Client } from "../fetchClients";
import { CreateUserRequest } from "./criar/page";
import { EditUserFormRequest } from "./[userid]/page";

export interface formConfigInterface {
  handleSubmit: (e: FormEvent) => void;
  setFormData: (data: CreateUserRequest) => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFormData: (data: CreateUserRequest | EditUserFormRequest) => void,
    formData: CreateUserRequest | EditUserFormRequest
  ) => void;
  formData: {
    username: string;
    full_name: string;
    email: string;
    password: string;
    role: string;
  };
  submitButtonText: string;
}

export default function UserForm({
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
            <h4 className=''>Nome de Usuário</h4>
            <input
              type='text'
              name='username'
              value={formConfig.formData.username}
              required
              placeholder='Ex: fulanodetal'
              onChange={(e) =>
                formConfig.handleChange(
                  e,
                  formConfig.setFormData,
                  formConfig.formData
                )
              }
            />
          </label>
          
          <label>
              <h4 className=''>Nome Completo</h4>
              <input
                type='text'
                name='name'
                value={formConfig.formData.full_name}
                placeholder='Ex: Fulano de Tal'
                required
                onChange={(e) =>
                  formConfig.handleChange(
                    e,
                    formConfig.setFormData,
                    formConfig.formData
                  )
                }
              />
            </label>
        </div>

        <div className='wk-form__row grid grid-cols-3 gap-9 gap-y'>
            <label>
              <h4 className=''>E-mail</h4>
              <input
                type='email'
                name='email'
                placeholder='Ex: fulano@gmail.com'
                value={formConfig.formData.email}
                required
                onChange={(e) =>
                  formConfig.handleChange(
                    e,
                    formConfig.setFormData,
                    formConfig.formData
                  )
                }
              />
            </label>
            <label>
              <h4 className=''>Senha</h4>
                <input
                className='w-full mb-6 '
                type='password'
                name='password'
                placeholder='Digite sua senha'
                value={formConfig.formData.password}
                onChange={(e) =>
                  formConfig.handleChange(
                    e,
                    formConfig.setFormData,
                    formConfig.formData
                  )
                }
                />
            </label>
        </div>

        <div className='wk-form__row grid grid-cols-3 gap-9 gap-y'>
            <label>
              <h4 className=''>Cargo</h4>
              <input
                type='string'
                name='role'
                placeholder='Ex: Admin'
                value={formConfig.formData.role}
                required
                onChange={(e) =>
                  formConfig.handleChange(
                    e,
                    formConfig.setFormData,
                    formConfig.formData
                  )
                }
              />
            </label>
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