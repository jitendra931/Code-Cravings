import { ThemeProvider } from "@emotion/react";
import "./App.css";

import { darkTheme } from "./Theme/DarkTheme";
import { CssBaseline } from "@mui/material";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./components/State/Authentication/Action";

import { findCart } from "./components/State/Cart/Action";
import Routers from "./Routers/Routers";

function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth?.jwt || jwt) {
      dispatch(getUser(auth?.jwt || jwt));
      dispatch(findCart(auth?.jwt || jwt));
    }
  }, [dispatch, auth?.jwt, jwt]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routers />
    </ThemeProvider>
  );
}

export default App;
