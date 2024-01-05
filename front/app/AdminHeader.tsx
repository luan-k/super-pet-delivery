"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import "./styles/admin/header.scss";

export default function IsAuthenticated() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);

        const response = await fetch(
          `http://superpetdelivery.com.br:8080/tokens/renew_access`,
          {
            method: "POST",
            credentials: "include",
            headers: headers,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          console.log(data);
        } else {
          console.error("Failed to fetch data");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='wkode-admin-header'>
        <h1 className='text-3xl text-right'>Olá {username}</h1>
      </div>
    </>
  );
}
