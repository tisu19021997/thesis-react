import React from 'react';
import PropTypes from 'prop-types';

const Section = (props) => {
  const {
    className, data, title, subTitle, titleClass, contentClass, children,
  } = props;

  return (
    <section className={`c-section ${className}`} data-section={data || title}>

      {title
        ? (
          <div className={`c-section__title ${titleClass}`}>
            {title}
          </div>
        )
        : ' '}

      {subTitle
        ? (
          <div className="c-section__sub-title">
            {subTitle}
          </div>
        )
        : ''}

      <div className={`c-section__content ${contentClass}`}>
        {children}
      </div>

    </section>
  );
};

Section.propTypes = {
  className: PropTypes.string,
  data: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  titleClass: PropTypes.string,
  contentClass: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Section.defaultProps = {
  className: '',
  data: 'Default Section Data',
  title: '',
  subTitle: '',
  titleClass: '',
  contentClass: '',
};

export default Section;
