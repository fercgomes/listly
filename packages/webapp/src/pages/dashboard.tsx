import React from "react";
import { Link } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreCollectionData,
  useSigninCheck,
  useUser,
} from "reactfire";
import { useAuth } from "reactfire";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import NewListDialog, { CreateListForm } from "../components/NewListDialog";
import { createList } from "../lib/lists";

const Dashboard = () => {
  const navigate = useNavigate();
  const { status, data: signInCheckResult } = useSigninCheck();
  const auth = useAuth();
  const user = useUser();

  const [createListDialogOpen, setCreateListDialogOpen] = React.useState(false);

  // Firebase
  const firestore = useFirestore();
  const listsCollection = collection(firestore, "lists");
  const listsQuery = query(
    listsCollection,
    where("owner", "==", user.data!.uid),
    orderBy("updatedAt", "desc")
  );

  const { status: listsStatus, data: listsData } = useFirestoreCollectionData(
    listsQuery,
    { idField: "id" }
  );

  const createListHandler = async (list: CreateListForm) => {
    console.log(list);
    setCreateListDialogOpen(false);

    // Create firestore doc

    const newList = {
      ...list,
      owner: user.data?.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
    };

    const { id } = await addDoc(collection(firestore, "lists"), newList);

    navigate("/lists/" + id);
  };

  if (status === "loading") {
    return <span>loading...</span>;
  }

  const renderLists = () => {
    if (listsStatus === "success") {
      return (
        <>
          {listsData.map((list) => (
            <Card key={list.id}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {list.name}
                </Typography>

                {/* <Typography>Última modificação</Typography> */}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    navigate(`/lists/${list.id}`);
                  }}
                >
                  Expandir
                </Button>
              </CardActions>
            </Card>
          ))}
        </>
      );
    } else if (listsStatus === "loading") {
      return <CircularProgress />;
    } else {
      return <p>Erro carregando listas.</p>;
    }
  };

  return (
    <>
      <Box sx={{ margin: 2 }}>
        {/* <Typography variant="h6">Listas de compra recentes</Typography> */}

        <Box>{renderLists()}</Box>
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          margin: 0,
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto",
          position: "fixed",
        }}
        onClick={() => setCreateListDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <NewListDialog
        show={createListDialogOpen}
        onDismiss={() => setCreateListDialogOpen(false)}
        onCreate={createListHandler}
      />
    </>
  );
};

export default Dashboard;
