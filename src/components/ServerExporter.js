import React from 'react';
import PropTypes from 'prop-types';
import * as FileSaver from 'file-saver';
import axios from 'axios';

function ServerExporter(props) {
  const { fileName, fileType, endpoint } = props;

  const exportAll = () => axios.get(`${endpoint}?type=${fileType}`, {
    responseType: fileType === 'csv' ? 'blob' : 'json',
  })
    .then((res) => {
      // The response is a Blob object when the file type is CSV and
      // a JSON object when the file type is JSON.
      const blob = fileType === 'csv'
        ? res.data
        : new Blob([JSON.stringify(res.data)],
          { type: 'text/plain;charset=utf-8' });

      FileSaver.saveAs(blob, `${fileName}.${fileType}`);
    })
    .catch((e) => console.log(e));

  return (
    <button
      type="button"
      onClick={exportAll}
      className="c-btn c-btn--primary c-btn--rounded u-float-right"
    >
      Export
    </button>
  );
}

ServerExporter.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileType: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
};

ServerExporter.defaultProps = {
  fileType: 'csv',
};
export default ServerExporter;
