import imageUrl from "@utils/image_url";
import { useEffect, useState } from "react";
import "./style/splash.css";

export default function Loading() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode");
    setIsDarkMode(themeMode === "true");
  }, []);
  document.body.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
  const LogoCisea = imageUrl("logos/logoNewCisea.png");
  const LogoBukitAsam = imageUrl("logos/bukitasam-logo.svg");
  // const LogoAkhlak = imageUrl("logos/akhlak-bumn.svg");
  // const LogoDanantara = imageUrl("logos/danantara.png")

  return (
    <div
      className="splash-screen-wrapper"
      style={{
        backgroundImage: `url(${imageUrl("media/bg-splash.jpg")})`,
      }}
    >
      <div className="overlay-loading" />
      <div className="top-logos d-flex justify-content-between align-items-center">
        <div className="logo-left">
          <img src={LogoBukitAsam} alt="BukitAsam" className="pt-logo" />
        </div>
        <div className="logo-right">
          {/* <img src={LogoDanantara} alt="AKHLAK | BUMN" className="pt-logo-danantara" /> */}
        </div>
      </div>

      <div className="content-loading-wrapper">
        <img src={LogoCisea} alt="Logo Cisea" className="cisea-logo-loading" />

        <div className="progress-bar">
          <div className="progress-inner" />
        </div>

        <span className="fs-5 text-white">
          Please wait, this won’t take long.
        </span>
      </div>
      <p className="copyright">
        ©Copyright {new Date().getFullYear()} PT Bukit Asam Tbk All Rights
        Reserved
      </p>
    </div>
  );
}
