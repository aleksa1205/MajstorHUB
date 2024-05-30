import AuthorizedLayout from "./components/Layouts/AuthorizedLayout.tsx";
import Dashboard from "./components/AuthorizedComponents/DashboardComponents/Dashboard.tsx";
import FirmaProfile from "./routes/UsersProfiles/FirmaProfile.tsx";
import KlijentProfile from "./routes/UsersProfiles/KlijentProfile.tsx";
import MajstorProfile from "./routes/UsersProfiles/MajstorProfile.tsx";
import LandingPage from "./routes/LandingPage.tsx";
import Register from "./routes/Auth/Register.tsx";
import RootLayout from "./components/Layouts/RootLayout.tsx";
import ErrorPage from "./components/ErrorPages/ErrorPage.tsx";
import Login, { loader as loginLoader } from "./routes/Auth/Login.tsx";
import Success from "./routes/Success.tsx";
import { createBrowserRouter } from "react-router-dom";
import ErrorBoundaryProvider from "./components/ErrorBoundary/ErrorBoundaryProvider.tsx";
import Klijenti from "./routes/Filter/Klijenti.tsx";
import Majstori from "./routes/Filter/Majstori.tsx";
import Firme from "./routes/Filter/Firme.tsx";
import RestoreScrollLayout from "./components/Layouts/RestoreScrollLayout.tsx";
import Novac, { loader as NovacLoader } from "./routes/Novac.tsx";
import PostaviOglas from "./routes/Oglasi/PostaviOglas.tsx";
import FirmaRequiredLayout from "./components/Layouts/FirmaRequiredLayout.tsx";
import PregledOglasa from "./components/AuthorizedComponents/Oglas/Pregled/PregledOglasa.tsx";
import { CreateOglasDTO, DuzinaPosla } from "./api/DTO-s/Oglasi/OglasiDTO.ts";
import { Iskustvo } from "./api/DTO-s/responseTypes.ts";

const oglas : CreateOglasDTO = {
  cena: 5000,
  duzinaPosla: DuzinaPosla.JedanDoTriMeseca,
  iskustvo: Iskustvo.Iskusan,
  naslov: 'Trazim nekog da me prca',
  opis: `Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi 
  dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi 
  dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi 
  Prcenzi dupenzi 
  Prcenzi dupenzi Prcenzi 
  dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi 
  dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi 
  dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi
   Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi 
   dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi dupenzi Prcenzi
    dupenzi Prcenzi dupenzi Prcenzi dupenzi`,
  struke: [1, 2, 5, 7, 4],
  lokacija: 'U dupe'
}

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
          { path: "/success", element: <Success /> },
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
            path: '/test',
            element: (
              <ErrorBoundaryProvider>
                <PregledOglasa oglasData={oglas} />
              </ErrorBoundaryProvider>
            )
          }
        ],
      },
    ],
  },
]);
