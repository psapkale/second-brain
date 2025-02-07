import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/routes/LandingPage";
import NotFound from "./pages/not-found/NotFound";
import AuthPage from "./pages/auth";
import Layout from "./components/Layout";

function App() {
   const router = createBrowserRouter([
      {
         path: "/",
         element: <LandingPage />,
      },
      {
         path: "/auth",
         element: <AuthPage />,
      },
      {
         path: "/spaces",
         element: <Layout />,
      },
      {
         path: "*",
         element: <NotFound />,
      },
   ]);

   return (
      <>
         <Toaster position="top-center" reverseOrder={true} />
         <RouterProvider router={router} />
      </>
   );
}

export default App;
