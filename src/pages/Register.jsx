import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
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
      alert(error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2" required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2" required />
        <button className="bg-blue-600 text-white p-2 rounded" type="submit">Register</button>
      </form>
    </div>
  );
}
