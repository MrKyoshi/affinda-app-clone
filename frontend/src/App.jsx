import React from 'react';
import UploadArea from './components/UploadArea.jsx';

function App() {
  return (
    <div className="App" style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>Payslip Extractor</h1>
      <UploadArea />
    </div>
  );
}

export default App;
