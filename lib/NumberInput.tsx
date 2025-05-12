import { InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";

const NumberInput = ({
  value,
  handleChange,
  borderless = false,
  hasError = false,
  helperText = "",
  disabled = false,
  endAdornmentUnit = "",
  placeholder = "",
}) => {
  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Allow empty, null or numbers with up to 2 decimal places
    if (!inputValue || /^\d*\.?\d{0,2}$/.test(inputValue)) {
      const numericValue = inputValue != "" ? parseFloat(inputValue) : null;
      handleChange(numericValue);
    }
  };

  return (
    <TextField
      fullWidth
      size="small"
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleDataChange}
      sx={{
        border: borderless ? "none" : null,
        backgroundColor: "#fff",
        borderRadius: borderless ? 0 : "5px",
        display: "inline-block",
        "& fieldset": { border: borderless ? "none" : null },
      }}
      InputProps={
        endAdornmentUnit
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  {endAdornmentUnit}
                </InputAdornment>
              ),
            }
          : {}
      }
      error={hasError || Boolean(helperText)}
      helperText={helperText}
      onFocus={(e) =>
        //prevent scroll
        e.target.addEventListener("wheel", (e) => e.preventDefault(), {
          passive: false,
        })
      }
    />
  );
};

export default NumberInput;
