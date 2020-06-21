import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CSVReader } from 'react-papaparse';
import * as FileSaver from 'file-saver';
import Section from '../../Section';

function DatasetUploader(props) {
  const { setDataset } = props;

  const [data, setData] = useState([]);
  const [dataHeader, setDataHeader] = useState([]);
  const [message, setMessage] = useState('');

  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const saveBtnRef = useRef(null);

  const handleOnDrop = async (results) => {
    if (!results) {
      return false;
    }
    await setData(results);
    await setDataset(results);
    await setDataHeader(results[0].meta.fields);
    await setSaveBtnDisabled(false);

    return true;
  };

  const handleOnError = (err, file, inputElem, reason) => {
    setMessage(err);
  };

  const handleOnRemoveFile = () => {
    setData([]);
    setDataset([]);
    setDataHeader([]);
    setSaveBtnDisabled(true);
    setMessage('');
  };

  const saveToServer = async () => {
    if (!data) {
      return false;
    }

    setSaveBtnDisabled(true);

    if (window.confirm('The old dataset may get lost. Please back-up the old dataset first. Still proceed?')) {
      axios.post('/recommender/dataset', {
        data,
        header: dataHeader,
      })
        .then((res) => {
          setSaveBtnDisabled(false);
          setMessage(res.data.message);
        })
        .catch((e) => {
          setMessage(e.message);
        });
    }
  };

  const backup = () => {
    axios.get('/recommender/dataset')
      .then(async (res) => {
        const { data: backupData } = res;
        const filename = 'data-backup.csv';
        const file = new File([backupData], filename, { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(file);
      })
      .catch((e) => setMessage(e));
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <>
      <Section
        title="Upload New Dataset"
        data="Upload New Dataset"
        className="o-layout__item u-2/5"
      >
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          config={{
            header: true,
            skipEmptyLines: true,
          }}
          addRemoveButton
          onRemoveFile={handleOnRemoveFile}
        >
          <span>Drop CSV dataset here or click to upload.</span>
        </CSVReader>


        <div className="u-mt-12">{message}</div>


        <div className="u-mt-12">
          <button
            ref={saveBtnRef}
            type="button"
            onClick={saveToServer}
            disabled={saveBtnDisabled}
            className="c-btn c-btn--primary c-btn--rounded"
          >
            Upload to server
          </button>

          <button
            className="c-btn c-btn--primary c-btn--rounded u-ml-6"
            onClick={backup}
          >
            Back-up from server
          </button>
        </div>
      </Section>


      <Section title="Data Live Preview" className="o-layout__item u-3/5">
        <table>
          <thead>
          <tr>
            {dataHeader.map((item) => (
              <th style={{ textAlign: 'left' }} key={item} scope="col">{item}</th>
            ))}
          </tr>
          </thead>

          <tbody>
          {data.slice(-5)
            .map((dataPoint) => (
              <tr key={dataPoint.meta.cursor}>
                <td>{dataPoint.data.reviewerID}</td>
                <td>{dataPoint.data.asin}</td>
                <td>{dataPoint.data.overall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}

DatasetUploader.propTypes = {
  setDataset: PropTypes.func.isRequired,
};

export default DatasetUploader;
