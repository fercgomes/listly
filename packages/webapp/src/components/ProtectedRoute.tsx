import React from "react";
import { Navigate } from "react-router-dom";
import { useSigninCheck } from "reactfire";

export const ProtectedRoute = ({ children }: React.PropsWithChildren<any>) => {
  const { status, data: signInCheck } = useSigninCheck();

  if (status === "loading") return null;

  if (status === "error") return <p>error while checking authentication</p>;

  const { signedIn } = signInCheck;

  if (signedIn) {
    return children;
  } else {
    return <Navigate to="/auth/signin" />;
  }
};
