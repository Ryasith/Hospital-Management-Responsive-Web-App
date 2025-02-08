import * as React from "react";
import {
  DatePicker as DatePickerField,
  DatePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { green } from "@mui/material/colors";

const CustomDatePicker = ({
  size,
  color,
  label,
  variant,
  fullWidth,
  isDisablePast,
  isDisableFuture,
  name,
  control,
  controllerName,
  onChange,
  rules,
  disabled,
  showErrorMinLength,
  maxDate,
  minDate,
  onBlur,
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
  const parseDate = (e, fieldOnChange) => {
    let dateStr = e.target.value;

    const lastDigit = dateStr.substring(9, 10);
    if(isNaN(Number(lastDigit))){
      return;
    }

    if (dateStr.length === 10) {
      const month = dateStr.substring(0, 2);
      const day = dateStr.substring(3, 5);
      if(dateStr.substring(6, 8) === "00"){
        const currentCentury = Math.floor(dayjs().year() / 100);
        const year = currentCentury + dateStr.substring(8, 10);
        dateStr = `${month}/${day}/${year}`;
      }
    }

    const customEvent = {
      ...e,
      target: {
        ...e.target,
        value: dateStr,
      },
    };

    fieldOnChange(customEvent);
  };

  return (
    <Controller
      name={controllerName || ""}
      control={control}
      rules={rules? rules: {}}
      render={({ field: { ref, ...field }, fieldState }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerField
            {...field}
            name={name? name: controllerName}
            onChange={(e) => {
              field.onChange(e);
              onChange && onChange(e);
          }}
            label={getLabel() || ""}
            disablePast={isDisablePast}
            disableFuture={isDisableFuture}
            //@ts-ignore
            maxDate={maxDate}
            //@ts-ignore
            minDate={minDate}
            // @ts-ignore 
            value={field.value ? dayjs(field.value) : null}
            disabled={disabled}
            slotProps={{
              textField: {
                onBlur: (e) => {
                  parseDate(e, field.onChange);
                  onBlur && onBlur(e);
                },
                size: size || "medium",
                color: color || (theme.palette.mode === "dark" ? "secondary" : "primary"),
                fullWidth: fullWidth !== undefined ? fullWidth : true,
                error: !!fieldState.error,
                helperText: fieldState.error ? ((showErrorMinLength && showErrorMinLength <= (fieldState.error.message ? fieldState.error.message.length : 0)) ? null : fieldState.error.message) : null,
                sx: {
                  ...(fieldState.error && {
                    '& .MuiInputBase-input': {
                      color: theme.palette.error.main,
                    },
                    '& .MuiFormLabel-root': {
                      color: theme.palette.error.main,
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: theme.palette.error.dark,
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.error.main,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.error.dark,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.error.dark,
                      },
                      '&.Mui-focused .MuiFormLabel-root': {
                        color: theme.palette.error.dark,
                      },
                    },
                  }),
                },
              },
            }}
            {...props}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default CustomDatePicker;