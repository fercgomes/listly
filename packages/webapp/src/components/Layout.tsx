import { Outlet } from "react-router-dom";
import AppBar from "./AppBar";
import { useUser } from "reactfire";
import { Container } from "@mui/system";

const Layout = () => {
  const { data: user } = useUser();

  return (
    <>
      <AppBar user={user} />

      <Container sx={{ height: "100%" }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
