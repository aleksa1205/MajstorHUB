import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from "./routes/LandingPage.tsx";
import Register from "./routes/Register.tsx";
import RootLayout from "./components/Layouts/RootLayout.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import Login, { loader as loginLoader } from "./routes/Login.tsx";
import Success from "./routes/Success.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import ErrorBoundaryProvider from "./components/ErrorBoundary/ErrorBoundaryProvider.tsx";
import AuthorizedLayout from "./components/Layouts/AuthorizedLayout.tsx";
import Dashboard from "./components/AuthorizedComponents/DashboardComponents/Dashboard.tsx";
import AsideLayout from "./components/Layouts/AsideLayout.tsx";
import FirmaProfile from "./routes/UsersProfiles/FirmaProfile.tsx";
import KlijentProfile from "./routes/UsersProfiles/KlijentProfile.tsx";
import MajstorProfile from "./routes/UsersProfiles/MajstorProfile.tsx";
// import { QueryClient, QueryClientProvider } from "react-query";

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundaryProvider>
        <RootLayout />
      </ErrorBoundaryProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <ErrorBoundaryProvider>
            <LandingPage />
          </ErrorBoundaryProvider>
        ),
      },
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
    ],
    errorElement: <ErrorPage />,
  },

  {
    element: (
      <ErrorBoundaryProvider>
        <AuthorizedLayout />
      </ErrorBoundaryProvider>
    ),
    children: [
      {
        element: <AsideLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <ErrorBoundaryProvider>
                <Dashboard />
              </ErrorBoundaryProvider>
            ),
          },
          {
            path: "/klijenti",
            element: (
              <ErrorBoundaryProvider>
                <h1>Klijenti</h1>
              </ErrorBoundaryProvider>
            ),
          },
          {
            path: "/majstori",
            element: (
              <ErrorBoundaryProvider>
                <h1>Majstori</h1>
              </ErrorBoundaryProvider>
            ),
          },
          {
            path: "/firme",
            element: (
              <ErrorBoundaryProvider>
                <h1>Firme</h1>
              </ErrorBoundaryProvider>
            ),
          }
        ],
      },
      {
        path: '/klijenti/:id',
        element: (
          <ErrorBoundaryProvider>
            <KlijentProfile />
          </ErrorBoundaryProvider>
        ),
      },
      {
        path: '/majstori/:id',
        element: (
          <ErrorBoundaryProvider>
            <MajstorProfile />
          </ErrorBoundaryProvider>
        ),
      },
      {
        path: '/firme/:id',
        element: (
          <ErrorBoundaryProvider>
            <FirmaProfile />
          </ErrorBoundaryProvider>
        ),
      },
    ],
  },
]);

// const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
    <ErrorBoundaryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundaryProvider>
    {/* </QueryClientProvider> */}
  </React.StrictMode>
);
