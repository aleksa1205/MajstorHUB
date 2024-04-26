import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LandingPage from './routes/LandingPage.tsx'
import Register from './routes/Register.tsx'
import RootLayout from './routes/RootLayout.tsx'
import RegisterKorisnik from './routes/RegisterKorisnik.tsx'

const router = createBrowserRouter([
  { path: '/', element: <RootLayout />, children: [
    { path: '/', element: <LandingPage /> },
    { path: '/register', element: <Register />},
    { path: '/register-korisnik', element: <RegisterKorisnik />},
  ]}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
