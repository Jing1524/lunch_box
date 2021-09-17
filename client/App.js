import React from "react";

import { makeStyles } from "@material-ui/core/styles";
// createMuiTheme - function that allow to create a custom theme.
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import Navbar from "./components/Navbar";
import Routes from "./Routes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#60d2da",
    },
    secondary: {
      main: "#5cc87c",
    },
    text: {
      primary: "#fff",
    },
  },
  overrides: {
    MuiInputLabel: {
      root: {
        color: "#fff",
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  app: {
    minHeight: "100vh",
    background: "rgb(243,185,63)",
    background:
      "linear-gradient(90deg, rgba(243,185,63,1) 0%, rgba(96,210,218,1) 100%)",
    "&::before": {
      content: '""',
      backgroundColor: "#141018",
      position: "absolute",
      height: "calc(100% - 60px)",
      width: "calc(100% - 60px)",
      top: "30px",
      left: "30px",
    },
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app} style={{ height: "100%" }}>
        <Navbar />
        <Routes />
        <CssBaseline />
      </div>
    </ThemeProvider>
  );
};

export default App;
