import React from 'react';
import axios from 'axios';
import { useInput } from '../../helper/hooks';

// TODO: Implement input validation and role authentication
function AddProduct() {
  const { state: asin, bind: bindAsin } = useInput('');
  const { state: name, bind: bindName } = useInput('');
  const { state: price, bind: bindPrice } = useInput(0);
  const { state: imUrl, bind: bindImUrl } = useInput('');
  const { state: description, bind: bindDesc } = useInput('');

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.post('/store-management/products', {
      asin,
      title: name,
      imUrl,
      price,
      description,
    });
  };

  return (
    <div className="u-mt-48">
      <div className="u-txt-40">
        Create new product
      </div>
      <form method="post" onSubmit={onFormSubmit}>
        <input
          {...bindAsin}
          type="text"
          placeholder="product asin"
        />
        <input
          {...bindName}
          type="text"
          placeholder="product name"
        />
        <input
          {...bindPrice}
          type="number"
          placeholder="price"
        />
        <input
          {...bindImUrl}
          type="text"
          placeholder="product image url"
        />
        <input
          {...bindDesc}
          type="text"
          placeholder="description"
        />
        <input type="submit" value="Create" />
      </form>
    </div>
  );
}

export default AddProduct;
