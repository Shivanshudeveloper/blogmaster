import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, InputLabel } from "@material-ui/core";
import { Editor } from "@tinymce/tinymce-react";
import { firestore, storage } from "../Firebase/index";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { v4 as uuid4 } from "uuid";
import Dropzone from "react-dropzone";
import Input from "./Input";

import { useNavigate } from "react-router-dom";

export default function AddBlog() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  // const [filePath, setFilePath] = useState("");
  const [file, setFile] = useState([]);
  // const [filePath1, setFilePath1] = useState("");
  const [file1, setFile1] = useState([]);
  const [authorNames, setAuthorNames] = useState([]);
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorPhoto, setAuthorPhoto] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const adminAuthId = sessionStorage.getItem("adminAuthId");
  const name = sessionStorage.getItem("userName");
  const userId = sessionStorage.getItem("userId");
  const userEmail = sessionStorage.getItem("userEmail");
  const defaultValue = {
    invNum: "",
    title: "",
    date: "",
    groupOfWorks: "",
    technique: "",
    measure: "",
    signatureImage: "",
    edition: "",
    description: "",
    state: "",
    location: "",
    photoImage: "",
    exhibition: "",
    bibliography: "",
    category: "",
    author: adminAuthId === null ? name : "",
  };
  const [fullBlog, setFullBlog] = useState(defaultValue);

  useEffect(() => {
    setCategoryList([]);
    firestore
      .collection("Category")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //   console.log(doc.data());
          setCategoryList((prev) => [...prev, doc.data()]);
        });
      });
  }, []);

  React.useEffect(() => {
    if (file.length > 0) {
      onSubmit();
    }
    if (file1.length > 0) {
      onSubmit1();
    }
  }, [file, file1]);

  const handleDrop = async (acceptedFiles) => {
    setFile(acceptedFiles.map((file) => file));
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
            setMessage(`Uploading ${progress} %`);
          },
          (error) => {
            setMessage(error);
            handleClick();
          },
          async () => {
            // When the Storage gets Completed
            const fp = await uploadTask.snapshot.ref.getDownloadURL();
            setFullBlog({ ...fullBlog, signatureImage: fp });
            handleClick();
            setMessage("File Uploaded");
          }
        );
      });
    } else {
      setMessage("No File Selected Yet");
    }
  };

  const handleDrop1 = async (acceptedFiles) => {
    setFile1(acceptedFiles.map((file) => file));
  };
  const onSubmit1 = () => {
    if (file1.length > 0) {
      file1.forEach((file1) => {
        const timeStamp = Date.now();
        var uniquetwoKey = uuid4();
        uniquetwoKey = uniquetwoKey + timeStamp;
        const uploadTask = storage
          .ref(`pictures/products/${uniquetwoKey}/${file1.name}`)
          .put(file1);
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
            setFullBlog({ ...fullBlog, photoImage: fp });
            handleClick();
            setMessage("File Uploaded");
          }
        );
      });
    } else {
      setMessage("No File Selected Yet");
    }
  };

  const addBlog = async () => {
    const timeStamp = Date.now();
    var uniquetwoKey = uuid4();
    uniquetwoKey = uniquetwoKey + timeStamp;
    firestore
      .collection("Blogs")
      .doc(uniquetwoKey)
      .set({
        id: uniquetwoKey,
        blog: fullBlog,
        authorEmail: adminAuthId === null ? userEmail : authorEmail,
        authorPhoto: authorPhoto,
        authorId: userId !== null ? userId : "",
      })
      .then(() => {
        console.log("Document successfully written!");
        handleClick();
        setMessage("Blog Added");
        setAuthorEmail("");
        setAuthorPhoto("");
        setFullBlog(defaultValue);
        navigate("/app/allblogs", { replace: true });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

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
    setAuthorNames([]);
    firestore
      .collection("Authors")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //   console.log(doc.id, " => ", doc.data());
          setAuthorNames((prev) => [...prev, doc.data()]);
        });
      });
  }, []);

  const handleChange = (e) => {
    setFullBlog({ ...fullBlog, [e.target.name]: e.target.value });
  };

  const plugins = [
    "advlist autolink lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code help wordcount",
  ];

  const toolbar =
    "undo redo | formatselect | " +
    "bold italic backcolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help";

  return (
    <div>
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
      <div style={{ margin: "1%" }}>
        <h1>Add a blog</h1>
        <br></br>

        <Grid container spacing={2}>
          <Input
            name="invNum"
            label="Inventory Number"
            handleChange={handleChange}
            half
          />
          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Date"
              type="date"
              defaultValue="2021-08-24"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Input
            name="groupOfWorks"
            label="Group of Works"
            handleChange={handleChange}
            half
          />
          <Input
            name="technique"
            label="Technique"
            handleChange={handleChange}
            half
          />
          <Input
            name="measure"
            label="Measure"
            handleChange={handleChange}
            half
          />
          <Input
            name="edition"
            label="Edition"
            handleChange={handleChange}
            half
          />
          <Input name="title" label="Title" handleChange={handleChange} />
          {adminAuthId !== null && (
            <Autocomplete
              options={authorNames}
              getOptionLabel={(option) => option?.name}
              inputValue={fullBlog.author}
              fullWidth
              style={{
                paddingLeft: "16px",
                width: "100%",
                paddingTop: "16px",
              }}
              onInputChange={(e) =>
                setFullBlog({ ...fullBlog, author: e?.target?.value })
              }
              onChange={(e, newValue) => {
                setFullBlog({ ...fullBlog, author: newValue?.name || "" });
                setAuthorEmail(newValue?.email);
                setAuthorPhoto(newValue?.filePath);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Author Name"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          )}

          <div
            style={{ paddingLeft: "16px", width: "100%", paddingTop: "16px" }}
          >
            <h4 style={{ marginBottom: "5px" }}>Description</h4>

            <Editor
              apiKey="azhogyuiz16q8om0wns0u816tu8k6517f6oqgs5mfl36hptu"
              // outputFormat="text"
              plugins="wordcount"
              onEditorChange={(e) =>
                setFullBlog({ ...fullBlog, description: e })
              }
              init={{
                height: 400,
                menubar: false,
                plugins: plugins,
                toolbar: toolbar,
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          <Input name="state" label="State" handleChange={handleChange} half />
          <Input
            name="location"
            label="Location"
            handleChange={handleChange}
            half
          />
          <Input
            name="exhibition"
            label="Exhibition"
            handleChange={handleChange}
            half
          />
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={fullBlog.category}
                onChange={(e) =>
                  setFullBlog({ ...fullBlog, category: e.target.value })
                }
              >
                {categoryList.map((cat) => (
                  <MenuItem value={cat.category}>{cat.category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <div
            style={{ paddingLeft: "16px", width: "100%", paddingTop: "16px" }}
          >
            <h4 style={{ marginBottom: "5px" }}>Bibliography</h4>
            <Editor
              apiKey="azhogyuiz16q8om0wns0u816tu8k6517f6oqgs5mfl36hptu"
              plugins="wordcount"
              outputFormat="text"
              onEditorChange={(e) =>
                setFullBlog({ ...fullBlog, bibliography: e })
              }
              init={{
                height: 400,
                menubar: false,
                plugins: plugins,
                toolbar: toolbar,
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
        </Grid>
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
                  Signature Image
                </Button>
              </div>
            )}
          </Dropzone>
        </center>
        <center>
          <Dropzone onDrop={handleDrop1}>
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
                  Upload Image
                </Button>
              </div>
            )}
          </Dropzone>
        </center>
        <br></br>
        <Button variant="contained" color="primary" fullWidth onClick={addBlog}>
          Submit
        </Button>
        <br></br>
      </div>
    </div>
  );
}
