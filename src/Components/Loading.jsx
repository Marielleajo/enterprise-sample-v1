import React from "react";
import Lottie from "lottie-react";
import animationData from "../Assets/lottie/loading.json"; // Replace with your animation file
import { Box } from "@mui/material";

const LoadingComponent = () => {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: "70vh", height: "100vh" }}
      />
    </Box>
  );
};

export default LoadingComponent;
