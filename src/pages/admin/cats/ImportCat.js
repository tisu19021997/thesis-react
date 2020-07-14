import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from '../../../components/FileUploader';
import ServerExporter from '../../../components/ServerExporter';
import Section from '../../../components/Section';
import { useInput } from '../../../helper/hooks';

function ImportCat() {
  const [file, setFile] = useState(null);
  const { state: fileType, bind: setFileType } = useInput('csv');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const importFile = () => {
    if (!file) {
      return setError('Please select one JSON file from your computer.');
    }

    if (!file.length) {
      return setError('Please check your JSON file again. The valid format of JSON file must be an array of products.');
    }

    return axios.post('/management/cats/batch', file)
      .then((res) => {
        setMessage(res.data.message);
        setError('');
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  return (
    <div className="u-mv-24">
      <Section
        title="Import Categories"
        titleClass="u-txt-40 u-txt--bold u-mb-24"
      >
        <div style={{ color: 'red' }}>{error}</div>

        <div className="u-txt-14 u-txt--bold">{message}</div>

        <span className="u-txt--light">Upload your JSON file here: </span>

        <FileUploader
          setContent={setFile}
          setError={setError}
          accept="application/json"
        />

        <button
          type="button"
          onClick={importFile}
          className="c-btn c-btn--primary c-btn--rounded"
        >
          Import
        </button>

      </Section>

      <Section
        title="Export Categories"
        subTitle="Export all products into a CSV file."
        titleClass="u-txt-40"
      >
        <div style={{ color: 'red' }}>{error}</div>

        <div className="u-txt-14 u-txt--bold">{message}</div>

        <label className="u-mr-6" htmlFor="file-type">File Type</label>
        <select
          className="u-txt-14 u-mr-12"
          name="file-type"
          defaultValue={fileType}
          {...setFileType}
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>

        <ServerExporter
          endpoint="/management/cats/batch"
          fileName="cats"
          fileType={fileType}
        />

      </Section>

    </div>
  );
}

export default ImportCat;
