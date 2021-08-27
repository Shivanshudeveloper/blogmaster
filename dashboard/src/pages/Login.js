import React, { useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { auth } from "../Firebase/index";
import { useNavigate } from "react-router";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#f50057 !important",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: "10px 0 !important",
  },
}));

export default function Login() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const loginUser = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        auth.onAuthStateChanged(function (user) {
          if (user) {
            if (
              isAdmin &&
              email === "admin1@gmail.com" &&
              password === "123123"
            ) {
              sessionStorage.setItem("adminAuthId", user.uid);
              sessionStorage.setItem("adminEmail", user.email);
              sessionStorage.setItem("adminName", user.displayName);
            } else {
              sessionStorage.setItem("userId", user.uid);
              sessionStorage.setItem("userEmail", user.email);
              sessionStorage.setItem("userName", user.displayName);
            }
            setMessage("");
            navigate("/app/dashboard", { replace: true });
          } else {
            console.log(
              "We have send a Verification Link on your Email Address"
            );
          }
        });
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        setMessage(errorMessage);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isAdmin && "Admin "}
          Sign in
        </Typography>
        <Typography component="h1" variant="h5">
          {isAdmin && "Email = admin1@gmail.com"}
        </Typography>
        <Typography component="h1" variant="h5">
          {isAdmin && "Password = 123123"}
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p style={{ color: "red", fontSize: "12px", textAlign: "right" }}>
            {message}
          </p>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginUser}
            size="large"
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                variant="body2"
                style={{ cursor: "pointer", textDecoration: "none" }}
                onClick={() => {
                  setIsAdmin((prev) => !prev);
                  setEmail("");
                  setPassword("");
                  setMessage("");
                }}
              >
                {/* Forgot password? */}
                {isAdmin ? "Customer Login" : "Admin Login"}
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={() => navigate("/register", { replace: true })}
                variant="body2"
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>{/* <Copyright /> */}</Box>
    </Container>
  );
}
