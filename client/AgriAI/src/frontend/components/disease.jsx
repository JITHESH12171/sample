import React, { useState } from 'react';
function Disease() {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'darwin');
    setLoading(true);
    console.log(image);
    const res = await fetch('http://localhost:5000/disease', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    console.log(file);
    setImage(file.disease_name);
    setLoading(false);
  };

  return (

    <div style={{ 
      backgroundImage:"none",
      textAlign: 'center', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '10px', 
      maxWidth: '400px', 
      margin: '50px auto', 
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Upload Image</h1>
      <input
        type="file"
        name="file"
        style={{ 
          backgroundImage:"none",
          margin: '10px', 
          padding: '10px', 
          border: '1px solid #ccc', 
          borderRadius: '5px', 
          cursor: 'pointer'
        }}
        onChange={uploadImage}
      />
      {loading ? (
        <h3 style={{ color: '#555', marginTop: '20px' }}>Loading...</h3>
      ) : (
        <h3 style={{ color: '#333', marginTop: '20px' }}>Class: {image}</h3>
      )}
    </div>
  );
}

export default Disease;