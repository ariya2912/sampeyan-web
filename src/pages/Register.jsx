import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        role: "user"
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = () => {
    if (error) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-5">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-6">Register</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-semibold text-sm text-green-700">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => {
                setName(e.target.value);
                handleInputChange();
              }}
              required
              className="px-4 py-3 border-2 border-green-600 rounded-lg text-base focus:outline-none focus:border-green-800 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-sm text-green-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                handleInputChange();
              }}
              required
              className="px-4 py-3 border-2 border-green-600 rounded-lg text-base focus:outline-none focus:border-green-800 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-sm text-green-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                handleInputChange();
              }}
              required
              className="px-4 py-3 border-2 border-green-600 rounded-lg text-base focus:outline-none focus:border-green-800 transition"
            />
          </div>
          <button
            className="bg-green-600 text-white py-4 text-lg rounded-lg cursor-pointer disabled:bg-green-300 disabled:cursor-not-allowed transition hover:bg-green-800"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-900 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
