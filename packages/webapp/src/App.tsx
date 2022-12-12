import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages";
import {
  FirebaseAppProvider,
  AuthProvider,
  FunctionsProvider,
  FirestoreProvider,
  useFirebaseApp,
} from "reactfire";
import { firebaseConfig } from "./firebase";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/auth/signin", element: <SignInPage /> },
  { path: "/auth/signup", element: <SignUpPage /> },
]);

const FirebaseComponents = (props: React.PropsWithChildren<any>) => {
  const { children } = props;

  const app = useFirebaseApp();
  const firestore = getFirestore(app);
  const functions = getFunctions(app);
  const auth = getAuth(app);

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const localhost = "localhost";
    console.info("Development environment, using Firebase emulators.");

    const authPort = 9099;
    const functionsPort = 5001;
    const firestorePort = 8080;

    connectAuthEmulator(auth, `http://${localhost}:${authPort}`);
    connectFunctionsEmulator(functions, localhost, functionsPort);
    connectFirestoreEmulator(firestore, localhost, firestorePort);
  }

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <FunctionsProvider sdk={functions}>{children}</FunctionsProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
};

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseComponents>
        <RouterProvider router={router} />
      </FirebaseComponents>
    </FirebaseAppProvider>
  );
}

export default App;
