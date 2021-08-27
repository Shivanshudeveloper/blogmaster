import React from "react";
import { TextField, Grid } from "@material-ui/core";

const Input = ({ half, name, label, handleChange, value }) => {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        name={name}
        label={label}
        onChange={handleChange}
        required
        variant="outlined"
        fullWidth
        value={value}
      />
    </Grid>
  );
};

export default Input;
