import { createBrowserRouter, RouterProvider } from "react-router";

import { routes } from "@/config/routes";

import { AuthContext, useGetAuthContext } from "./contexts/AuthContext";
import { ThemeContext, useGetThemeContext } from "./contexts/ThemeContext";

const router = createBrowserRouter(routes);

function App() {
  const authContext = useGetAuthContext();
  const themeContext = useGetThemeContext();

  return (
    <AuthContext value={authContext}>
      <ThemeContext value={themeContext}>
        <RouterProvider router={router} />
      </ThemeContext>
    </AuthContext>
  );
}

export default App;
