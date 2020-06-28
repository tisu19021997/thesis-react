import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axios from 'axios';
import InputsFromConfig from './InputsFromConfig';

function DataEditModal(props) {
  const {
    initData, isModalOpen, setModalOpen, inputConfigs,
    endpoint, endpointField, afterEditingCallback,
  } = props;

  const [changes, setChanges] = useState({});

  const inputChangeHandler = (event) => {
    setChanges({
      ...changes,
      [event.target.name]: event.target.value,
    });
  };

  const editCallback = async (event) => {
    event.preventDefault();

    await axios.patch(`${endpoint}/${initData[endpointField]}`, changes)
      .then((res) => {
        afterEditingCallback(res.data);
        setModalOpen(false);
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    await setChanges({});
  };

  return (
    <Modal
      style={{
        content: {
          inset: '50% auto auto 50%',
          width: '70%',
          height: '60%',
          transform: 'translate(-50%, -50%)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, .35)',
        },
      }}
      isOpen={isModalOpen}
      onRequestClose={() => {
        setModalOpen(false);
      }}
    >
      <form method="post" onSubmit={editCallback}>
        <InputsFromConfig configs={inputConfigs} onChange={inputChangeHandler} />
        <button className="c-btn c-btn--primary u-d-block u-mv-12" type="submit">
          Save
        </button>
      </form>
    </Modal>
  );
}

DataEditModal.propTypes = {
  initData: PropTypes.objectOf(PropTypes.any).isRequired,
  afterEditingCallback: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func.isRequired,
  inputConfigs: PropTypes.arrayOf(PropTypes.object).isRequired,
  endpoint: PropTypes.string.isRequired,
  endpointField: PropTypes.string.isRequired,
};

DataEditModal.defaultProps = {
  isModalOpen: false,
};

export default DataEditModal;
