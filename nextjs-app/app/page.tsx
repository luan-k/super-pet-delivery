"use client";
import React, { useState } from "react"; // Import useState
import ListUsers from "./listUsers";
import CreateUser from "./createUser";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger refresh

  const handleUserCreationSuccess = () => {
    // Handle successful user creation, e.g., show a success message
    console.log("User created successfully!");
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger refresh
  };
  const handleUserDelete = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger refresh
    console.log("refresh");
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <ListUsers refreshKey={refreshKey} onDelete={handleUserDelete} />{" "}
      {/* Pass refresh key as a prop */}
      <CreateUser onSuccess={handleUserCreationSuccess} />
    </main>
  );
}
