import React from 'react';
import PropTypes from 'prop-types';

function Pagination(props) {
  const { totalPages, setPage } = props;
  const buttons = [];
  let { currentPage } = props;
  let firstPage = 1;

  currentPage = parseInt(currentPage, 10);

  if (currentPage > 5) {
    firstPage = currentPage - 4;
  }

  for (let i = firstPage; i <= currentPage + 4 && i < totalPages; i += 1) {
    buttons.push(
      <button
        type="button"
        onClick={() => {
          setPage(i);

        }}
        key={i}
        className={currentPage === i ? 'c-paging-page c-paging-page--current' : 'c-paging-page'}
      >
        {i}
      </button>,
    );
  }

  return buttons;
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  setPage: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  currentPage: '1',
};


export default Pagination;
