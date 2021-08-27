import React, { useEffect, useState } from "react";
import { firestore } from "../Firebase/index";
import { v4 as uuid4 } from "uuid";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

export default function AddCategory() {
  const [category, setCategory] = useState([]);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

  const addCategory = () => {
    const timeStamp = Date.now();
    var uniquetwoKey = uuid4();
    uniquetwoKey = uniquetwoKey + timeStamp;
    firestore
      .collection("Category")
      .doc(uniquetwoKey)
      .set({
        id: uniquetwoKey,
        category: value,
      })
      .then(() => {
        setCategory([...category, { id: uniquetwoKey, category: value }]);
        handleClick();
        setMessage("Category Added");
        setValue("");
      })
      .catch((error) => {
        handleClick();
        setMessage("Error adding Category: ", error);
      });
  };

  const deleteBlog = (id) => {
    firestore
      .collection("Category")
      .doc(id)
      .delete()
      .then(() => {
        setCategory(category.filter((cat) => cat.id != id));
        handleClick();
        setMessage("Category successfully deleted!");
      })
      .catch((error) => {
        handleClick();
        setMessage("Error removing Category: ", error);
      });
  };

  useEffect(() => {
    setCategory([]);
    firestore
      .collection("Category")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //   console.log(doc.data());
          setCategory((prev) => [...prev, doc.data()]);
        });
      });
  }, []);

  const handleClick = () => {
    setOpenSnack(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

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
      <Grid style={{ display: "flex" }} spacing={3} container>
        <Grid item md={8}>
          <Paper style={{ padding: "20px" }}>
            <Typography variant="h4">ADD CATEGORY</Typography>
            <TextField
              style={{ margin: "20px 0" }}
              label="Category"
              fullWidth
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <Button variant="contained" fullWidth onClick={addCategory}>
              Submit
            </Button>
          </Paper>
        </Grid>
        <Grid item md={4}>
          <Paper style={{ padding: "20px" }}>
            <Typography variant="h4">ALL CATEGORIES</Typography>
            <Table style={{ marginTop: "20px" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category?.map((cat) => (
                  <TableRow
                    hover
                    key={cat.id}
                    selected={category.indexOf(cat.id) !== -1}
                  >
                    <TableCell align="center">{cat.category}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => deleteBlog(cat.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
