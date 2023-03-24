import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "reactfire";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, TextField } from "@mui/material";

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    console.info("Checking auth");

    if (auth.currentUser) {
      console.warn("Logged in. Redirecting.");
    }
  }, [auth.currentUser]);

  const submitHandler = async (data: any) => {
    const { email, password } = data;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.info(userCredential);
      navigate("/dashboard");
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography>Listly</Typography>

      <form
        onSubmit={handleSubmit(submitHandler)}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          {...register("email")}
          type="email"
          placeholder="Email"
          sx={{ margin: 1 }}
        />
        <TextField
          {...register("password")}
          type="password"
          placeholder="Senha"
          sx={{ margin: 1 }}
        />

        <Button type="submit" variant="contained">
          Entrar
        </Button>
      </form>

      {/* {errors ? <p>{JSON.stringify(errors)}</p> : null} */}
    </Box>
  );
};

export default SignInPage;
