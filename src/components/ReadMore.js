import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { concatStrWithSuffix } from '../helper/string';

function ReadMore(props) {
  const {
    text, maxLength, readMoreText, readLessText,
  } = props;
  const [isShown, setIsShown] = useState(false);
  const toggle = () => {
    setIsShown(!isShown);
  };

  let displayText = text;

  if (text) {
    if (!isShown && text.length >= maxLength) {
      displayText = concatStrWithSuffix(text, maxLength);
    }
  }
  return (
    <>
      {displayText}
      <button
        type="button"
        className="u-float-right u-txt-10 u-txt-underline"
        onClick={toggle}
      >
        {text && text.length > maxLength
          ? (
            <span>
              <i className="fas fa-caret-down" />
              {isShown ? readLessText : readMoreText}
            </span>
          )
          : ''}
      </button>
    </>
  );
}

ReadMore.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  readMoreText: PropTypes.string,
  readLessText: PropTypes.string,
};

ReadMore.defaultProps = {
  maxLength: 500,
  readMoreText: 'More',
  readLessText: 'Less',
};

export default ReadMore;
