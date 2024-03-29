import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  // const signInClickHandler = () => {
  //   navigate("/auth/signin");
  // };

  // const signUpClickHandler = () => {
  //   navigate("/auth/signup");
  // };

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 3,
      }}
    >
      <Typography>Bem-vindo ao listly.</Typography>
    </Box>
  );
};

export default HomePage;
