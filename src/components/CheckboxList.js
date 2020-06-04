import React from 'react';
import PropTypes from 'prop-types';

function CheckboxList(props) {
  const {
    checkboxes, flagToCheck, changeHandler, className,
  } = props;
  const isChecked = (value) => value === flagToCheck;

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <ul className={className}>
      <span className="u-txt-14 u-txt-underline u-mr-12">Sort by:</span>
      {checkboxes.map((checkbox) => (
        <li key={checkbox.value} className="o-list-inline__item u-mr-12">
          <input
            type="radio"
            name="checkbox"
            value={checkbox.value}
            defaultChecked={isChecked(checkbox.value)}
            onChange={changeHandler}
          />
          <label htmlFor="checkbox">{checkbox.label}</label>
        </li>
      ))}
    </ul>
  );
}

CheckboxList.propTypes = {
  checkboxes: PropTypes.array.isRequired,
  flagToCheck: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  className: PropTypes.string,
};

CheckboxList.defaultProps = {
  className: 'o-list-inline u-pl-12 u-txt-16',
};

export default CheckboxList;
