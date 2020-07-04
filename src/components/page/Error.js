import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Wrapper from '../Wrapper';

function Error(props) {
  const { error } = props;

  return (
    <Wrapper className="u-txt-align-center u-mv-60">
      <h1>{`Error ${error.status}: ${error.statusText} :(`}</h1>
      <Link to="/" className="c-btn c-btn--ghost">
        Go to home.
      </Link>
    </Wrapper>
  );
}

Error.propTypes = {
  error: PropTypes.objectOf(PropTypes.any),
};

Error.defaultProps = {
  error: {
    status: 404,
    statusText: 'Page Not Found',
  },
};

export default Error;
