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
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: Arial, sans-serif;
          background-color: #fff;
          color: #2f855a;
        }
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background-color: #f9fafb;
        }
        .login-container {
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
        p.subtitle {
          margin: 0 0 24px 0;
          text-align: center;
          font-size: 16px;
          color: #000000DE;
        }
        form.login-form {
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
        .forgot-password {
          text-align: right;
        }
        .forgot-password-btn {
          background: none;
          border: none;
          color: #4CAF50;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }
        .forgot-password-btn:hover {
          color: #388E3C;
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
        .google-signin {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #000000DE;
        }
        .google-button {
          margin-top: 12px;
          border: 1.5px solid #a0aec0;
          border-radius: 50%;
          background: transparent;
          width: 44px;
          height: 44px;
          cursor: pointer;
          font-size: 20px;
          line-height: 44px;
          color: #2d3748;
          user-select: none;
          transition: background-color 0.2s ease;
        }
        .google-button:hover {
          background-color: #e2e8f0;
        }

        /* Responsive tweaks */
        @media (max-width: 480px) {
          .login-container {
            padding: 20px 16px;
            max-width: 100%;
            margin: 0 8px;
          }
          h2 {
            font-size: 24px;
          }
          p.subtitle {
            font-size: 13px;
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
          .google-button {
            width: 40px;
            height: 40px;
            font-size: 18px;
            line-height: 40px;
          }
        }
        @media(min-width: 768px) {
          .login-container {
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
          .login-wrapper {
            background-color: #f0fff4;
          }
          .login-container {
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            border-radius: 12px;
          }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-container">
          <h2>Login here</h2>
          <p className="subtitle">Welcome back, you've been missed!</p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="forgot-password">
              <button type="button" onClick={handleResetPassword} className="forgot-password-btn">
                Forgot your password?
              </button>
            </div>
            <button className="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="google-signin">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Register here
              </Link>
            </p>
            <button className="google-button" onClick={handleGoogleSignIn} title="Sign in with Google">
              <img src="src/assets/google.png" alt="Google sign-in" style={{ width: '24px', height: '24px', verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
