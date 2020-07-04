import React, { useState } from 'react';
import PropTypes from 'prop-types';

function AsyncButton(props) {
  const {
    className, buttonText, buttonTextOnFetch, asyncCallback, buttonProps,
  } = props;
  const [disabled, disable] = useState(false);

  const onClick = async (event) => {
    event.preventDefault();

    disable(true);
    await asyncCallback();
    disable(false);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {disabled ? buttonTextOnFetch : buttonText}
    </button>
  );
}

AsyncButton.propTypes = {
  className: PropTypes.string,
  buttonText: PropTypes.string,
  buttonTextOnFetch: PropTypes.string,
  asyncCallback: PropTypes.func.isRequired,
  buttonProps: PropTypes.objectOf(PropTypes.string),
};

AsyncButton.defaultProps = {
  className: 'c-btn',
  buttonText: 'Confirm',
  buttonTextOnFetch: 'Confirming...',
  buttonProps: {},
};

export default AsyncButton;
