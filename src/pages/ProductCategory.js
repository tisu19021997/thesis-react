import React, { useState, useEffect } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import axios from 'axios';
import { useModal } from 'react-modal-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactModal from 'react-modal';
import Pagination from '../components/Pagination';
import { Desktop, Mobile } from '../helper/mediaQuery';
import CheckboxList from '../components/CheckboxList';
import Product from '../components/Product';
import { sortList, mobileCenteredModalStyles } from '../helper/constant';

function ProductCategory(props) {
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('featured');
  const { match } = props;
  const { params } = match;
  const { id } = params;

  useEffect(() => {
    const query = `?page=${page}&sort=${sort}`;

    axios.get(`/categories/${id}${query}`)
      .then((res) => {
        const {
          products: docs, totalPages: totalP, page: paging, totalDocs, category: cat,
          hasPrevPage, hasNextPage,
        } = res.data;

        setProducts(docs);
        setCategory(cat);
        setTotalPages(totalP);
        setPage(paging);
        setTotalProducts(totalDocs);
        setHasNext(hasNextPage);
        setHasPrev(hasPrevPage);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, [page, sort, id]);

  const [showSortModal, hideSortModal] = useModal(() => (
    // eslint-disable-next-line react/jsx-filename-extension
    <Mobile>
      <ReactModal
        onRequestClose={hideSortModal}
        style={mobileCenteredModalStyles}
        isOpen
      >
        <div className="u-txt-align-right">
          <button
            type="button"
            onClick={hideSortModal}
            className="ReactCart-Close"
          >
            <FontAwesomeIcon icon="times" size="2x" />
          </button>
        </div>
        <div className="u-txt-16 u-txt--bold">Sort by:</div>
        {sortList.map((choice) => (
          <div key={choice.value} className="u-ml-12 u-mt-12 u-mb-6">
            <input
              type="radio"
              name="choice"
              value={choice.value}
              checked={choice.value === sort}
              onChange={() => {
                setSort(choice.value);
                hideSortModal();
              }}
            />
            <label htmlFor="choice">{choice.label}</label>
          </div>
        ))}
      </ReactModal>
    </Mobile>
  ));

  const sortHandle = (event) => {
    setSort(event.target.value);

    // reset paging to the first page
    setPage(1);
  };

  return (
    <div className="o-wrapper u-ph-0">
      <main data-section="Main Content">

        <Desktop>

          {/* #PAGE-NAME */}
          <div className="u-mt-12 u-mb-36">
            <span className="u-txt--light u-txt-24">
                Products in
              <span className="u-txt--bold">
                {` ${Array.prototype.join.call(category, '/')}`}
              </span>
            </span>
            <div className="u-float-right u-txt-align-right">
              <span className="u-txt--bold u-txt-24">{totalProducts}</span>
              <div className="u-txt--light u-txt-12">products</div>
            </div>
          </div>
          {/* /Page Name */}


          {/* #MAIN AREA */}
          <div className="o-layout o-layout--flush">

            {/* #RIGHT COLUMN */}
            <div className="o-layout__item u-pt-6">


              {/* #SORT */}
              <CheckboxList flagToCheck={sort} checkboxes={sortList} changeHandler={sortHandle} />
              {/*  /Sort  */}


              {/* #PRODUCTS */}
              <div className="o-layout o-layout--medium u-pl-48">
                {products.map((product) => (
                  <div key={product.asin} className="o-layout__item u-mb-24 u-1/4">
                    <Product product={product} />
                  </div>
                ))}
              </div>
              {/* /Products */}


              {/* #PAGINATION */}
              {totalPages > 1
                ? (
                  <div className="c-paging u-txt-align-center u-pv-12 u-mb-6 u-border-all-blur">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      setPage={setPage}
                      hasPrevPage={hasPrev}
                      hasNextPage={hasNext}
                    />
                  </div>
                )
                : ''}

              {/*  /Pagination  */}


            </div>


          </div>
          {/* /Main Area */}

        </Desktop>


        <Mobile>
          {/* #PAGE-NAME */}
          <div className="u-mt-12 u-mb-36 u-ph-12">
            <span className="u-txt--light u-txt-16">
                Products in
              <span className="u-txt--bold">
                {` ${category[category.length - 1]}`}
              </span>
            </span>
            <div className="u-float-right u-txt-align-right">
              <span className="u-txt--bold u-txt-16">{totalProducts}</span>
              <div className="u-txt--light u-txt-12">products</div>
            </div>
          </div>
          {/* /Page Name */}


          {/* #PRODUCTS */}
          <div className="o-layout u-ph-12">
            {products.map((product) => (
              <div key={product.asin} className="o-layout__item u-mb-24 u-1/2">
                <Product product={product} />
              </div>
            ))}
          </div>
          {/* /Products */}


          {/* #PAGINATION */}
          {totalPages > 1
            ? (
              <div className="c-paging u-txt-align-center u-pv-12 u-mb-6 u-border-all-blur">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  setPage={setPage}
                  hasPrevPage={hasPrev}
                  hasNextPage={hasNext}
                />
              </div>
            )
            : ''}
          {/*  /Pagination  */}

          {/* #TOOLBAR */}
          <div className="c-toolbar u-d-flex u-jc--c u-w--100 u-bg-darkblue u-p-6 u-pb-0">

            {/* #SORT */}
            <div className="c-toolbar__item u-txt--white u-txt-align-center">
              <button
                type="button"
                className="u-txt--white u-ph-0"
                onClick={showSortModal}
              >
                <FontAwesomeIcon icon="filter" className="u-txt--white" />
                <div className="u-txt-12 u-mt-6">Sort</div>
              </button>
            </div>
            {/* /SORT */}


          </div>
          {/* /TOOLBAR */}

        </Mobile>

      </main>
    </div>

  );
}

ProductCategory.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(ProductCategory);
