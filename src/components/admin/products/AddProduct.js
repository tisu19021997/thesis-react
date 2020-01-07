import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useInput } from '../../../helper/hooks';

function AddProduct() {
  const { state: asin, bind: bindAsin } = useInput('');
  const { state: name, bind: bindName } = useInput('');
  const { state: price, bind: bindPrice } = useInput(0);
  const { state: imUrl, bind: bindImUrl } = useInput('');
  const { state: description, bind: bindDesc } = useInput('');
  const { state: cat, bind: bindCat } = useInput('');

  const [errorMessage, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/categories')
      .then((res) => {
        const { categories: cate } = res.data;
        setCategories(cate);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.post('/store-management/products', {
      asin,
      title: name,
      imUrl,
      price,
      description,
      categories: cat,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        setError(`Error ${error.response.status}: ${error.response.data.message}`);
      });
  };

  return (
    <div className="u-mv-24">
      {errorMessage
        ? (<p style={{ color: 'red' }}>{errorMessage}</p>)
        : ''}


      <div className="u-txt-40 u-txt--bold u-mb-24">
        Create new product
      </div>

      <form method="post" onSubmit={onFormSubmit}>
        <div className="u-mb-12">
          <input
            {...bindAsin}
            type="number"
            placeholder="product asin"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindName}
            type="text"
            placeholder="product name"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindPrice}
            type="number"
            step="0.00001"
            placeholder="price"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindImUrl}
            type="text"
            placeholder="product image url"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindDesc}
            type="text"
            placeholder="description"
          />
        </div>

        <select
          {...bindCat}
        >
          {
            categories
              ? categories.map((category) => (
                <option key={category.name} value={category._id}>
                  {category.name}
                </option>
              ))
              : ''
          }
        </select>

        <button
          className="c-btn c-btn--primary u-d-block u-mt-12"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
