import React, { useState, useEffect } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

function ProductList(props) {
  const useQuery = () => {
    const { location } = props;
    return new URLSearchParams(location.search);
  };

  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(useQuery()
    .get('page') || 1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`/store-management/products?page=${page}`)
      .then((res) => {
        const { docs, totalPages, page: paging } = res.data;
        setProducts(docs);
        setPages(totalPages);
        setPage(paging);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);


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

  const searchProducts = (event) => {
    const { value } = event.target;
    setSearch(value);

    axios.get(`/products?s=${value}`)
      .then((res) => {
        const { products: docs } = res.data;
        setProducts(docs);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <div className="u-mt-24">
      <input
        onChange={searchProducts}
        className="c-searchbar__box u-mb-24"
        type="search"
        placeholder="Search"
        data-border="rounded"
      />

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
    </div>
  );
}

ProductList.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(ProductList);
