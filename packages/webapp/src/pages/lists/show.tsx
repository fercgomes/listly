import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { CircularProgress } from "@mui/material";
import { doc } from "firebase/firestore";

const ListShowPage = () => {
  const { listId } = useParams();

  const firestore = useFirestore();
  const listRef = doc(firestore, "lists", listId || "");

  const {
    status: listStatus,
    data: list,
    error,
  } = useFirestoreDocData(listRef);

  const renderItems = (items: any[]) => {};

  const renderList = () => {
    if (listStatus === "loading") {
      return <CircularProgress />;
    }

    if (listStatus === "error") {
      return <Typography>Erro: {error?.message}</Typography>;
    }

    return (
      <>
        <Typography variant="h6">{list.name}</Typography>
        <Typography variant="caption">Última atualização: </Typography>

        {renderItems(list.items)}
      </>
    );
  };

  return <Box sx={{ margin: 2 }}>{renderList()}</Box>;
};

export default ListShowPage;
