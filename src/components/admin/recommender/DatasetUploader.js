import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CSVReader } from 'react-papaparse';
import * as FileSaver from 'file-saver';
import Section from '../../Section';
import DataTableWithSelection from '../../DataTableWithSelection';

function DatasetUploader(props) {
  const { setDataset } = props;

  const [data, setData] = useState([]);
  const [dataHeader, setDataHeader] = useState([]);
  const [message, setMessage] = useState('');

  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const dataset = data ? data.map((dp) => dp.data) : [];

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

  const handleOnError = (err) => {
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
    if (!data.length) {
      return false;
    }

    setSaveBtnDisabled(true);

    if (window.confirm('The old dataset may get lost. Please back-up the old dataset first. Still proceed?')) {
      axios.post('/dataset', {
        data: dataset,
        header: dataHeader,
      }, {
        baseURL: 'http://127.0.0.1:5000/api/v1',
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
    axios.get('/dataset',
      {
        baseURL: 'http://127.0.0.1:5000/api/v1',
      })
      .then(async (res) => {
        const { data: backupData } = res;
        const filename = 'data-backup.csv';
        const file = new File([backupData], filename, { type: 'text/csv;charset=utf-8' });
        FileSaver.saveAs(file);
      })
      .catch((e) => setMessage(`[ERROR] ${e.message}`));
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <>
      <Section
        title="Upload New Dataset"
        titleClass="u-h1"
        subTitle="Correct format for each row of data: <reviewerID, asin, overall>."
        subTitleClass="u-h4"
        className="o-layout__item u-mb-36"
        contentClass="u-txt-align-center"
      >
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          config={{
            header: true,
            skipEmptyLines: true,
          }}
          style={{
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          addRemoveButton
          onRemoveFile={handleOnRemoveFile}
        >
          <span>Drop CSV dataset here or click to upload.</span>
        </CSVReader>

        <div className="u-mt-24">{message}</div>

        <div className="u-mt-24">
          <button
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

      <Section
        className="o-layout__item"
        title="Data Live Preview"
        titleClass="u-h1"
        subTitle="A brief preview of your data will appear here."
        subTitleClass="u-h4"
        contentClass={`u-txt-align-center u-txt-24 ${dataset.length ? 'u-overflow-x-scroll' : ''}`}
      >
        {dataset.length > 0 && (
          <DataTableWithSelection
            className="u-mb-0 u-ml-auto u-mr-auto u-txt-align-left c-datatable--small-first-col c-datatable--horizontal c-datatable--scrollable"
            data={dataset.slice(-100)}
            fields={dataHeader}
          />
        )}
      </Section>
    </>
  );
}

DatasetUploader.propTypes = {
  setDataset: PropTypes.func.isRequired,
};

export default DatasetUploader;
