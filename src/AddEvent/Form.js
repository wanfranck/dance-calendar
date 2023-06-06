import React, { useState } from 'react';
import { parseLink } from './parseLink';

const Form = () => {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLooading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic here
    console.log('Form submitted:', { link, title, startDate, endDate, location, image });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} style={styles.form}>
      <label htmlFor="link" style={styles.label}>
        Link:
      </label>
      <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} style={styles.input} />
      {!parsedData && <button onClick={()=> {
        setLooading(true);
        parseLink(link).then(data => {
            if (!data) return;
            setParsedData(data);
            setTitle(data.data.title);
            setStartDate(data.data.start_date);
            setEndDate(data.data.end_date);
            setLocation(data.data.location?.name);
            setImage(data.imageUrl);
            setLooading(false);
        })
      }} style={styles.button(!link)} disabled={!link}>Parse Link</button>}
      {loading && <p>Loading...</p>}
      {parsedData && (<><label htmlFor="title" style={styles.label}>
        Title:
      </label>
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />

      <label htmlFor="start-date" style={styles.label}>
        Start Date:
      </label>
      <input type="text" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.input} />

      <label htmlFor="end-date" style={styles.label}>
        End Date:
      </label>
      <input type="text" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.input} />

      <label htmlFor="location" style={styles.label}>
        Location:
      </label>
      <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} />

      <label htmlFor="image" style={styles.label}>
        Image:
      </label>
      <input type="file" id="image" accept="image/*" onChange={handleImageUpload} style={styles.fileInput} />

      {image && (
        <div style={styles.imagePreviewContainer}>
          <h4 style={styles.imagePreviewTitle}>Image Preview:</h4>
          <img src={image} alt="Preview" style={styles.imagePreview} />
        </div>
      )}

      <button type="submit" style={styles.button()}>Submit</button></>)}
    </form>
  );
};

export default Form;

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    margin: '0 auto',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: '16px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  fileInput: {
    marginBottom: '16px',
  },
  imagePreviewContainer: {
    marginBottom: '16px',
  },
  imagePreviewTitle: {
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  imagePreview: {
    maxWidth: '200px',
  },
  button: (disabled) => ({
    padding: '8px 16px',
    backgroundColor: disabled ? 'grey' :'#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' :'pointer',
  }),
};
