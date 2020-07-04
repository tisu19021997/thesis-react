import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Button(props) {
  const {
    className, buttonText, onClick, disableOnClick, buttonProps,
  } = props;
  const [disability, disable] = useState(false);

  const onButtonClick = async (event) => {
    event.preventDefault();

    if (disableOnClick) {
      await disable(true);
      await onClick();
      await disable(false);

      return true;
    }

    return onClick();
  };

  return (
    <button
      type="button"
      className={className}
      onClick={onButtonClick}
      disabled={disability}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      {...buttonProps}
    >
      {buttonText}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  buttonText: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disableOnClick: PropTypes.bool,
  buttonProps: PropTypes.objectOf(PropTypes.string),
};

Button.defaultProps = {
  className: 'c-btn',
  buttonText: 'Confirm',
  disableOnClick: false,
  buttonProps: {},
};

export default Button;
