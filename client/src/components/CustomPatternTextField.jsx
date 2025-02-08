import React from "react";
import InputMask from "react-input-mask";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useTheme } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { green } from "@mui/material/colors";

const CustomMaskedTextField = ({
  mask,
  value,
  onChange,
  size,
  color,
  label,
  variant,
  name,
  control,
  rules,
  isDisabled,
  isEmpty,
  ...textFieldProps
}) => {
  const theme = useTheme();

    const isRequired = () => {
        if (rules && typeof rules === 'object' && 'required' in rules && label) {
            return true;
        }
        return false;
    };
    const getLabel = () => {
        if (isRequired()) {
            return (
            <span>
                {label}{" "}
                <span style={{ color: green, fontSize: "18px" }}>
                  *
                </span>
              </span>
            );
        }
        return label;
    };
    
    return (
        <Controller
            name={name}
            control={control}
            rules={rules? rules: {}}
            render={({ field, fieldState }) => (
                <InputMask
                    mask={mask || "(999) 999-9999"} // Destructure the pattern prop
                    value={isEmpty ? "" : value || field.value}
                    onChange={(e)=>{field.onChange(e); onChange &&onChange(e)}}
                    disabled={isDisabled}
                >
                    <TextField
                        label={getLabel() || ""}
                        fullWidth
                        type="text"
                        size={size || "medium"}
                        color={color || theme.palette.mode === "dark" ? "secondary" : "primary"}
                        variant={variant || "outlined"}
                        InputLabelProps={{
                            shrink: isDisabled ? true : Boolean(field.value),
                        }}
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : null
                        }
                        {...textFieldProps}
                        
                    />
                </InputMask>
            )}
        />
    );
};

export default CustomMaskedTextField;




