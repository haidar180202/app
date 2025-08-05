import { useEffect, useState } from "react";
// import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import Header from "@components/base/header";

import { LayoutProps } from "./Layout.interface";
// import CiseaFooter from "@components/base/footerNew";
// import CustomHeader from "@components/base/customheader";

export default function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 821);
  const isCollapsed = useSelector(
    (state: any) => state.handleManagementUi.statusSizeSidebar,
  );

  // Responsif: Perbarui ukuran layar saat diubah
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pref = process.env.APP_PREFIX

  if (location.pathname === `/${pref}/home` || location.pathname === `/${pref}/`) {
    return (
      <div>
        {!isMobile ? (
          <div className={`d-flex ${isCollapsed ? "sidebar-collapsed" : ""}`}>
            <main
              className={`flex-grow-1 ${isCollapsed ? "content-expanded " : ""}`}
              style={{
                width: isMobile ? "0px" : isCollapsed ? "250px" : "0px",
                transition: "margin-left 0.3s ease",
              }}
            >
              <Header />
              <div className="position-relative app-container container-fluid mt-3">
                {children}
              </div>

            </main>
          </div>
        ) : (
          <div className={`d-flex ${isCollapsed ? "sidebar-collapsed" : ""}`}>
            <main
              className={`flex-grow-1 ${isCollapsed ? "content-expanded " : ""}`}
              style={{
                width: isMobile ? "0px" : isCollapsed ? "250px" : "0px",
                transition: "margin-left 0.3s ease",
              }}
            >
              <Header />
              <div className="position-relative app-container container-fluid mt-3">
                {children}
              </div>

            </main>
          </div>
        )}
      </div>
    );
  }

  // Untuk rute selain "/web-dev"
  return (
    <>
      <div className={`d-flex ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        <main
          className={`flex-grow-1 ${isCollapsed ? "content-expanded " : ""}`}
          style={{
            width: !isMobile ? "0px" : isCollapsed ? "250px" : "0px",
            transition: "margin-left 0.3s ease",
          }}
        >
          <Header />
          <div className="position-relative app-container container-fluid mt-3">
            {children}
          </div>
          {/* <Footer /> */}
          {/* <CiseaFooter/> */}
        </main>
      </div>
    </>
  );
}
