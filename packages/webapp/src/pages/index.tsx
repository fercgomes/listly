import React from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate, useNavigation } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const signInClickHandler = () => {
    navigate("/auth/signin");
  };

  const signUpClickHandler = () => {
    navigate("/auth/signup");
  };

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
      <Button
        variant="outlined"
        color="primary"
        sx={{ width: 200, margin: 1 }}
        onClick={signInClickHandler}
      >
        Entrar
      </Button>

      <Button
        variant="contained"
        color="info"
        sx={{ width: 200, margin: 1 }}
        onClick={signUpClickHandler}
      >
        Criar conta
      </Button>
    </Box>
  );
};

export default HomePage;
