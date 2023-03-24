import { Box, CircularProgress } from "@mui/material";
import { signInAnonymously } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
} from "reactfire";

const SharePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);
  const { data: signInCheck, status: signInStatus } = useSigninCheck();
  const auth = useAuth();

  const firestore = useFirestore();
  const listsCollection = collection(firestore, "lists");
  const listsQuery = query(
    listsCollection,
    where("shareLinks", "array-contains", code)
  );

  const { status, data } = useFirestoreCollectionData(listsQuery, {
    idField: "id",
  });

  useEffect(() => {
    if (status === "success" && data && signInStatus === "success") {
      if (!signInCheck.signedIn) {
        console.info("Setting anon user");

        signInAnonymously(auth).then((value) => {
          console.info(value);
          navigate(`/lists/${data[0].id}`);
        });
      } else {
        navigate(`/lists/${data[0].id}`);
      }
    }
  }, [status, data, signInStatus, auth, navigate, signInCheck.signedIn]);

  return (
    <Box>
      <CircularProgress />
    </Box>
  );
};

export default SharePage;
