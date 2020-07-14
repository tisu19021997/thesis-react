import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useInput } from '../../../helper/hooks';

function EditCat(props) {
  const { cat, closeModal, callback, callbackParam } = props;

  const { state: name, bind: bindCatName } = useInput(cat.name.join(','));
  const { state: iconClass, bind: bindIcon } = useInput(cat.iconClass);
  const { state: imUrl, bind: bindImUrl } = useInput(cat.imUrl);

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.patch(`/management/cats/${cat.id}`, {
      name: name.split(','),
      iconClass,
      imUrl,
    })
      .then(() => {
        closeModal();
        callback(!callbackParam);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  return (
    <div>
      <div className="u-txt-24 u-txt--bold u-mb-24">
        {`Editing "${cat.name}"`}
      </div>

      <form method="post" onSubmit={onFormSubmit}>
        <div className="u-mb-12">
          <span className="u-txt--bold">Name:</span>
          <input
            className="u-w--100"
            {...bindCatName}
            type="text"
            placeholder="name"
            defaultValue={name}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Icon:</span>
          <input
            className="u-w--100"
            {...bindIcon}
            type="text"
            placeholder="cat email"
            defaultValue={iconClass}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Image URL:</span>
          <input
            className="u-w--100"
            type="text"
            {...bindImUrl}
            defaultValue={imUrl}
          />

        </div>

        <button
          className="c-btn c-btn--primary u-d-block u-mv-12"
          type="submit"
        >
          Save
        </button>
      </form>

    </div>
  );
}

EditCat.propTypes = {
  closeModal: PropTypes.func.isRequired,
  cat: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])).isRequired,
  callback: PropTypes.func.isRequired,
  callbackParam: PropTypes.bool.isRequired,
};

export default EditCat;
