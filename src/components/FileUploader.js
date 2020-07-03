import React from 'react';
import PropTypes from 'prop-types';

function FileUploader(props) {
  let fileInput;

  const { accept, setContent, setError } = props;

  const parseFile = (fileContent) => {
    try {
      const json = JSON.parse(fileContent);
      return setContent(json);
    } catch (e) {
      return setError(e.message);
    }
  };

  const handleFileRead = () => {
    const content = fileInput.result;
    parseFile(content);
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
  accept: PropTypes.string,
  setContent: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

FileUploader.defaultProps = {
  accept: '.json,.csv',
};

export default FileUploader;
