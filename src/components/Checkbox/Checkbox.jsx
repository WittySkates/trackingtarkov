/** @module Checkbox */

import React from "react";
import { makeStyles } from "@material-ui/core";
import MUICheckbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./styles/checkbox.scss";

const uselabelStyles = makeStyles(() => ({
  label: { fontSize: 35 },
}));

const useCheckboxStyles = makeStyles(() => ({
  root: {
    "&:hover": { backgroundColor: "transparent", color: "rgba(0,0,0,0.7)" },
  },
  checked: {
    color: "rgba(0,0,0,0.8) !important",
    "&:hover": { backgroundColor: "transparent !important" },
  },
}));

const Checkbox = props => {
  const { label, onChange, isChecked, className } = props;
  const checkboxClasses = useCheckboxStyles();
  const labelClasses = uselabelStyles();
  return (
    <FormControlLabel
      className={`checkbox ${className}`}
      label={label}
      labelPlacement="end"
      classes={labelClasses}
      control={
        <MUICheckbox
          className="checkbox-component"
          checked={isChecked}
          onChange={onChange}
          classes={checkboxClasses}
        />
      }
    />
  );
};

export default Checkbox;
