import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import LandingPage from "./pages/routes/LandingPage";
import NotFound from "./pages/not-found/NotFound";
import AuthPage from "./pages/auth";
import Layout from "./components/Layout";
import SpaceController from "./components/SpaceController";
import { ThemeProvider, useTheme } from "./context/themeContext";

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
         children: [
            {
               path: ":spaceId",
               element: <SpaceController />,
            },
         ],
      },
      {
         path: "*",
         element: <NotFound />,
      },
   ]);
   const { theme } = useTheme();

   return (
      <ThemeProvider>
         <Toaster position="bottom-center" theme={theme} />
         <RouterProvider router={router} />
      </ThemeProvider>
   );
}

export default App;
