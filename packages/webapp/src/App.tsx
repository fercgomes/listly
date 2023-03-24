import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages";
import {
  FirebaseAppProvider,
  AuthProvider,
  FunctionsProvider,
  FirestoreProvider,
  useFirebaseApp,
  useAuth,
  useSigninCheck,
} from "reactfire";
import { firebaseConfig } from "./firebase";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import { NativeBaseProvider } from "native-base";
import { extendTheme } from "native-base";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import ListCreatePage from "./pages/lists/create";
import ListShowPage from "./pages/lists/show";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "react-ionicons";
import SignOutPage from "./pages/auth/signout";
import SharePage from "./pages/share";

// Theming
const theme = extendTheme({
  fontConfig: {
    Alegreya: {
      400: {
        normal: "Alegreya",
      },
      500: {
        normal: "Alegreya",
      },
      600: {
        normal: "Alegreya",
      },
      700: {
        normal: "Alegreya",
      },
      800: {
        normal: "Alegreya",
      },
      900: {
        normal: "Alegreya",
      },
    },
  },
  fonts: {
    heading: "Alegreya",
    body: "Alegreya",
    mono: "Alegreya",
  },
  colors: {},
});

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
      ],
    },
    { path: "/auth/signin", element: <SignInPage /> },
    { path: "/auth/signup", element: <SignUpPage /> },
    { path: "/auth/signout", element: <SignOutPage /> },
    {
      path: "lists",
      element: <Layout />,
      children: [
        {
          path: "create",
          element: (
            <ProtectedRoute>
              <ListCreatePage />
            </ProtectedRoute>
          ),
        },
        {
          path: ":listId",
          element: (
            <ProtectedRoute>
              <ListShowPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/share/:code",
      element: <SharePage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

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
        <NativeBaseProvider theme={theme}>
          <Router />
        </NativeBaseProvider>
      </FirebaseComponents>
    </FirebaseAppProvider>
  );
}

export default App;
