import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Product = (props) => {
  const { product, useName, usePrice } = props;

  return (
    <Link
      to={`/products/${product.asin}`}
      className="c-product"
    >

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
};

Product.defaultProps = {
  useName: true,
  usePrice: true,
};


export default Product;
