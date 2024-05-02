import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LandingPage from './routes/LandingPage.tsx'
import Register from './routes/Register.tsx'
import RootLayout from './routes/RootLayout.tsx'
import ErrorPage from './components/ErrorPage.tsx'
import Login from './routes/Login.tsx'
import Success from './routes/Success.tsx'
import Error from './routes/Error.tsx'

const router = createBrowserRouter([
  { path: '/', element: <RootLayout />, children: [
    { path: '/', element: <LandingPage /> },
    { path: '/register', element: <Register />},
    { path: '/login', element: <Login />},
    { path: '/success', element: <Success />},
    { path: '/error', element: <Error />},
  ], errorElement: <ErrorPage />}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
