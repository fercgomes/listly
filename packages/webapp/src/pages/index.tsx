import React from "react";
import { Link } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import { useAuth } from "reactfire";

const HomePage = () => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const auth = useAuth();

  if (status === "loading") {
    return <span>loading...</span>;
  }

  const signedIn = signInCheckResult.signedIn;

  const logoutHandler = () => {
    auth.signOut();
  };

  const { currentUser } = auth;

  return (
    <div>
      <h1>Listly</h1>
      <p>Suas listas de compras!</p>

      {signedIn ? (
        <>
          <p>Bem-vindo, {currentUser!.email}!</p>
          <button onClick={logoutHandler}>Sair</button>
        </>
      ) : (
        <>
          <Link to="/auth/signin">Logar</Link>
          <Link to="/auth/signup">Criar conta</Link>
        </>
      )}
    </div>
  );
};

export default HomePage;
