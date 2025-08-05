import { token } from "@utils/token.utils";
import { Outlet } from "react-router";

//protected route sample
export default function ProtectedRoutes({ basename }: { basename: string }) {
  const isAuthenticate = () => {
    const tkn = token.getToken();
    const tokenExpiry = token.getExpiresIn() as number;

    if (!tkn || !tokenExpiry) {
      return false;
    }
    const currentTime = Date.now();

    const expiryTime = tokenExpiry;

    if (currentTime >= expiryTime) {
      return true;
    }

    return false;
  };
  if (isAuthenticate()) {
    return <Outlet />;
  }

  window.location.replace(`/${basename}/auth?page=login`);
  return null;
}
