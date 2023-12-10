"use client";
import Router, { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  identifier: string;
  password: string;
}

function LoginForm() {
  const router = useRouter();
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
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();

          // Update the access token state
          setAccessToken(data.access_token);
          router.push("/admin");
        } else {
          console.error("Login failed");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className='wkode-login-form__wrapper'>
      <form onSubmit={handleSubmit}>
        <input
          className='w-full mb-6 text-black'
          type='text'
          name='identifier'
          placeholder='Nome de Usuario ou Email'
          value={formData.identifier}
          onChange={handleInputChange}
        />
        <input
          className='w-full mb-6 text-black'
          type='password'
          name='password'
          placeholder='Senha'
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          className='wk-btn wk-btn--bg wk-btn--green mt-12 w-full'
          type='submit'>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
