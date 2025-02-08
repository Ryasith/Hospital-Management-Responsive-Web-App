import * as React from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, useTheme, Autocomplete, FormHelperText } from '@mui/material';
import { Control, Controller, Noop, RefCallBack } from 'react-hook-form';
import { green } from '@mui/material/colors';

const CustomDropdownField = ({
  options,
  size = "medium",
  color,
  label,
  variant = "outlined",
  disableSearch  = false, 
  name,
  control,
  onChangeSelect,
  // defaultValue,
  rules,
  disabled = false,
  showErrorMinLength,
  ...props
}) => {
  const theme = useTheme();
  const isRequired = () => {
    if (rules && typeof rules === "object" && "required" in rules && label) {
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

  const setValue = (value) => {
    let fieldValue = options.find((option) => {
      if (option.value.toString() === value?.toString())
        return value.toString();
    });
    return fieldValue ? fieldValue.value?.toString() : null;
  }

  const handleSelectChange = (
    event,
    field,
    option
  ) => {
    const matchingOption = options.find((o) => o.label === option);
    const value = matchingOption ? matchingOption.value : "";
    field.onChange(value);
    if (onChangeSelect) {
      onChangeSelect(matchingOption, matchingOption?.value);
    }
  };

  const handleBlurEvent = (
    event,
    field,
    option
  ) => {
    if (option && options) {
      const matchingOption = options.find((o) => o.label === option || (o.label && o.label.toUpperCase() === option?.toUpperCase()));
      const value = matchingOption ? matchingOption.value : "";
      field.onChange(value);
    }
  };

  if (disableSearch ) {
    return (
      <Controller
        name={name||""}
        control={control}
        // defaultValue={defaultValue}
        rules={rules? rules: {}}
        render={({ field: { ref, ...field }, fieldState }) => (
          <>
          <FormControl fullWidth error={!!fieldState.error} disabled={disabled}>
          <InputLabel color={color || theme.palette.mode === "dark" ? "secondary" : "primary"} shrink={Boolean(field.value)}>{label}</InputLabel>
            <Select
              fullWidth
              {...field}
              label={getLabel() || ""}
              color={color || theme.palette.mode === "dark" ? "secondary" : "primary"}
              style={{ maxHeight: 200 }}
              name={name}
              value={setValue(field.value)}
              onChange={(e) => { field.onChange(e.target.value); onChangeSelect && onChangeSelect(e, e.target.value); }}              
              inputProps={{
                shrink: Boolean(field.value),
            }}
              error={!!fieldState.error}
              disabled={disabled}
              {...props}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {fieldState.error ? ((showErrorMinLength && showErrorMinLength <= (fieldState.error.message ? fieldState.error.message.length : 0)) ? null : fieldState.error.message) : null}
            </FormHelperText>
            </FormControl>
          </>
        )}
      />
    );
  } else {
    return (
      <Controller
        name={name || ""}
        control={control}
        rules={rules? rules: {}}
        render={({ field: { ref, ...field }, fieldState }) => (
          <>
            <Autocomplete
              options={options.map(option => option.label)}
              value={options.find(option => option.value === field.value)?.label || ''}
              onChange={(event, newValue) => handleSelectChange(event, field, newValue)}
              disabled={disabled}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...field}
                  label={getLabel() || ""}
                  
                  onBlur={(event) => handleBlurEvent(event, field, event.target.value)}
                  variant={variant}
                  size={size}
                  name={name}
                  color={color || (theme.palette.mode === "dark" ? "secondary" : "primary")}
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error ? ((showErrorMinLength && showErrorMinLength <= (fieldState.error.message ? fieldState.error.message.length : 0)) ? null : fieldState.error.message) : null
                  }
                />
              )}
            />
          </>
        )}
      />
    );
  }
};

export default CustomDropdownField;