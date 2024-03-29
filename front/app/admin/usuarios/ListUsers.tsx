"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import WkTable, { TableConfig } from "../components/WkTable";
import { toast } from "react-toastify";

export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
}

interface ListUserResponse {
  total: number;
  users: User[];
}

export default function ListUsers() {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [usersPerPage, setUsersPerPage] = useState<number>(10);
  const [listUserResponse, setListUserResponse] = useState<User[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  async function fetchUsers(
    pageId: number,
    pageSize: number,
    sortField: string | null,
    sortDirection: "asc" | "desc" | null,
    search?: string
  ): Promise<void> {
    try {
      const token = Cookies.get("access_token");
      let url = `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/users?page_id=${pageId}&page_size=${pageSize}`;

      if (sortField && sortDirection) {
        url += `&sort_field=${sortField}&sort_direction=${sortDirection}`;
      }

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

      if (response.ok) {
        const data = await response.json();
        setListUserResponse(data);
        console.log(data);
        setTotalItems(data.length);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers(
      currentPage,
      usersPerPage,
      sortField,
      sortDirection,
      search
    );
  }, [currentPage, usersPerPage, sortField, sortDirection, search]);

  async function handleDelete(itemId: number): Promise<void> {
    const token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080/users/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchUsers(
          currentPage,
          usersPerPage,
          sortField,
          sortDirection,
          search
        );
        toast.success("Usuário deletado com sucesso!");
      } else {
        console.error("Failed to delete user");

        toast.error("Houve um erro ao deletar o Usuário!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const tableConfig: TableConfig = {
    topClasses: "wk-table--user",
    interact: {
      edit: listUserResponse
        ? listUserResponse.map((user) => `/admin/usuarios/${user.id}`)
        : [],
      duplicate: false,
      delete: {
        eventFunction: handleDelete,
        items: listUserResponse
          ? listUserResponse.map((user) => user.id)
          : [],
      },
    },
    totalNumberOfItems: totalItems,
    pages: {
      currentPage: {
        value: currentPage,
        setter: setCurrentPage,
      },
      itemsPerPage: usersPerPage,
      setItemsPerPage: setUsersPerPage,
    },
    searchBar: {
      search: search,
      setSearch: setSearch,
      placeholder: "Pesquise por Nome ou Descrição...",
    },
    sortInfo: {
      field: sortField,
      direction: sortDirection,
      handleSort: handleSort,
    },
    columns: [
      {
        title: "Nome de Usuário",
        key: "username",
        sortable: true,
        width: 30,
        items: listUserResponse
          ? listUserResponse.map((user) => (
              <>
                <span className='text-wk-secondary'> [ </span>
                { user.id.toString().padStart(3, "0") }
                <span className='text-wk-secondary'> ] </span>
                {user.username}
              </>
            ))
          : [],
      },
      {
        title: "Nome Completo",
        key: "full_name",
        sortable: true,
        width: 30,
        items: listUserResponse
        ? listUserResponse.map((user) => (
              <>
                  {user.full_name}
              </>
            ))
        : [],
      },
      {
        title: "Email",
        key: "email",
        sortable: true,
        width: 50,
        items: listUserResponse
        ? listUserResponse.map((user) => (
              <>
                  {user.email}
              </>
            ))
        : [],
      },
      {
        title: "Cargo",
        key: "role",
        sortable: true,
        width: 30,
        items: listUserResponse
        ? listUserResponse.map((user) => (
              <>
                  {user.role}
              </>
            ))
        : [],
      },
    ],
  };

  return (
    <>
      <WkTable config={tableConfig} />
    </>
  );
}
