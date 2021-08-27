import React, { useState, useEffect } from "react";
import { firestore, storage } from "../Firebase/index";
import queryString from "query-string";
import { Paper, Button, TextField } from "@material-ui/core";
import Dropzone from "react-dropzone";
import { v4 as uuid4 } from "uuid";
import { Link } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const AuthorDetails = () => {
  const [authorDetails, setAuthorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);

  const [filePath, setFilePath] = useState("");
  const [file, setFile] = useState([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleClick = () => {
    setOpenSnack(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  useEffect(() => {
    if (file.length > 0) {
      onSubmit();
    } else {
      console.log("N");
    }
  }, [file]);

  useEffect(() => {
    const { id } = queryString.parse(window.location.search);

    firestore
      .collection("Authors")
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setAuthorDetails(doc.data());
          setLoading(false);
          setFname(doc.data().name.split(" ")[0]);
          setLname(doc.data().name.split(" ")[1]);
          setEmail(doc.data().email);
          setPhone(doc.data().phoneNum);
          setFilePath(doc.data().filePath);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

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
            setMessage(`Uploading ${progress} %`);
          },
          (error) => {
            setMessage(error);
            handleClick();
          },
          async () => {
            // When the Storage gets Completed
            const fp = await uploadTask.snapshot.ref.getDownloadURL();
            setFilePath(fp);
            handleClick();
            setMessage("File Uploaded");
          }
        );
      });
    } else {
      setMessage("No File Selected Yet");
    }
  };

  const deleteAuthor = () => {
    const { id } = queryString.parse(window.location.search);
    firestore
      .collection("Authors")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Blog successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const handleClickOpenWarning = () => {
    setOpen(true);
  };

  const handleCloseWarning = () => {
    setOpen(false);
  };

  const editAuthor = () => {
    const { id } = queryString.parse(window.location.search);

    firestore
      .collection("Authors")
      .doc(id)
      .set({
        id: id,
        name: `${fname} ${lname}`,
        email: email,
        phoneNum: phone,
      })
      .then(() => {
        console.log("Document successfully written!");
        setIsEditing(false);
        handleClick();
        setMessage("User Edited Successfully");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const handleDrop = async (acceptedFiles) => {
    setFile(acceptedFiles.map((file) => file));
  };

  if (loading)
    return (
      <div style={{ padding: "20px" }}>
        <h3>Loading...</h3>
      </div>
    );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={openSnack}
          autoHideDuration={2000}
          onClose={handleClose}
          message={message}
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
        <Button
          variant="contained"
          onClick={handleClickOpenWarning}
          style={{ marginLeft: "10px" }}
        >
          Delete Author
        </Button>
        <Dialog
          open={open}
          onClose={handleCloseWarning}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this author?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action <strong>cannot</strong> be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWarning} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleCloseWarning}
              color="primary"
              autoFocus
              onClick={deleteAuthor}
              component={Link}
              to="/app/authors"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Paper style={{ margin: "1% auto", width: "80%", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="First Name"
            variant="outlined"
            style={{
              width: "45%",
            }}
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            disabled={!isEditing}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            style={{
              width: "45%",
            }}
            value={lname}
            disabled={!isEditing}
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <br></br>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Email ID"
            variant="outlined"
            style={{
              width: "45%",
            }}
            value={email}
            disabled={!isEditing}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            style={{
              width: "45%",
            }}
            value={phone}
            disabled={!isEditing}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <br></br>

        <center>
          {filePath !== "" ? (
            <Button
              style={{ marginLeft: "10px" }}
              size="large"
              variant="outlined"
              color="primary"
              disabled={!isEditing}
              onClick={() => setFilePath("")}
            >
              Remove existing image
            </Button>
          ) : (
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <Button
                    style={{ marginLeft: "10px" }}
                    size="large"
                    color="primary"
                    disabled={!isEditing}
                    variant="outlined"
                  >
                    Upload Profile Photo
                  </Button>
                </div>
              )}
            </Dropzone>
          )}
        </center>
        <br></br>
        <Button
          variant="contained"
          color="primary"
          disabled={!isEditing}
          fullWidth
          onClick={editAuthor}
        >
          Submit
        </Button>
        <br></br>
      </Paper>
    </>
  );
};

export default AuthorDetails;
