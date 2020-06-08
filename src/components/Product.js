import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Product = (props) => {
  const { product, useName, usePrice, overlay } = props;
  const overlayClass = overlay ? 'c-product--overlayed' : '';
  return (
    <Link
      to={`/products/${product.asin}`}
      className={`c-product ${overlayClass}`}
    >
      {overlay
        ? (
          <div className="c-product__overlay-container">
            <div className="c-product__overlay">
              <div className="c-product__name">
                {product.title}
              </div>
              <div className="c-price">
            <span className="c-price__price c-price--small">
              <span className="c-price__currency">$</span>
              {product.price}
            </span>
              </div>
            </div>
          </div>
        )
        : ''}

      <div className="c-product__img">
        <img src={product.imUrl} alt={product.title} />
      </div>

      {useName
        ? (
          <div className="c-product__name">
            {product.title}
          </div>
        )
        : ''
      }

      {usePrice
        ? (
          <div className="c-price">
            <span className="c-price__price">
              <span className="c-price__currency">$</span>
              {product.price}
            </span>
          </div>
        )
        : ''
      }
    </Link>
  );
};

Product.propTypes = {
  product: PropTypes.object.isRequired,
  useName: PropTypes.bool,
  usePrice: PropTypes.bool,
  overlay: PropTypes.bool,
};

Product.defaultProps = {
  useName: true,
  usePrice: true,
  overlay: false,
};


export default Product;
