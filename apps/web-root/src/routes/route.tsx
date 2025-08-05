import { BrowserRouter, Route, Routes } from "react-router";
import ErrNotFound from "@components/common/Err/404";
import { Load } from "./route.load";
import { lazy } from "react";
import { Module1 } from "./route.module";


const Dashboard = lazy(() => import("@pages/dashboard"));

export default function AppRouter() {
  const PREFIX = process.env.APP_PREFIX;

  return (
    <BrowserRouter basename={`/${PREFIX}`}>
      <Routes>
        {/* Jika ReRoute juga dihapus, hapus elemen ini */}
        {/* <Route element={<ReRoute />}> */}

        {/* Jika RoutesGuard ingin dihapus, hapus elemen ini dan langsung pasang route di sini */}
        {/* <Route element={<RoutesGuard />}> */}
        <Route path="/" element={<Load node={<Dashboard />} />} />
        <Route path="/home" element={<Load node={<Dashboard />} />} />
        {/* <Route path="/itemss" element={<itemsTable />} /> */}


        <Route path="module" element={<Load node={<Module1 />} />}>
          <Route path="*" element={<Load node={<Module1 />} />} />
        </Route>


        <Route path="*" element={<Load node={<ErrNotFound />} />} />
        {/* </Route> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
