import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect ke halaman login setelah logout
    } catch (error) {
      alert("Gagal logout: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Welcome, {auth.currentUser?.displayName || auth.currentUser?.email || "User"}!
      </h1>
      <button 
        onClick={handleLogout} 
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
