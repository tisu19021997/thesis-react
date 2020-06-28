import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import EditProduct from './EditProduct';
import Pagination from '../../Pagination';
import CategoryDropDown from '../../CategoryDropDown';
import { useDataList } from '../../../helper/hooks';
import SearchBar from '../../SearchBar';
import { concatStrWithSuffix } from '../../../helper/string';

function ProductList() {
  const [editing, setEditing] = useState('');
  const [isEditOpen, setEditModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const searchInputRef = useRef(null);

  const {
    data: products, setData: setProducts, totalDataCount: totalProducts, pages, page, limit,
    setPage, setSearch, setSort, setLimit, setCatFilter, hasNext, hasPrev, fetchTriggerer, triggerFetch,
  } = useDataList('/management/products');

  const resetPaging = () => {
    setPage(1);
  };

  const deleteHandle = (event) => {
    const id = event.currentTarget.getAttribute('data-id');

    if (window.confirm('Do you really want to delete this product?')) {
      axios.delete(`/management/products/${id}`)
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

  const editHandle = (event) => {
    setEditing(JSON.parse(event.currentTarget.getAttribute('data-id')));
    setEditModal(true);
    setIsEdited(false);
  };

  return (
    <div className="u-mv-24">
      <div className="u-txt-40 u-txt--bold u-mb-24">
        Product List
      </div>

      <div className="u-w--50 u-mb-24">
        <SearchBar
          inputStyle={{
            height: '50px',
          }}
          searchHandler={(event) => {
            event.preventDefault();
            setSearch(searchInputRef.current.value);
            setPage(1);
          }}
          inputRef={searchInputRef}
          inputPlaceholder="Search by Name or ASIN or Brand"
        />
      </div>


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

      <div className="u-mv-24 u-txt-16">
        <span className="u-txt--light">Category:</span>
        <CategoryDropDown onChange={(event) => {
          setCatFilter(event.target.value);
          resetPaging();
        }}
        />
      </div>

      <div className="u-mb-24">
        <Pagination
          currentPage={page}
          totalPages={pages}
          setPage={setPage}
          hasPrevPage={hasPrev}
          hasNextPage={hasNext}
        />
      </div>

      <table className="c-datatable c-datatable--scrollable c-datatable--horizontal">
        <thead>
        <tr>
          <th>ASIN</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Disc. Price</th>
          <th>Image</th>
          <th />
          <th />
        </tr>
        </thead>
        <tbody style={{ maxHeight: '500px' }}>
        {
          products.length > 0
            ? products.map((product) => (
              <tr key={product.asin}>
                <td>{product.asin}</td>
                <td>
                  <Link className="u-txt-underline" to={`/products/${product.asin}`}>
                    {concatStrWithSuffix(product.title || '', 40)}
                  </Link>
                </td>
                <td>{product.brand}</td>
                <td>{`$${product.price}`}</td>
                <td>{product.discountPrice}</td>
                <td>
                  <img src={product.imUrl} alt={product.title} width={100} />
                </td>

                <td>
                  <button
                    type="button"
                    className="c-btn c-btn--rounded"
                    data-id={product._id}
                    onClick={deleteHandle}
                  >
                    <FontAwesomeIcon icon="times" size="1x" />
                  </button>
                </td>

                <td>
                  <button
                    type="button"
                    className="c-btn c-btn--rounded"
                    data-id={JSON.stringify(product)}
                    onClick={editHandle}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
            : ''
        }
        </tbody>
      </table>

      <Modal
        style={{
          content: {
            inset: '50% auto auto 50%',
            width: '70%',
            height: '60%',
            transform: 'translate(-50%, -50%)',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, .35)',
          },
        }}
        isOpen={isEditOpen}
        onRequestClose={() => {
          setEditModal(false);
        }}
      >
        <EditProduct
          afterEditingCallback={() => {
            triggerFetch(!fetchTriggerer);
          }}
          closeModal={() => {
            setEditModal(false);
          }}
          product={editing}
        />
      </Modal>

    </div>
  );
}

export default ProductList;
