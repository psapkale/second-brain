import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';
import LandingPage from './pages/routes/LandingPage';
import NotFound from './pages/not-found/NotFound';
import AuthPage from './pages/auth';
import Layout from './pages/routes/Layout';
import SpaceController from './components/SpaceController';
import { ThemeProvider, useTheme } from './context/themeContext';
import SharedSpace from './pages/routes/SharedSpace';
import { SidebarProvider } from './context/sidebarContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClinet = new QueryClient();

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/auth',
      element: <AuthPage />,
    },
    {
      path: '/spaces',
      element: <Layout />,
      children: [
        {
          path: ':spaceId',
          element: <SpaceController />,
        },
      ],
    },
    {
      path: '/s/:spaceId',
      element: <SharedSpace />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClinet}>
      <ThemeProvider>
        <SidebarProvider>
          <Toaster position="top-center" theme={theme} />
          <RouterProvider router={router} />
        </SidebarProvider>
        <ReactQueryDevtools />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
