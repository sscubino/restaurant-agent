import { createBrowserRouter, RouterProvider } from "react-router";

import { routes } from "@/config/routes";

import { AuthContext, useGetAuthContext } from "./contexts/AuthContext";

const router = createBrowserRouter(routes);

function App() {
  const authContext = useGetAuthContext();

  return (
    <AuthContext value={authContext}>
      <RouterProvider router={router} />
    </AuthContext>
  );
}

export default App;
