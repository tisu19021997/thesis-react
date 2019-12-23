import React from 'react';
import PropTypes from 'prop-types';

function FileUploader(props) {
  let fileInput;

  const { callback, accept } = props;

  const handleFileRead = () => {
    const content = fileInput.result;
    callback(content);
  };

  const handleFileUpload = (file) => {
    fileInput = new FileReader();
    fileInput.onloadend = handleFileRead;
    fileInput.readAsText(file);
  };

  return (
    <input
      type="file"
      accept={accept}
      onChange={(event) => {
        handleFileUpload(event.target.files[0]);
      }}
    />
  );
}

FileUploader.propTypes = {
  callback: PropTypes.func.isRequired,
  accept: PropTypes.string,
};

FileUploader.defaultProps = {
  accept: '',
};

export default FileUploader;
