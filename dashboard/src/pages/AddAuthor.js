import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  TextField,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Box,
} from "@material-ui/core";
import { firestore, storage } from "../Firebase/index";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import PerfectScrollbar from "react-perfect-scrollbar";

import { v4 as uuid4 } from "uuid";
import Dropzone from "react-dropzone";

export default function AddBlog() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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

  const handleDrop = async (acceptedFiles) => {
    setFile(acceptedFiles.map((file) => file));
  };

  const addAuthor = async () => {
    const timeStamp = Date.now();
    var uniquetwoKey = uuid4();
    uniquetwoKey = uniquetwoKey + timeStamp;
    firestore
      .collection("Authors")
      .doc(uniquetwoKey)
      .set({
        id: uniquetwoKey,
        name: `${fname} ${lname}`,
        email: email,
        phoneNum: phone,
        filePath: filePath,
      })
      .then(() => {
        console.log("Document successfully written!");
        handleClick();
        setMessage("User Added");
        setFile([]);
        setFname("");
        setLname("");
        setEmail("");
        setPhone("");
        setAdding(false);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  useEffect(() => {
    setAuthors([]);
    firestore
      .collection("Authors")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //   console.log(doc.id, " => ", doc.data());
          setAuthors((prev) => [...prev, doc.data()]);
        });
      });
  }, []);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (!adding)
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">ALL AUTHORS</Typography>
          <Button variant="outlined" onClick={() => setAdding((prev) => !prev)}>
            Add Author
          </Button>
        </div>
        <Card style={{ margin: "20px auto", width: "90%" }}>
          <PerfectScrollbar>
            <Box sx={{ minWidth: 1050 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authors.slice(0, limit).map((author) => {
                    return (
                      <TableRow
                        hover
                        key={author.id}
                        selected={authors.indexOf(author.id) !== -1}
                      >
                        <TableCell>
                          <Typography color="textPrimary" variant="body1">
                            {author.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{author.email}</TableCell>
                        <TableCell>{author.phoneNum}</TableCell>
                        <TableCell>
                          <Button
                            href={`/app/author?id=${author.id}`}
                            variant="contained"
                            color="primary"
                          >
                            See More
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={authors.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      </div>
    );

  if (adding)
    return (
      <div style={{ padding: "20px" }}>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Add Authors</h1>
          <Button variant="outlined" onClick={() => setAdding((prev) => !prev)}>
            Cancel
          </Button>
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
            />
            <TextField
              label="Last Name"
              variant="outlined"
              style={{
                width: "45%",
              }}
              value={lname}
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              style={{
                width: "45%",
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <br></br>

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
                    Upload Profile Photo
                  </Button>
                </div>
              )}
            </Dropzone>
          </center>
          <br></br>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={addAuthor}
          >
            Submit
          </Button>
          <br></br>
        </Paper>
      </div>
    );
}
