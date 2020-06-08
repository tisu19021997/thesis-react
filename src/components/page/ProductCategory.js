import React, { useState, useEffect } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';
import axios from 'axios';
import Pagination from '../Pagination';
import { Desktop, Mobile } from '../../helper/mediaQuery';
import CheckboxList from '../CheckboxList';
import Product from '../Product';

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

  const sortHandle = (event) => {
    setSort(event.target.value);

    // reset paging to the first page
    setPage(1);
  };

  const filters = [
    {
      label: 'Featured',
      value: 'featured',
    },
    {
      label: 'New Arrivals',
      value: 'newest',
    },
    {
      label: 'Low Price',
      value: 'price-asc',
    },
    {
      label: 'High Price',
      value: 'price-desc',
    },
    {
      label: 'Sale Off',
      value: 'sale',
    },
  ];

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
              <CheckboxList flagToCheck={sort} checkboxes={filters} changeHandler={sortHandle} />
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

        </Mobile>

      </main>
    </div>
  );
}

ProductCategory.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(ProductCategory);
