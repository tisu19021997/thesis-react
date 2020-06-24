import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useInput } from '../../../helper/hooks';

function EditProduct(props) {
  const { product, closeModal, setIsEdited } = props;

  const { state: asin, bind: bindAsin } = useInput(product.asin);
  const { state: title, bind: bindName } = useInput(product.title);
  const { state: price, bind: bindPrice } = useInput(product.price);
  const { state: discountPrice, bind: bindDiscPrice } = useInput(product.discountPrice);
  const { state: imUrl, bind: bindImUrl } = useInput(product.imUrl);
  const { state: description, bind: bindDesc } = useInput(product.description);

  console.log(product.asin);

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.patch(`/management/products/${product._id}`, {
      asin,
      title,
      price,
      discountPrice,
      imUrl,
      description,
    })
      .then(() => {
        closeModal();
        setIsEdited(true);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  return (
    <div>
      <div className="u-txt-24 u-txt--bold u-mb-24">
        {`Editing "${product.title}"`}
        <img src={imUrl} alt={title} width={100} />
      </div>

      <form method="post" onSubmit={onFormSubmit}>
        <div className="u-mb-12">
          <span className="u-txt--bold">ASIN:</span>
          <input
            className="u-w--100"
            {...bindAsin}
            type="text"
            placeholder="product asin"
            defaultValue={asin}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Name:</span>
          <input
            className="u-w--100"
            {...bindName}
            type="text"
            placeholder="product name"
            defaultValue={title}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Price:</span>
          <input
            className="u-w--100"
            {...bindPrice}
            type="number"
            step="0.00001"
            placeholder="price"
            defaultValue={price}
          />
        </div>
        <div className="u-mb-12">
          <span className="u-txt--bold">Discount Price:</span>
          <input
            className="u-w--100"
            {...bindDiscPrice}
            type="number"
            step="0.00001"
            placeholder="discount price"
            defaultValue={discountPrice}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Image URL:</span>
          <input
            className="u-w--100"
            {...bindImUrl}
            type="text"
            placeholder="product image url"
            defaultValue={imUrl}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Description:</span>
          <input
            className="u-w--100"
            {...bindDesc}
            type="text"
            placeholder="description"
            defaultValue={description}
          />
        </div>

        <button
          className="c-btn c-btn--primary u-d-block u-mv-12"
          type="submit"
        >
          Save
        </button>
      </form>

    </div>
  );
}

EditProduct.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setIsEdited: PropTypes.func.isRequired,
};

export default EditProduct;
