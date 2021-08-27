import React, { useState, useEffect } from "react";
import { firestore, storage } from "../Firebase/index";
import queryString from "query-string";
import { Typography, Button, Card } from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";

import { v4 as uuid4 } from "uuid";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Link } from "react-router-dom";
import EditBlog from "./EditBlog";

const Blog = () => {
  const [blogDetails, setBlogDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { id } = queryString.parse(window.location.search);

    firestore
      .collection("Blogs")
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setBlogDetails(doc.data());
          setLoading(false);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  const deleteBlog = () => {
    const { id } = queryString.parse(window.location.search);
    firestore
      .collection("Blogs")
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

  console.log(blogDetails);

  if (loading)
    return (
      <div style={{ padding: "20px" }}>
        <h3>Loading...</h3>
      </div>
    );

  if (isEditing)
    return <EditBlog blogDetails={blogDetails} setIsEditing={setIsEditing} />;

  if (!isEditing)
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            margin: "10px auto",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            Edit Blog
          </Button>
          <Button
            variant="contained"
            onClick={handleClickOpenWarning}
            style={{ marginLeft: "10px" }}
          >
            Delete Blog
          </Button>
          <Dialog
            open={open}
            onClose={handleCloseWarning}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete this blog?"}
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
                onClick={deleteBlog}
                component={Link}
                to="/app/allblogs"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Card style={{ padding: "15px", marginTop: "15px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h2">{blogDetails.blog.invNum}</Typography>
            <Typography variant="h6">
              Posted on {blogDetails.blog.date}
            </Typography>
          </div>
          <hr style={{ margin: "10px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" align="right">
              <em>
                {blogDetails.blog.edition} in {blogDetails.blog.category}
              </em>
              <br />
              <strong>{blogDetails.blog.exhibition}</strong>
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            <img
              src={blogDetails.authorPhoto}
              alt="image"
              style={{
                width: "50px",
                borderRadius: "50%",
                height: "50px",
                marginRight: "5px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6">{blogDetails.blog.author}</Typography>
            </div>
          </div>

          <Typography
            variant="h1"
            align="center"
            style={{
              margin: "20px 0",
            }}
          >
            {blogDetails.blog.title}
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <img
              src={blogDetails.blog.photoImage}
              alt="blog-image"
              style={{ maxWidth: "100%" }}
            />
          </div>
          <Typography variant="body1">
            {ReactHtmlParser(blogDetails.blog.description)}
          </Typography>
          <br />
          <Typography variant="body2">
            {ReactHtmlParser(blogDetails.blog.bibliography)}
          </Typography>
          <br />
          <Typography variant="body2">
            <em>
              {blogDetails.blog.state}, {blogDetails.blog.location}
            </em>
          </Typography>
          <img
            src={blogDetails.blog.signatureImage}
            alt="signature-image"
            style={{ maxWidth: "10%", marginTop: "10px" }}
          />
          <hr style={{ margin: "15px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">{blogDetails.blog.measure}</Typography>
            <Typography variant="body1">
              {blogDetails.blog.technique}
            </Typography>
            <Typography variant="body1">
              {blogDetails.blog.groupOfWorks}
            </Typography>
          </div>
        </Card>
      </div>
    );
};

export default Blog;
