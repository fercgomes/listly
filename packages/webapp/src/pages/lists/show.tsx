import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { CircularProgress, IconButton, Divider } from "@mui/material";
import {
  Firestore,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import ShareListDialog from "../../components/ShareListDialog";
import { v4 as uuidv4 } from "uuid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ListItemInput from "../../components/ItemInput";

interface NewItemInput {
  name: string;
}

const addItemSuggestion = async (
  firestore: Firestore,
  itemName: string,
  userId: string
) => {
  console.info("Adding suggestion", itemName, userId);
  const userSuggestionsDoc = doc(firestore, "userSuggestions", userId);

  const snapshot = await getDoc<any>(userSuggestionsDoc);

  // Search for suggestion
  if (snapshot.exists()) {
    const suggestions = snapshot.data();
    if (suggestions.itemSuggestions) {
      if (!suggestions.itemSuggestions.includes(itemName)) {
        console.info("Adding suggestions");
        updateDoc(userSuggestionsDoc, {
          itemSuggestions: [...suggestions.itemSuggestions, itemName],
        });
      }
    } else {
      updateDoc(userSuggestionsDoc, {
        itemSuggestions: [itemName],
      });
    }
  }
};

const ListShowPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const firestore = useFirestore();
  const listRef = doc(firestore, "lists", listId || "");
  const [loading, setLoading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { data: user } = useUser();

  const { register, handleSubmit, reset, setValue } = useForm<NewItemInput>();

  const {
    status: listStatus,
    data: list,
    error,
  } = useFirestoreDocData(listRef);

  const newItemSubmitHandler = async (newItem: NewItemInput) => {
    setLoading(true);

    const updatedList = {
      ...list,
      items: [...list.items, { ...newItem, checked: false, quantity: 1 }],
      updatedAt: new Date(),
    };

    reset();
    await updateDoc(listRef, updatedList);
    setLoading(false);

    addItemSuggestion(firestore, newItem.name, user!.uid);
  };

  const removeItem = async (itemIndex: number) => {
    setLoading(true);

    const updatedItems = list.items;
    updatedItems.splice(itemIndex, 1);

    const updatedList = {
      ...list,
      items: updatedItems,
      updatedAt: new Date(),
    };

    await updateDoc(listRef, updatedList);
    setLoading(false);
  };

  const generateShareLinkHandler = async () => {
    setLoading(true);

    await updateDoc(listRef, {
      ...list,
      shareLinks: [...list.shareLinks, uuidv4()],
    });

    setLoading(false);
  };

  const deleteListHandler = async () => {
    setLoading(true);

    await deleteDoc(listRef);

    setLoading(false);
    navigate("/dashboard");
  };

  const toggleItem = async (itemIndex: number) => {
    setLoading(true);

    const newItems = list.items;
    newItems[itemIndex].checked = !newItems[itemIndex].checked;

    const updatedList = {
      ...list,
      items: newItems,
      updatedAt: new Date(),
    };

    await updateDoc(listRef, updatedList);

    setLoading(false);
  };

  const addQuantityHandler = async (itemIndex: number) => {
    setLoading(true);

    const newItems = list.items;
    newItems[itemIndex].quantity = newItems[itemIndex].quantity + 1;

    const updatedList = {
      ...list,
      items: newItems,
      updatedAt: new Date(),
    };

    await updateDoc(listRef, updatedList);

    setLoading(false);
  };

  const removeQuantityHandler = async (itemIndex: number) => {
    setLoading(true);

    const newItems = list.items;

    if (newItems[itemIndex].quantity <= 0) {
      setLoading(false);
      return;
    }

    newItems[itemIndex].quantity = newItems[itemIndex].quantity - 1;

    const updatedList = {
      ...list,
      items: newItems,
      updatedAt: new Date(),
    };

    await updateDoc(listRef, updatedList);

    setLoading(false);
  };

  const renderItems = (items: any[]) => {
    return items.map((item, index) => (
      <div key={item.name}>
        <Box key={item.name} sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ flex: 1 }} onClick={() => toggleItem(index)}>
            <Typography
              variant="subtitle1"
              sx={{
                flex: 1,
                textDecoration: item.checked ? "line-through" : "inherit",
                fontStyle: item.checked ? "italic" : "inherit",
              }}
            >
              {item.name}
            </Typography>

            <Typography variant="caption">
              Quantidade: {item.quantity}
            </Typography>
          </Box>

          <IconButton color="info" onClick={() => removeQuantityHandler(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton color="info" onClick={() => addQuantityHandler(index)}>
            <AddCircleOutlineIcon />
          </IconButton>

          <IconButton
            color="error"
            sx={{ marginLeft: 1 }}
            onClick={() => removeItem(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Divider sx={{ marginBottom: 2 }} />
      </div>
    ));
  };

  const renderList = () => {
    if (listStatus === "loading") {
      return <CircularProgress />;
    }

    if (listStatus === "error") {
      return <Typography>Erro: {error?.message}</Typography>;
    }

    return (
      <>
        <Box sx={{ marginBottom: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{list.name}</Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton color="error" onClick={deleteListHandler}>
                <DeleteIcon />
              </IconButton>

              <IconButton
                color="primary"
                onClick={() => setShowShareDialog(true)}
              >
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="caption">
            Última atualização:{" "}
            {new Date(list.updatedAt.seconds * 1000).toLocaleString()}
          </Typography>
        </Box>

        {renderItems(list.items)}
      </>
    );
  };

  if (!list || !user) return null;

  return (
    <>
      <Box
        sx={{
          margin: 2,
          display: "flex",
          flexDirection: "column",
          height: "80vh",
        }}
      >
        <Box sx={{ flex: 1, overflowY: "scroll" }}>
          {loading ? (
            <>
              <CircularProgress />
            </>
          ) : (
            renderList()
          )}
        </Box>

        <form
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onSubmit={handleSubmit(newItemSubmitHandler)}
        >
          {/* <TextField
            type="text"
            placeholder="Nome do item"
            size="small"
            fullWidth
            label="Adicionar item"
            autoFocus
            {...register("name")}
          /> */}
          <ListItemInput
            userId={user.uid}
            {...register("name")}
            setValue={setValue}
          />

          <IconButton color="info" sx={{ marginLeft: 1 }} type="submit">
            <AddIcon />
          </IconButton>
        </form>
      </Box>

      <ShareListDialog
        show={showShareDialog}
        shareLinks={list.shareLinks}
        sharedWith={list.sharedWith}
        onDismiss={() => setShowShareDialog(false)}
        onCreateLink={generateShareLinkHandler}
      />
    </>
  );
};

export default ListShowPage;
