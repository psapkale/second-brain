import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/routes/LandingPage";
import NotFound from "./pages/not-found/NotFound";
import AuthPage from "./pages/auth";

function App() {
   const router = createBrowserRouter([
      {
         path: "/",
         element: <LandingPage />,
      },
      {
         path: "/login",
         element: <AuthPage />,
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
