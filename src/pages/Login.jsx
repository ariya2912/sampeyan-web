import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase"; 
import { getDoc, doc, getFirestore } from "firebase/firestore";

const db = getFirestore();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setError("User data not found in database.");
        setIsLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-5">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-3">Login here</h2>
        <p className="text-center text-gray-900 mb-6">Welcome back, you've been missed!</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-sm text-green-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 border-2 border-green-600 rounded-lg text-base focus:outline-none focus:border-green-800 transition"
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-[-0.5rem]">{error}</p>}
          <div className="text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-green-600 text-sm underline hover:text-green-800"
            >
              Forgot your password?
            </button>
          </div>
          <button
            className="bg-green-600 text-white py-4 text-lg rounded-lg cursor-pointer disabled:bg-green-300 disabled:cursor-not-allowed transition hover:bg-green-800"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-10 text-center text-gray-900 text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
          <button
            className="mt-3 border border-gray-400 rounded-full w-11 h-11 flex justify-center items-center mx-auto cursor-pointer hover:bg-gray-200 transition"
            onClick={handleGoogleSignIn}
            title="Sign in with Google"
          >
            <img src="src/assets/google.png" alt="Google sign-in" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
