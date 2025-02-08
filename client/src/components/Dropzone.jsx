import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const Dropzone = ({ onDrop, accept, borderColor, ...props }) => {
  const theme = useTheme();

  const onDropCallback = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${borderColor || theme.palette.primary.main}`,
        borderRadius: '5px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease-in-out',
        ...(isDragActive && { borderColor: green[500] })
      }}
      {...props}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop images of the child here, or click to select an image</p>
      )}
    </div>
  );
};

export default Dropzone;
