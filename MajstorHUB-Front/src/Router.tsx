import AuthorizedLayout from "./components/Layouts/AuthorizedLayout.tsx";
import Dashboard from "./components/AuthorizedComponents/DashboardComponents/Dashboard.tsx";
import FirmaProfile from "./routes/UsersProfiles/FirmaProfile.tsx";
import KlijentProfile from "./routes/UsersProfiles/KlijentProfile.tsx";
import MajstorProfile from "./routes/UsersProfiles/MajstorProfile.tsx";
import LandingPage from "./routes/LandingPage.tsx";
import Register from "./routes/Auth/Register.tsx";
import RootLayout from "./components/Layouts/RootLayout.tsx";
import ErrorPage from "./components/ErrorBoundary/ErrorPages/ErrorPage.tsx";
import Login, { loader as loginLoader } from "./routes/Auth/Login.tsx";
import Success, {loader as successLoader} from "./routes/Success.tsx";
import { createBrowserRouter } from "react-router-dom";
import ErrorBoundaryProvider from "./components/ErrorBoundary/ErrorBoundaryProvider.tsx";
import Klijenti from "./routes/Filter/Klijenti.tsx";
import Majstori from "./routes/Filter/Majstori.tsx";
import Firme from "./routes/Filter/Firme.tsx";
import RestoreScrollLayout from "./components/Layouts/RestoreScrollLayout.tsx";
import Novac, { loader as NovacLoader } from "./routes/Novac.tsx";
import PostaviOglas from "./routes/Oglasi/PostaviOglas.tsx";
import FirmaRequiredLayout from "./components/Layouts/FirmaRequiredLayout.tsx";
import Oglasi from "./routes/Oglasi/Oglasi.tsx";
import OglasPrikaz from "./routes/Oglasi/OglasPrikaz.tsx";
import AsideLayout from "./components/Layouts/AsideLayout.tsx";
import Forbidden from "./components/ErrorBoundary/ErrorPages/Forbidden.tsx";
import AdminRequiredLayout from "./components/Layouts/AdminRequiredLayout.tsx";
import AdminDashboard from "./routes/Admin/AdminDashboard.tsx";


export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <RestoreScrollLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
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
          { path: "/success", element: <Success />, loader: successLoader },
          { path: "/forbidden", element: <Forbidden />}
        ],
      },

      {
        errorElement: <ErrorPage />,
        element: (
          <ErrorBoundaryProvider>
            <AuthorizedLayout />
          </ErrorBoundaryProvider>
        ),
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
            path: "/novac",
            element: (
              <ErrorBoundaryProvider>
                <Novac />
              </ErrorBoundaryProvider>
            ),
            loader: NovacLoader,
          },
          {
            element: <AsideLayout />,
            children: [
              {
                path: "/klijenti",
                element: (
                  <ErrorBoundaryProvider>
                    <Klijenti />
                  </ErrorBoundaryProvider>
                ),
              },
              {
                path: "/majstori",
                element: (
                  <ErrorBoundaryProvider>
                    <Majstori />
                  </ErrorBoundaryProvider>
                ),
              },
              {
                path: "/firme",
                element: (
                  <ErrorBoundaryProvider>
                    <Firme />
                  </ErrorBoundaryProvider>
                ),
              },
              {
                path: "/oglasi",
                element: (
                  <ErrorBoundaryProvider>
                    <Oglasi />
                  </ErrorBoundaryProvider>
                ),
              },
            ]
          },
          {
            path: "/klijenti/:id",
            element: (
              <ErrorBoundaryProvider>
                <KlijentProfile />
              </ErrorBoundaryProvider>
            ),
          },
          {
            path: "/majstori/:id",
            element: (
              <ErrorBoundaryProvider>
                <MajstorProfile />
              </ErrorBoundaryProvider>
            ),
          },
          {
            path: "/firme/:id",
            element: (
              <ErrorBoundaryProvider>
                <FirmaProfile />
              </ErrorBoundaryProvider>
            ),
          },
          {
            path: "/oglasi/:id",
            element: (
              <ErrorBoundaryProvider>
                <OglasPrikaz />
              </ErrorBoundaryProvider>
            ),
          },

          {
            element: <FirmaRequiredLayout />,
            children: [
              {
                path: "/postavi-oglas",
                element: (
                  <ErrorBoundaryProvider>
                    <PostaviOglas />
                  </ErrorBoundaryProvider>
                ),
              },
            ],
          },

          {
            element: <AdminRequiredLayout />,
            children: [
              {
                path: "/admin-dashboard",
                element: (
                  <ErrorBoundaryProvider>
                    <AdminDashboard />
                  </ErrorBoundaryProvider>
                )
              }
            ]
          }
        ],
      },
    ],
  },
]);
