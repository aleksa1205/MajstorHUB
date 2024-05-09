import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./routes/LandingPage.tsx";
import Register from "./routes/Register.tsx";
import RootLayout from "./routes/RootLayout.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import Login, { loader as loginLoader } from "./routes/Login.tsx";
import Success from "./routes/Success.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { requireAuth } from "./lib/utils.ts";
import ErrorBoundaryProvider from "./components/ErrorBoundary/ErrorBoundaryProvider.tsx";

const router = createBrowserRouter([
  {
    element:
    <ErrorBoundaryProvider>
      <RootLayout />
    </ErrorBoundaryProvider>,
    children: [
      { path: "/", element:
      <ErrorBoundaryProvider>
        <LandingPage />
      </ErrorBoundaryProvider> },
      {
        path: "/login",
        element: (
          <ErrorBoundaryProvider>
            <Login />
          </ErrorBoundaryProvider>
        ),
        loader: loginLoader,
      },
      {
        path: "/register",
        element: (
          <ErrorBoundaryProvider>
            <Register />
          </ErrorBoundaryProvider>
        ),
      },
      { path: "/success", element: <Success /> },
      {
        path: "/dashboard",
        element: <h1>Tekst</h1>,
        loader: () => requireAuth(),
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundaryProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </ErrorBoundaryProvider>
  </React.StrictMode>
);
