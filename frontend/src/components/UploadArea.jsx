import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function UploadArea() {
  const [uploadResult, setUploadResult] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspace', import.meta.env.VITE_WORKSPACE_ID);
    formData.append('document_type', import.meta.env.VITE_DOC_TYPE_ID);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${apiBase}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUploadResult(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadResult({ error: err.response?.data || err.message });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': []
    }
  });

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Payslip Extractor</h1>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #888',
          borderRadius: 10,
          padding: 40,
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p><strong>Drop the file here …</strong></p>
        ) : (
          <p><strong>Drag & drop a payslip PDF here</strong> or click to select a file.</p>
        )}
      </div>

      {uploadResult && (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#f7f7f7',
            padding: '1rem',
            borderRadius: 6,
            marginTop: '1rem'
          }}
        >
          {JSON.stringify(uploadResult, null, 2)}
        </pre>
      )}
    </div>
  );
}
