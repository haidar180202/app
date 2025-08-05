import { Navigate, Outlet, useLocation } from "react-router";
import { iRoute } from "./route.interface";
import Dashboard from "@pages/dashboard";
import { token } from "@utils/token.utils";
import { useEffect, useState } from "react";

export const isAuthenticate = () => {
  const t = token.getToken();
  return t !== null && t !== undefined;
};

export default function RoutesGuard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode");
    setIsDarkMode(themeMode === "true");
  }, []);
  document.body.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");

  const location = useLocation();

  if (isAuthenticate()) {
    return <Outlet />;
  }

  const redirectTo = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/auth?page=login&redirectTo=${redirectTo}`} replace />;
}

export function ReRoute() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <Navigate to={`/home`} replace />
  }
  return <Outlet />
}

export function ProtectedRoute(): iRoute[] {
  const ProtectedRoute: iRoute[] = [

    {
      Node: <Dashboard />,
      path: "",
    },
  ];
  return ProtectedRoute;
}
