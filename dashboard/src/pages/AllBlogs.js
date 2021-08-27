import React, { useEffect, useState } from "react";
import { firestore } from "../Firebase/index";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactHtmlParser from "react-html-parser";

import {
  Avatar,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
} from "@material-ui/core";

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    setBlogs([]);
    if (userId !== null) {
      firestore
        .collection("Blogs")
        .where("authorId", "==", userId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //   console.log(doc.id, " => ", doc.data());
            setBlogs((prev) => [...prev, doc.data()]);
          });
        });
    } else {
      firestore
        .collection("Blogs")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //   console.log(doc.id, " => ", doc.data());
            setBlogs((prev) => [...prev, doc.data()]);
          });
        });
    }
  }, []);

  console.log(blogs);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (blogs.length === 0)
    return (
      <div style={{ padding: "20px" }}>
        <h1>Loading...</h1>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">ALL BLOGS</Typography>
      <Card style={{ margin: "20px auto", width: "90%" }}>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Author</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Blog</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogs.slice(0, limit).map((blog) => {
                  var fullBlog = blog.blog.description;
                  if (blog.blog.description?.length > 30)
                    fullBlog = fullBlog.slice(0, 30) + "...";
                  return (
                    <TableRow
                      hover
                      key={blog.id}
                      selected={blogs.indexOf(blog.id) !== -1}
                    >
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {blog?.blog?.author}
                        </Typography>
                      </TableCell>
                      <TableCell>{blog?.blog?.title}</TableCell>
                      <TableCell>{ReactHtmlParser(fullBlog)}</TableCell>
                      <TableCell>
                        <Button
                          href={`/app/blog?id=${blog.id}`}
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
          count={blogs.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </div>
  );
}
