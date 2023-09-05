import { useState } from "react";

interface CreateUserProps {
  onSuccess: () => void; // Callback function to handle success
}

const CreateUser: React.FC<CreateUserProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          full_name: fullName,
          email: email,
        }),
      });

      if (response.ok) {
        onSuccess(); // Call the success callback
        // Clear input fields after successful creation
        setUsername("");
        setFullName("");
        setEmail("");
      } else {
        console.error("Error creating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className='mt-12 rounded-2xl w-1/2 mx-auto bg-slate-800 p-12 text-center flex flex-col gap-6'>
      <h2 className='text-2xl font-bold'>Create User</h2>
      <div>
        <label className='text-xl font-semibold'>Username:</label> <br />
        <input
          className='mt-3 rounded-2xl bg-slate-800 border-2 border-white'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className='text-xl font-semibold'>Full Name:</label> <br />
        <input
          className='mt-3 rounded-2xl bg-slate-800 border-2 border-white'
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label className='text-xl font-semibold'>Email:</label> <br />
        <input
          className='mt-3 rounded-2xl bg-slate-800 border-2 border-white'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        className='text-center p-9 bg-cyan-950 rounded-2xl hover:bg-cyan-800 transition-all'
        onClick={handleCreateUser}>
        Create User
      </button>
    </div>
  );
};

export default CreateUser;
