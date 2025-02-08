import React, { ChangeEvent } from "react";
import {
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio as MuiRadio,
  RadioGroup,
  useTheme,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

const CustomRadioButton = (props) => {

  const { name, options, label, onChange, control, isDisabled, rules, controllerName, xs, md, value } = props;
  const theme = useTheme();
  
  return (
    <Controller
    name={controllerName || ""}
    control={control}
    rules={rules? rules: {}}
    render={({ field, fieldState }) => (
        <>
        {label && <FormLabel component="legend" sx={{color: fieldState.error ? theme.palette.error.main : 'inherit'}}>{label}</FormLabel>}
        <RadioGroup name={name? name: controllerName} onChange={(e)=>{field.onChange(e); onChange && onChange(e)}}>
          <Grid container spacing={1}>
          {options?.map((option) => (
            <Grid item md={md} xs={xs}>
            <FormControlLabel
            {...field}
              key={option.value}
              value={option.value?.toString()}
              control={
                <MuiRadio
                  color={theme.palette.mode === "dark" ? "secondary" : "primary"}
                  checked = {option.value?.toString() === field.value?.toString() || option.value?.toString() === value}
                  sx={{
                    color: fieldState.error && !field.value
                      ? theme.palette.error.main
                      : '',
                    '&.Mui-checked': {
                      color: fieldState.error && !field.value
                        ? theme.palette.error.dark
                        : '',
                    },
                  }}
                />

              }
              label={option.label}
              disabled={isDisabled}
              sx={{ color: fieldState.error ? theme.palette.error.main : 'inherit' }}
            />
            </Grid>
          ))}
          </Grid>
        </RadioGroup>
        {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
      </>
    )}
/>
   
  );
};

export default CustomRadioButton;
