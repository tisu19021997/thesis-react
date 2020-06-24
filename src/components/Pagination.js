import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Pagination(props) {
  const {
    totalPages, setPage, hasPrevPage, hasNextPage,
  } = props;

  if (totalPages === 1) {
    return false;
  }

  const buttons = [];
  let { currentPage } = props;
  let firstPage = 1;

  currentPage = parseInt(currentPage, 10);
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  // Only show pages number which are 4-page away from the current page.
  if (currentPage > 3) {
    firstPage = currentPage - 2;
  }

  for (let i = firstPage; i <= currentPage + 2 && i <= totalPages; i += 1) {
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
          <button type="button" onClick={() => setPage(prevPage)} className="c-paging-prev" title="Prev">
            <FontAwesomeIcon icon="chevron-left" />
          </button>
        )
        : ''}

      {buttons}

      {hasNextPage
        ? (
          <button type="button" onClick={() => setPage(nextPage)} className="c-paging-next" title="Next">
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
  ]).isRequired,
  setPage: PropTypes.func.isRequired,
  hasPrevPage: PropTypes.bool,
  hasNextPage: PropTypes.bool,
};

Pagination.defaultProps = {
  hasPrevPage: false,
  hasNextPage: false,
};


export default Pagination;
