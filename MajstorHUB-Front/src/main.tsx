import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LandingPage from './routes/LandingPage.tsx'
import Register from './routes/Register.tsx'
import RootLayout from './routes/RootLayout.tsx'
import ErrorPage from './components/ErrorPage.tsx'
import Login, {loader as loginLoader} from './routes/Login.tsx'
import Success from './routes/Success.tsx'
import Error, {loader as errorLoader} from './routes/Error.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import { requireAuth } from './lib/utils.ts'

const router = createBrowserRouter([
  { element: <RootLayout />, children: [
    { path: '/', element: <LandingPage /> },
    { path: '/register', element: <Register />},
    { path: '/login', element: <Login />, loader: loginLoader},
    { path: '/success', element: <Success />},
    { path: '/error', element: <Error />, loader: errorLoader},
    { path: '/dashboard', element: <h1>Tekst</h1>, loader: () => requireAuth()}
  ], errorElement: <ErrorPage />},
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
