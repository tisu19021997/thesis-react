import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from '../../FileUploader';
import ServerExporter from '../../ServerExporter';
import Section from '../../Section';
import { useInput } from '../../../helper/hooks';

function ImportProduct() {
  const [file, setFile] = useState(null);
  const { state: fileType, bind: setFileType } = useInput('csv');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const importFile = () => {
    if (!file) {
      setError('Please select one JSON file from your computer.');

      return false;
    }

    if (!file.length) {
      setError('Please check your JSON file again. The valid format of JSON file must be an array of products.');

      return false;
    }

    axios.post('/store-management/products/batch', file)
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
      <Section
        title="Import Products"
        titleClass="u-txt-40 u-txt--bold u-mb-24"
      >
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

      </Section>

      <Section
        title="Export Products"
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
          endpoint="/store-management/products/batch"
          fileName="products"
          fileType={fileType}
        />

      </Section>

    </div>
  );
}

export default ImportProduct;
