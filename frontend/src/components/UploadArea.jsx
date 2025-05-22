import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function UploadArea() {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/upload', formData);
      alert('File uploaded and processing started!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{
      border: '2px dashed #888',
      borderRadius: 10,
      padding: 40,
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <input {...getInputProps()} />
      <p><strong>Drag & drop a payslip PDF here</strong> or click to select a file.</p>
    </div>
  );
}
