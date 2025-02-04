import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/routes/LandingPage";
import NotFound from "./pages/not-found/NotFound";
import LoginPage from "./pages/auth/LoginPage";

function App() {
   const router = createBrowserRouter([
      {
         path: "/",
         element: <LandingPage />,
      },
      {
         path: "/login",
         element: <LoginPage />,
      },
      {
         path: "*",
         element: <NotFound />,
      },
   ]);

   return <RouterProvider router={router} />;
}

export default App;
