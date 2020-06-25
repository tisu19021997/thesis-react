import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function SearchBar(props) {
  const {
    searchHandler, inputHandler, inputRef, inputStyle, inputPlaceholder,
  } = props;

  return (
    <form
      className="c-searchbar"
      method="get"
      onSubmit={searchHandler}
      role="search"
      acceptCharset="utf-8"
    >
      <div className="c-searchbar__box">
        <input
          style={inputStyle}
          type="search"
          name="keyword"
          ref={inputRef}
          onChange={inputHandler}
          placeholder={inputPlaceholder}
          aria-label="Search"
          data-border="rounded"
        />
        <div className="c-searchbar__button">
          <button
            type="button"
            onClick={searchHandler}
            className="c-searchbar__button-icon"
            style={{
              border: 'none',
              background: 'transparent',
            }}
          >
            <FontAwesomeIcon icon="search" className="medium" />
          </button>
          <input type="submit" defaultValue="Go" />
        </div>
      </div>
    </form>
  );
}

SearchBar.propTypes = {
  searchHandler: PropTypes.func.isRequired,
  inputStyle: PropTypes.objectOf(PropTypes.string),
  inputHandler: PropTypes.func,
  inputPlaceholder: PropTypes.string,
};

SearchBar.defaultProps = {
  inputHandler: () => false,
  inputStyle: {},
  inputPlaceholder: 'Search anything...',
};

export default SearchBar;
