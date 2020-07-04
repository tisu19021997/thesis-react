import React from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../Wrapper';

function NotFoundPage() {
  return (
    <Wrapper className="u-txt-align-center u-mv-60">
      <h1>404: Page Not Found :(</h1>
      <Link to="/" className="c-btn c-btn--ghost">
        Go to home.
      </Link>
    </Wrapper>
  );
}

export default NotFoundPage;
