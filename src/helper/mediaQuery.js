import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

export const Mobile = ((props) => {
  const { children } = props;

  return (
    <MediaQuery minWidth={320} maxWidth={739}>
      {children || <span />}
    </MediaQuery>
  );
});


export const Tablet = ((props) => {
  const { children } = props;

  return (
    <MediaQuery minWidth={740} maxWidth={979}>
      {children || <span />}
    </MediaQuery>
  );
});

export const Desktop = ((props) => {
  const { children } = props;

  return (
    <MediaQuery minWidth={980}>
      {children || <span />}
    </MediaQuery>
  );
});

Mobile.propTypes = {
  children: PropTypes.node.isRequired,
};

Tablet.propTypes = {
  children: PropTypes.node.isRequired,
};

Desktop.propTypes = {
  children: PropTypes.node.isRequired,
};
