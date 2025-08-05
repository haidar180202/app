import imageUrl from "@utils/image_url";
import React from "react";

interface LoadDataProps {
  title?: string;
  subtitle?: string;
}

const LoadData: React.FC<LoadDataProps> = ({ title = "", subtitle = "" }) => {
  const loadingIcon = imageUrl("icon/logo.png");

  return (
    <div
      className="text-center"
      style={{
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      <img width="50px" src={loadingIcon} alt="Loading . . ." />
      <h2 className="mt-5">{title}</h2>
      <h6 className="mt-2">{subtitle}</h6>
    </div>
  );
};

export default LoadData;
