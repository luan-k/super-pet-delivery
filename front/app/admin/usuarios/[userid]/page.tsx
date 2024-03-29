"use client";
import { toast } from "react-toastify";
import HistoryArrows from "../../components/HistoryArrows";
import UserForm, { formConfigInterface } from "../UserForm";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { ChangeEvent, useEffect, useState } from "react";
import { CreateUserRequest, handleChangeType } from "../criar/page";
import NumberFormat from "react-number-format";

export interface EditUserFormRequest {
  name: string;
  description: string;
}
export interface UserDetails {
  id: number;
  name: string;
  description: string;
}

export default function EditUser() {
  const pathname = usePathname();
  var urlParts = pathname.split("/");
  var currentId = urlParts.at(-1);
  const [currentUser, setCurrentUser] = useState<UserDetails | null>(
    null
  );
  const [formData, setFormData] = useState<EditUserFormRequest>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/users/${currentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data:UserDetails = await response.json();

          setCurrentUser(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchUserDetails();
  }, [currentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/users/${currentId}`,
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
        toast.success("Usuário editado com sucesso!");
        // Add further actions or redirection upon successful creation
      } else {
        toast.error("Houve um erro ao editar o usuário!");
        console.error("Failed to edit user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Update the form data when user details are fetched
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        description: currentUser.description,
      });
    }
  }, [currentUser]);

const handleChange: handleChangeType = (
    e,
    setFormData,
    formData
) => {
    const { name, value } = e.target;

    setFormData({
        ...formData,
        [name]: value,
    });
};

  const formConfig: formConfigInterface = {
    handleSubmit,
    formData,
    setFormData,
    handleChange,
    submitButtonText: "Salvar",
  };
  return (
    <div className='wk-admin-page__wrapper'>
      <div className='container'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='list-clients-header'>
          <h1 className='wk-admin-page__title'>Editar Usuário</h1>
        </div>
        <UserForm formConfig={formConfig} />
      </div>
    </div>
  );
  return;
}