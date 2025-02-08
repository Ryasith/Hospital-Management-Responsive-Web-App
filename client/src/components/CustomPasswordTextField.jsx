import * as React from 'react';
import { TextField as MUITextField, TextFieldProps, useTheme, IconButton, InputAdornment, Tooltip } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { green } from '@mui/material/colors';

const CustomPasswordTextField = ({
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
    sx,
    ...props
}) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInput = (e) => {
        e.target.value = e.target.value.replace(/\s/g, '');
      };    

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
            name={controllerName || ""}
            control={control}
            rules={rules ? rules : {}}
            render={({ field, fieldState }) => (
                <MUITextField
                    {...field}
                    id={field.name}
                    name={name? name: controllerName}
                    label={getLabel() || ""}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => { field.onChange(e); onChange && onChange(e); }}
                    onInput={handleInput}
                    onBlur={(e) => { field.onBlur(); onBlur && onBlur(e); }}
                    size={size || "medium"}
                    color={color || theme.palette.mode === "dark" ? "secondary" : "primary"}
                    variant={variant || "outlined"}
                    InputLabelProps={{
                        shrink: isDisabled ? true : Boolean(field.value),
                    }}
                    InputProps={{
                        endAdornment: field.value ? (
                          <InputAdornment position="end" sx={{ marginRight: -1 }}>
                            <Tooltip title={showPassword ? "Hide password" : "Show password"} placement="top">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    sx={{ padding: 0, margin: 0 }}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                        ) : null,

                        ...(maxLength ? { maxLength } : {}),
                        sx: sx,
                      }}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : null}
                    disabled={isDisabled}
                    {...props}
                />
            )}
        />
    );
};

export default CustomPasswordTextField;
