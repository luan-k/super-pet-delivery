"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function IsAuthenticated() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = new Headers();
        const token = Cookies.get("access_token");
        headers.append("Authorization", `Bearer ${token}`);

        const response = await fetch(
          `http://localhost:8080/tokens/renew_access`,
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
  });

  return (
    <>
      <h1 className='text-3xl'>hello {username}</h1>
    </>
  );
}
