import * as React from "react";
import { TextField as MUITextField, TextFieldProps, useTheme } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { green } from "@mui/material/colors";

const CustomTextField = React.forwardRef(({
    size,
    color,
    label,
    variant,
    name,
    control,
    rules,
    isDisabled,
    maxLength,
    onChange,
    onBlur,
    controllerName,
    isEmpty,
    ...props
}, ref) => {
    const theme = useTheme();

    // Function to check if the field is required
    const isRequired = () => {
        if (rules && typeof rules === 'object' && 'required' in rules && label) {
            return true;
        }
        return false;
    };

    // Add asterisk to the label if the field is required
    const getLabel = () => {
        if (isRequired()) {
            return (
                <span>
                    {label} <span style={{ color: green, fontSize : "18px" }}>*</span>
                </span>
            );
        }
        return label;
    };

    return (
        <Controller
            name={controllerName || ""}
            control={control}
            rules={rules ? rules : {}}
            render={({ field, fieldState }) => (
                <MUITextField
                    id={field.name}
                    {...field}
                    inputRef={ref}
                    value={isEmpty ? '' : field.value}
                    name={name? name: controllerName}
                    label={getLabel() || ""}
                    fullWidth
                    type="text"
                    onChange={(e)=>{field.onChange(e); onChange && onChange(e);}}
                    onBlur={(e) => {
                        field.onChange(e.target.value?.trim());
                        field.onBlur(); 
                        onBlur && onBlur(e); 
                    }}
                    size={size || "medium"}
                    color={color || theme.palette.mode === "dark" ? "secondary" : "primary"}
                    variant={variant || "outlined"}
                    InputLabelProps={{
                        shrink: isDisabled ? true : Boolean(field.value),
                    }}
                    inputProps={{
                        ...(maxLength ? { maxLength } : {})
                    }}
                    error={!!fieldState.error}
                    helperText={
                        fieldState.error ? fieldState.error.message : null
                    }
                    disabled={isDisabled}
                    {...props}
                />
            )}
        />
    );
});
export default CustomTextField;
