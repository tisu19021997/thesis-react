import React, { useRef, useState } from 'react';
import Section from '../../Section';
import { useDataList } from '../../../helper/hooks';
import DataTable from '../../DataTable';
import Pagination from '../../Pagination';
import ErrorPage from '../../page/ErrorPage';
import SearchBar from '../../SearchBar';
import axios from 'axios';

function RelatedProductsGenerator() {
  const {
    data, totalDataCount, page, setPage, pages, setSearch, hasPrev, hasNext, error,
  } = useDataList('/management/products');

  const [selectedProducts, selectProducts] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const [kNeighbors, setKNeighbors] = useState(50);
  const [message, setMessage] = useState('');
  const searchInputRef = useRef(null);

  if (error) {
    return <ErrorPage message={error.data} code={error.code} />;
  }

  const getRelatedProducts = async () => {
    setIsFetching(true);

    await axios.post('/products/batch',
      {
        products: Array.from(selectedProducts),
        k: kNeighbors,
      },
      {
        baseURL: 'http://127.0.0.1:5000/api/v1',
      })
      .then((res) => {
        const { recommendations } = res.data;

        if (!recommendations.length) {
          return false;
        }

        return axios.patch('/management/products/batch/related', { recommendations })
          .then((response) => {
            setMessage(response.data.message);
            setIsFetching(false);
          })
          .catch((err) => setMessage(err.message));
      })
      .catch((e) => setMessage(e.message));

    await setIsFetching(false);
  };

  return (
    <Section
      className="o-layout__item"
      title="Generate Related Products"
      titleClass="u-h1"
      subTitle="Using Item-based KNN model to find products' neighbors."
      subTitleClass="u-h4 u-mb-24"
      contentClass="u-txt-align-center u-txt-24"
    >
      <div className="u-w--50 u-mb-24 u-ml-auto u-mr-auto">
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

      {data && (
        <p className="u-txt--light">
          Showing
          <span className="u-txt--bold">{` ${data.length} `}</span>
          of
          <span className="u-txt--bold">{` ${totalDataCount} `}</span>
          products
        </p>
      )}

      <div className="u-mb-12">
        <Pagination
          currentPage={page}
          setPage={setPage}
          totalPages={pages}
          hasNextPage={hasNext}
          hasPrevPage={hasPrev}
        />
      </div>

      <DataTable
        className="u-ml-auto u-mr-auto u-txt-align-left c-datatable--small-first-col c-datatable c-datatable--horizontal c-datatable--scrollable"
        data={data}
        hasSelect
        selected={selectedProducts}
        select={selectProducts}
        fields={['asin', 'title', 'brand']}
        fieldToCheck="asin"
      />

      <div className="u-mb-12 u-d-flex u-fd--column">
        <label htmlFor="k" className="u-txt--light u-mr-6">
          Number of recommendation products
          <input
            name="k"
            type="number"
            className="u-w--10 u-as--center"
            {...setKNeighbors}
            defaultValue={kNeighbors}
          />
        </label>
      </div>

      <div>{message}</div>

      <button
        type="button"
        className="c-btn c-btn--rounded c-btn--primary u-mt-12"
        disabled={isFetching}
        onClick={getRelatedProducts}
      >
        {isFetching ? 'Generating..' : 'Generate'}
      </button>

    </Section>
  );
}

export default RelatedProductsGenerator;
