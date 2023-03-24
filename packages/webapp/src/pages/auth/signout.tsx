import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "reactfire";

const SignOutPage = () => {
  const [loading, setLoading] = useState(true);

  const auth = useAuth();

  React.useEffect(() => {
    signOut(auth)
      .then((value) => {
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth]);

  if (loading) {
    return <>Signing out...</>;
  }

  return <Navigate to={"/auth/signin"} />;
};

export default SignOutPage;
