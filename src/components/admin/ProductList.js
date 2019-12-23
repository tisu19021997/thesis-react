import React, { useState, useEffect } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    const query = `?s=${search}&page=${page}&limit=${limit}&sort=${sort}`;

    axios.get(`/products${query}`)
      .then((res) => {
        const {
          products: docs, totalPages, page: paging, totalDocs,
        } = res.data;

        // update state
        setProducts(docs);
        setPages(totalPages);
        setPage(paging);
        setTotal(totalDocs);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [page, search, limit, sort]);

  const resetPaging = () => {
    setPage(1);
  };

  const deleteHandle = (event) => {
    const id = event.currentTarget.getAttribute('data-product');

    if (window.confirm('Do you really want to delete this product?')) {
      axios.delete(`/store-management/products/${id}`)
        .then((res) => {
          const { id: productId } = res.data;
          setProducts(products.filter((product) => (product._id !== productId)));
        })
        .catch((error) => {
          throw new Error(error);
        });
    }

    return false;
  };

  // set up pagination
  const paginationButtons = [];

  if (products.length) {
    for (let i = 1; i <= pages; i += 1) {
      paginationButtons.push(
        <button
          type="button"
          onClick={() => {
            setPage(i);
          }}
          key={i}
          className={parseInt(page, 10) === i ? 'c-paging-page c-paging-page--current' : 'c-paging-page'}
        >
          {i}
        </button>,
      );
    }
  }

  return (
    <div className="u-mv-24">
      <div className="u-txt-40 u-txt--bold u-mb-24">
        Product List
      </div>

      <input
        style={{ width: '50%' }}
        className="c-searchbar__box u-mb-24"
        onChange={(event) => {
          const { value } = event.target;
          setSearch(value);
          resetPaging();
        }}
        type="search"
        placeholder="Search"
        data-border="rounded"
      />


      <div className="u-mv-24 u-txt-16">

        <span className="u-txt--light">Showing</span>
        <input
          style={{
            maxWidth: '70px',
            border: 'none',
            fontWeight: '700',
          }}
          type="number"
          min={limit}
          max={totalProducts}
          defaultValue={limit}
          onChange={(event) => {
            setLimit(event.target.value);
            resetPaging();
          }}
          className="u-txt-20"
        />
        <span className="u-txt--light">
          of
          <span className="u-txt-20 u-txt--bold">{` ${totalProducts} `}</span>
          products
        </span>

      </div>


      <div className="u-mv-24 u-txt-16">
        <span className="u-txt--light">Sort by:</span>
        <select
          defaultValue=""
          onChange={(event) => {
            setSort(event.target.value);
            resetPaging();
          }}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="sale">Sale Off</option>
        </select>
      </div>


      <table border={1}>
        <thead>
        <tr>
          <th>ASIN</th>
          <th>Name</th>
          <th>Price</th>
          <th>Image</th>
        </tr>
        </thead>
        <tbody>
        {
          products
            ? products.map((product) => (
              <tr key={product.asin}>
                <td>{product.asin}</td>
                <td>
                  <Link className="u-txt-underline" to={`/products/${product.asin}`}>
                    {product.title}
                  </Link>
                </td>
                <td>{product.price}</td>
                <td>
                  <img src={product.imUrl} alt={product.title} width={100} />
                </td>
                <td>
                  <button
                    type="button"
                    className="c-btn c-btn--rounded"
                    data-product={product._id}
                    onClick={deleteHandle}
                  >
                    <FontAwesomeIcon icon="times" size="1x" />
                  </button>
                </td>
              </tr>
            ))
            : <p>Loading</p>
        }
        </tbody>
      </table>

      {paginationButtons}
    </div>
  );
}

export default ProductList;
