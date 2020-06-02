import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from '../../FileUploader';

function ImportUser() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const importFile = () => {
    if (!file) {
      setError('Please select one JSON file from your computer.');
      return false;
    }

    if (!file.length) {
      setError('Please check your JSON file again. The valid format of JSON file must be an array of users.');
      return false;
    }

    axios.post('/store-management/users/batch', file)
      .then((res) => {
        setMessage(res.data.message);
        setError('');
      })
      .catch((e) => {
        setError(e.message);
      });

    return true;
  };

  const parseFile = (fileContent) => {
    try {
      const json = JSON.parse(fileContent);
      setFile(json);
    } catch (e) {
      setError(e.message);
      return false;
    }

    return false;
  };


  return (
    <div className="u-mv-24">
      <div className="u-txt-40 u-txt--bold u-mb-24">
        Import Users
      </div>

      <div style={{ color: 'red' }}>{error}</div>

      <div className="u-txt-14 u-txt--bold">{message}</div>

      <span className="u-txt--light">Upload your JSON file here: </span>

      <FileUploader
        callback={parseFile}
        accept="application/json"
      />

      <button
        type="button"
        onClick={importFile}
        className="c-btn c-btn--primary c-btn--rounded"
      >
        Import
      </button>

    </div>
  );
}

export default ImportUser;
