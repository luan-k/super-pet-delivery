"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  identifier: string;
  password: string;
}

function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      // Load the access token from local storage on component mount
      return localStorage.getItem("accessToken");
    }
    return null;
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (typeof window !== "undefined" && localStorage) {
        const response = await fetch("http://localhost:8080/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();

          // Set the access token in local storage
          localStorage.setItem("accessToken", data.access_token);

          const refresh_token_expires_at = data.refresh_token_expires_at;
          document.cookie = `refreshToken=${
            data.refresh_token
          }; Secure; HttpOnly; SameSite=Strict; Path=/; Expires=${new Date(
            refresh_token_expires_at
          ).toUTCString()}`;

          // Update the access token state
          setAccessToken(data.access_token);

          // Log the response data
          console.log(data);
        } else {
          console.error("Login failed");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className='w-full mb-6 text-black'
          type='text'
          name='identifier'
          placeholder='Username or Email'
          value={formData.identifier}
          onChange={handleInputChange}
        />
        <input
          className='w-full mb-6 text-black'
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type='submit'>Login</button>
      </form>
    </>
  );
}

export default LoginForm;
