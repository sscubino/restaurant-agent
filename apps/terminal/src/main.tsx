import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import Menu from "./pages/menu.tsx";
import Settings from "./pages/settings.tsx";
import Calls from "./pages/calls.tsx";
import Register from "./pages/register.tsx";
import { Toaster } from "sonner";
import RequestNumber from "./pages/requestNumber.tsx";
import SuccessVerify from "./pages/successVerify.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Toaster richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashbooard" replace />} />
        <Route path="/dashbooard" element={<Home />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/requestNumber" element={<RequestNumber />} />
        <Route path="/successVerify" element={<SuccessVerify />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
