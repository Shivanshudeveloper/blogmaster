import React, { useState, useEffect } from "react";

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
import { auth, storage, firestore } from "../Firebase/index";
import { useNavigate } from "react-router";
import Dropzone from "react-dropzone";
import { v4 as uuid4 } from "uuid";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageSnack, setMessageSnack] = useState("");
  const [file, setFile] = useState([]);
  const [filePath, setFilePath] = useState(
    "http://dreamvilla.life/wp-content/uploads/2017/07/dummy-profile-pic.png"
  );
  const [openSnack, setOpenSnack] = useState(false);
  const handleClick = () => {
    setOpenSnack(true);
  };

  useEffect(() => {
    if (file.length > 0) {
      onSubmit();
    } else {
      console.log("N");
    }
  }, [file]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const onSubmit = () => {
    if (file.length > 0) {
      file.forEach((file) => {
        const timeStamp = Date.now();
        var uniquetwoKey = uuid4();
        uniquetwoKey = uniquetwoKey + timeStamp;
        const uploadTask = storage
          .ref(`pictures/products/${uniquetwoKey}/${file.name}`)
          .put(file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            handleClick();
            setMessageSnack(`Uploading ${progress} %`);
          },
          (error) => {
            setMessageSnack(error);
            handleClick();
          },
          async () => {
            // When the Storage gets Completed
            const fp = await uploadTask.snapshot.ref.getDownloadURL();
            setFilePath(fp);
            handleClick();
            setMessageSnack("File Uploaded");
          }
        );
      });
    } else {
      setMessageSnack("No File Selected Yet");
    }
  };

  const handleDrop = async (acceptedFiles) => {
    setFile(acceptedFiles.map((file) => file));
  };

  const register = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        var user = result.user;
        user
          .updateProfile({
            displayName: `${fName} ${lName}`,
          })
          .then(() => {
            sessionStorage.setItem("userId", user.uid);
            sessionStorage.setItem("userEmail", user.email);
            sessionStorage.setItem("userName", user.displayName);
            setMessage("");
            setEmail("");
            setPassword("");
            setFName("");
            setLName("");
            navigate("/app/dashboard", { replace: true });
          })
          .then(() => {
            firestore
              .collection("Authors")
              .doc(user.uid)
              .set({
                id: user.uid,
                name: `${fName} ${lName}`,
                email: email,
                phoneNum: phone,
                filePath: filePath,
              })
              .then(() => {
                console.log("Document successfully written!");
                handleClick();
                setMessage("User Added");
                setFile([]);
                setFName("");
                setLName("");
                setEmail("");
                setPhone("");
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
              });
          })
          .catch((err) => console.log(err));
      })
      .catch(function (error) {
        var errorMessage = error.message;
        setMessage(errorMessage);
      });
  };

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
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: "10px 0 !important",
    },
  }));

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnack}
        autoHideDuration={2000}
        onClose={handleClose}
        message={messageSnack}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />

      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lName}
                onChange={(e) => setLName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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
            </Grid>
            <Grid item xs={12}>
              <center>
                <Dropzone onDrop={handleDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps()} />
                      <Button
                        style={{ marginTop: "10px" }}
                        size="large"
                        color="primary"
                        variant="outlined"
                        fullWidth
                      >
                        {file.length > 0
                          ? "Remove Photo"
                          : "Upload Profile Photo"}
                      </Button>
                    </div>
                  )}
                </Dropzone>
              </center>
            </Grid>
          </Grid>
          <p style={{ color: "red", fontSize: "12px", textAlign: "right" }}>
            {message}
          </p>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={register}
            size="large"
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                onClick={() => navigate("/login", { replace: true })}
                variant="body2"
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>{/* <Copyright /> */}</Box>
    </Container>
  );
};

export default Register;
