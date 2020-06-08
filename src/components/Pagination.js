import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Pagination(props) {
  const {
    totalPages, setPage, hasPrevPage, hasNextPage,
  } = props;
  const buttons = [];
  let { currentPage } = props;
  let firstPage = 1;

  currentPage = parseInt(currentPage, 10);
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  // Only show pages number which are 4-page away from the current page.
  if (currentPage > 4) {
    firstPage = currentPage - 4;
  }

  for (let i = firstPage; i <= currentPage + 4 && i <= totalPages; i += 1) {
    buttons.push(
      // eslint-disable-next-line react/jsx-filename-extension
      <button
        type="button"
        onClick={() => setPage(i)}
        key={i}
        className={currentPage === i ? 'c-paging-page c-paging-page--current' : 'c-paging-page'}
      >
        {i}
      </button>,
    );
  }

  return (
    <>
      {hasPrevPage
        ? (
          <button type="button" onClick={() => setPage(prevPage)} className="c-paging-prev">
            <FontAwesomeIcon icon="chevron-left" />
          </button>
        )
        : ''}

      {buttons}

      {hasNextPage
        ? (
          <button type="button" onClick={() => setPage(nextPage)} className="c-paging-next">
            <FontAwesomeIcon icon="chevron-right" />
          </button>
        )
        : ''}
    </>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  setPage: PropTypes.func.isRequired,
  hasPrevPage: PropTypes.bool,
  hasNextPage: PropTypes.bool,
};

Pagination.defaultProps = {
  currentPage: '1',
  hasPrevPage: false,
  hasNextPage: false,
};


export default Pagination;
