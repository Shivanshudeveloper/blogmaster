import React, { useState, useEffect } from "react";

import { Editor } from "@tinymce/tinymce-react";
import Dropzone from "react-dropzone";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { Button, Grid, TextField } from "@material-ui/core";
import { v4 as uuid4 } from "uuid";
import Input from "./Input";
import { firestore, storage } from "../Firebase/index";
import queryString from "query-string";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useNavigate } from "react-router-dom";

const EditBlog = ({ blogDetails, setIsEditing }) => {
  const navigate = useNavigate();
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [fullBlog, setFullBlog] = useState(blogDetails);
  const [file, setFile] = useState([]);
  const [file1, setFile1] = useState([]);
  const [authorNames, setAuthorNames] = useState([]);
  const [authorEmail, setAuthorEmail] = useState(blogDetails.authorEmail);
  const [authorPhoto, setAuthorPhoto] = useState(blogDetails.authorPhoto);

  useEffect(() => {
    if (file.length > 0) {
      onSubmit();
    }
    if (file1.length > 0) {
      onSubmit1();
    }
  }, [file, file1]);

  const handleClick = () => {
    setOpenSnack(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

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
            setFullBlog({
              ...fullBlog,
              blog: { ...fullBlog.blog, signatureImage: fp },
            });
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
            setFullBlog({
              ...fullBlog,
              blog: { ...fullBlog.blog, photoImage: fp },
            });
            handleClick();
            setMessage("File Uploaded");
          }
        );
      });
    } else {
      setMessage("No File Selected Yet");
    }
  };

  const editBlog = () => {
    const { id } = queryString.parse(window.location.search);

    try {
      firestore
        .collection("Blogs")
        .doc(id)
        .set({
          id: id,
          blog: fullBlog.blog,
          authorEmail: authorEmail,
          authorPhoto: authorPhoto,
        })
        .then(() => {
          console.log("Document successfully written!");
          setIsEditing(false);
          navigate("/app/allblogs", { replace: true });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    } catch (error) {
      handleClick();
      setMessage("Please fill all the fields!!");
    }
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
    setFullBlog({
      ...fullBlog,
      blog: { ...fullBlog.blog, [e.target.name]: e.target.value },
    });
  };

  console.log(fullBlog);

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
    <div style={{ margin: "1%" }}>
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
          margin: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Edit blog</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          Cancel
        </Button>
      </div>

      <Grid container spacing={2}>
        <Input
          name="invNum"
          label="Inventory Number"
          handleChange={handleChange}
          half
          value={fullBlog.blog.invNum}
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
            value={fullBlog.blog.date}
          />
        </Grid>
        <Input
          name="groupOfWorks"
          label="Group of Works"
          handleChange={handleChange}
          half
          value={fullBlog.blog.groupOfWorks}
        />
        <Input
          name="technique"
          label="Technique"
          handleChange={handleChange}
          half
          value={fullBlog.blog.technique}
        />
        <Input
          name="measure"
          label="Measure"
          handleChange={handleChange}
          value={fullBlog.blog.measure}
          half
        />
        <Input
          name="edition"
          label="Edition"
          handleChange={handleChange}
          value={fullBlog.blog.edition}
          half
        />
        <Input
          name="title"
          label="Title"
          handleChange={handleChange}
          value={fullBlog.blog.title}
        />
        <Autocomplete
          options={authorNames}
          getOptionLabel={(option) => option?.name}
          required
          fullWidth
          style={{
            paddingLeft: "16px",
            width: "100%",
            paddingTop: "16px",
          }}
          onInputChange={(e) =>
            setFullBlog({
              ...fullBlog,
              blog: { ...fullBlog.blog, author: e?.target?.value },
            })
          }
          onChange={(e, newValue) => {
            setFullBlog({
              ...fullBlog,
              blog: { ...fullBlog.blog, author: newValue?.name || "" },
            });
            setAuthorEmail(newValue?.email);
            setAuthorPhoto(newValue?.filePath);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Author Name"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <div style={{ paddingLeft: "16px", width: "100%", paddingTop: "16px" }}>
          <h4 style={{ marginBottom: "5px" }}>Description</h4>

          <Editor
            apiKey="azhogyuiz16q8om0wns0u816tu8k6517f6oqgs5mfl36hptu"
            // outputFormat="text"
            plugins="wordcount"
            onEditorChange={(e) =>
              setFullBlog({
                ...fullBlog,
                blog: { ...fullBlog.blog, description: e },
              })
            }
            init={{
              height: 400,
              menubar: false,
              plugins: plugins,
              toolbar: toolbar,
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            value={fullBlog.blog.description}
          />
        </div>

        <Input
          name="state"
          label="State"
          handleChange={handleChange}
          half
          value={fullBlog.blog.state}
        />
        <Input
          name="location"
          label="Location"
          handleChange={handleChange}
          value={fullBlog.blog.location}
          half
        />
        <Input
          name="exhibition"
          label="Exhibition"
          handleChange={handleChange}
          value={fullBlog.blog.exhibition}
          half
        />
        <Input
          name="category"
          label="Category"
          handleChange={handleChange}
          value={fullBlog.blog.category}
          half
        />
        <div style={{ paddingLeft: "16px", width: "100%", paddingTop: "16px" }}>
          <h4 style={{ marginBottom: "5px" }}>Bibliography</h4>
          <Editor
            apiKey="azhogyuiz16q8om0wns0u816tu8k6517f6oqgs5mfl36hptu"
            plugins="wordcount"
            outputFormat="text"
            onEditorChange={(e) =>
              setFullBlog({
                ...fullBlog,
                blog: { ...fullBlog.blog, bibliography: e },
              })
            }
            init={{
              height: 400,
              menubar: false,
              plugins: plugins,
              toolbar: toolbar,
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            value={fullBlog.blog.bibliography}
          />
        </div>
      </Grid>
      <center>
        {fullBlog.blog.signatureImage !== "" ? (
          <Button
            style={{ marginTop: "10px" }}
            size="large"
            color="secondary"
            variant="outlined"
            fullWidth
            onClick={() =>
              setFullBlog({
                ...fullBlog,
                blog: { ...fullBlog.blog, signatureImage: "" },
              })
            }
          >
            Delete Signature Image
          </Button>
        ) : (
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
        )}
      </center>
      <center>
        {fullBlog.blog.photoImage !== "" ? (
          <Button
            style={{ marginTop: "10px" }}
            size="large"
            color="secondary"
            variant="outlined"
            fullWidth
            onClick={() =>
              setFullBlog({
                ...fullBlog,
                blog: { ...fullBlog.blog, photoImage: "" },
              })
            }
          >
            Delete Blog Image
          </Button>
        ) : (
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
        )}
      </center>

      <br></br>
      <Button variant="contained" color="primary" fullWidth onClick={editBlog}>
        Submit
      </Button>
      <br></br>
    </div>
  );
};

export default EditBlog;
