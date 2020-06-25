import React from 'react';
import Wrapper from '../Wrapper';

function ErrorPage(props) {
  const { message, code } = props;

  // TODO: Implement error page
  return (
    <Wrapper>
      <h3>
        {`${message} with status code ${code}`}
      </h3>
    </Wrapper>
  );
}

export default ErrorPage;

