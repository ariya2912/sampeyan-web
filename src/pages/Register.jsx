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
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: Arial, sans-serif;
          background-color: #f9fafb;
          color: #2f855a;
        }
        .register-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .register-container {
          background: #fff;
          padding: 40px 48px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 480px;
          box-sizing: border-box;
          margin: 0 10px;
        }
        h2 {
          margin: 0 0 12px 0;
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          color: #4CAF50;
        }
        form.register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-weight: 600;
          font-size: 14px;
          color: #2f855a;
        }
        .form-input {
          padding: 12px 16px;
          border: 2px solid #4CAF50;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #388E3C;
          outline: none;
        }
        .error-message {
          color: #e53e3e;
          font-size: 14px;
          margin-top: -8px;
        }
        button.submit-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 16px;
          font-size: 18px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 100%;
        }
        button.submit-btn:disabled {
          background-color: #A5D6A7;
          cursor: not-allowed;
        }
        button.submit-btn:hover:not(:disabled) {
          background-color: #388E3C;
        }
        /* Responsive tweaks */
        @media (max-width: 480px) {
          .register-container {
            padding: 20px 16px;
            max-width: 100%;
            margin: 0 8px;
          }
          h2 {
            font-size: 24px;
          }
          .form-label {
            font-size: 12px;
          }
          .form-input {
            font-size: 14px;
          }
          button.submit-btn {
            font-size: 14px;
            padding: 12px;
          }
        }
        @media(min-width: 768px) {
          .register-container {
            padding: 48px 40px;
            max-width: 480px;
          }
          h2 {
            font-size: 32px;
          }
          .form-label {
            font-size: 14px;
          }
          .form-input {
            font-size: 16px;
          }
          button.submit-btn {
            font-size: 18px;
            padding: 16px;
          }
        }
        @media(min-width: 1024px) {
          .register-wrapper {
            background-color: #f0fff4;
          }
          .register-container {
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            border-radius: 12px;
          }
        }
      `}</style>

      <div className="register-wrapper">
        <div className="register-container">
          <h2>Register</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => {
              setName(e.target.value);
              handleInputChange();
            }}
            className="form-input"
            required
          />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              handleInputChange();
            }}
            className="form-input"
            required
          />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              handleInputChange();
            }}
            className="form-input"
            required
          />
            </div>
            <button className="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          <p style={{ marginTop: "16px", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "#4CAF50", fontWeight: "bold", textDecoration: "none" }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
