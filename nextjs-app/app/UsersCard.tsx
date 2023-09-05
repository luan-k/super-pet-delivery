import React, { useState } from "react";
import { Item } from "./listUsers";

interface UsersCardProps {
  item: Item;
  onDelete: () => void;
}

export default function UsersCard({ item, onDelete }: UsersCardProps) {
  let cardData: JSX.Element;
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [hasBeenUpdated, setHasBeenUpdated] = useState(false);

  const handleEditClick = (): void => {
    setHasBeenUpdated(false);
    setIsEditing(true);

    console.log("editing");
  };

  const handleDeleteClick = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${editedItem.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("User deleted successfully");

        // Trigger the parent component's delete success function
        onDelete();

        // Reset editedItem and hasBeenUpdated state
        setEditedItem(item);
        setHasBeenUpdated(false);
      } else {
        console.log("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCancelClick = (): void => {
    setIsEditing(false);
    console.log("cancel");
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    propertyName: string
  ) => {
    const { value } = event.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [propertyName]: value,
    }));
    console.log(editedItem);
  };

  const handleSubmit = async () => {
    console.log("Edited data:", editedItem);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${editedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedItem),
        }
      );

      if (response.ok) {
        console.log("User data updated successfully");
        setIsEditing(false);
        setHasBeenUpdated(true);
      } else {
        console.log("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (isEditing === true) {
    cardData = (
      <>
        <input
          className='mt-3 rounded-2xl bg-slate-800 border-2 border-white'
          type='text'
          name='username'
          value={editedItem.username}
          onChange={(e) => handleInputChange(e, "username")}
        />
        <input
          className='mt-3 rounded-2xl bg-slate-800 border-2 border-white'
          type='text'
          name='full_name'
          value={editedItem.full_name}
          onChange={(e) => handleInputChange(e, "full_name")}
        />
        <input
          className='mt-3 rounded-2xl bg-slate-800 border-2 border-white'
          type='text'
          name='email'
          value={editedItem.email}
          onChange={(e) => handleInputChange(e, "email")}
        />
        <div className='button-wrapper grid grid-cols-2 gap-2 mt-6'>
          <button
            className='text-center p-1 bg-green-500 rounded-xl hover:bg-green-600 transition-all'
            onClick={handleSubmit}>
            Submit
          </button>
          <button
            className='text-center p-1 bg-gray-500 rounded-xl hover:bg-gray-600 transition-all'
            onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </>
    );
  } else {
    cardData = (
      <>
        <h3 className=''>Username: test {item.username}</h3>
        <h3 className=''>Full Name: {item.full_name}</h3>
        <h3 className=''>Email: {item.email}</h3>
        <div className='button-wrapper grid grid-cols-2 gap-2 mt-6'>
          <button
            onClick={handleEditClick}
            className='text-center p-1 bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-all'>
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className='text-center p-1 bg-red-500 rounded-xl hover:bg-red-600 transition-all'>
            delete
          </button>
        </div>
      </>
    );
  }
  if (hasBeenUpdated === true) {
    cardData = (
      <>
        <h3 className=''>Username: {editedItem.username}</h3>
        <h3 className=''>Full Name: {editedItem.full_name}</h3>
        <h3 className=''>Email: {editedItem.email}</h3>
        <div className='button-wrapper grid grid-cols-2 gap-2 mt-6'>
          <button
            onClick={handleEditClick}
            className='text-center p-1 bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-all'>
            Edit
          </button>
          <button className='text-center p-1 bg-red-500 rounded-xl hover:bg-red-600 transition-all'>
            delete
          </button>
        </div>
      </>
    );
  }

  return (
    <div className='bg-slate-800 p-12 rounded-2xl text-white' key={item.id}>
      test
      {cardData}
    </div>
  );
}
