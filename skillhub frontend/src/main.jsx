import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#0f172a", // Slate 900
              borderRadius: "16px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e2e8f0",
            },
            success: {
              iconTheme: {
                primary: "#8b5cf6", // Purple 600
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444", // Red 500
                secondary: "#fff",
              },
            },
          }}
        />
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);