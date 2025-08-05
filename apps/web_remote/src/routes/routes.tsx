import { BrowserRouter, Routes, Route } from "react-router";
import Welcome from "@pages/Welcome";
import AnotherPage from "@pages/another_page.page";
import ProtectedRoutes from "./protected.route";
import ProtectedPage from "@pages/protected.page";
import ErrNotFound from "@components/common/Err/404";
import { BASENAME_SHELL, BASENAME_MODULE } from "@config/base.config";

export default function AppRouter() {
  return (
    // basename like your work zone
    // for example basename 'profile' will make it
    // prefix for all your module, and make sure handle your route properly on shell/host/root
    // all basename config will go to .env
    <BrowserRouter basename={`/${BASENAME_SHELL}/${BASENAME_MODULE}`}>
      <Routes>
        <Route path="/" element={<Welcome module={BASENAME_MODULE} />} />
        <Route path="/another" element={<AnotherPage />} />
        <Route
          element={<ProtectedRoutes basename={BASENAME_SHELL as string} />}
        >
          <Route path="/dashboard" element={<ProtectedPage />} />
        </Route>
        <Route path="*" element={<ErrNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
