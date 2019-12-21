import React, { useState } from 'react';
import axios from 'axios';
import { useInput } from '../../helper/hooks';

// TODO: Implement input validation and role authentication
function AddProduct() {
  const { state: asin, bind: bindAsin } = useInput('');
  const { state: name, bind: bindName } = useInput('');
  const { state: price, bind: bindPrice } = useInput(0);
  const { state: imUrl, bind: bindImUrl } = useInput('');
  const { state: description, bind: bindDesc } = useInput('');

  const [errorMessage, setError] = useState('');

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.post('/store-management/products', {
      asin,
      title: name,
      imUrl,
      price,
      description,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        setError(`Error ${error.response.status}: ${error.response.data.message}`);
      });
  };

  return (
    <div className="u-mt-48">
      <p style={{ color: 'red' }}>{errorMessage}</p>
      <div className="u-txt-40">
        Create new product
      </div>
      <form method="post" onSubmit={onFormSubmit}>
        <input
          {...bindAsin}
          type="number"
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
          step="0.00001"
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
