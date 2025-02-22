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
    console.log(file)
    setImage(file.disease_name);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Upload Image</h1>
      <input
        type="file"
        name="file"
        style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        onChange={uploadImage}
      />
      {loading ? (
        <h3 style={{ color: '#555' }}>Loading...</h3>
      ) : (
        <h3 style={{ color: 'white' }}>class : {image}</h3>
      )}
    </div>
  );
}

export default Disease;