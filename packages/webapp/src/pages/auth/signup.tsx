import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "reactfire";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.info(userCredential);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Criar conta</h1>

      <form onSubmit={handleSubmit(submitHandler)}>
        <input {...register("email")} type="email" placeholder="Email" />
        <input {...register("password")} type="password" placeholder="Senha" />

        <button type="submit">Criar conta</button>
      </form>

      {errors ? <p>{JSON.stringify(errors)}</p> : null}
    </div>
  );
};

export default SignUpPage;
