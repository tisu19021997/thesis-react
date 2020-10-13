import React, { useRef, useState } from 'react';
import axios from 'axios';
import Section from '../../../components/Section';
import { useDataList } from '../../../helper/hooks';
import DataTableWithSelection from '../../../components/DataTableWithSelection';
import Pagination from '../../../components/Pagination';
import ErrorPage from '../../Error';
import SearchBar from '../../../components/SearchBar';
import AsyncButton from '../../../components/AsyncButton';

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
    if (!selectedProducts.size) {
      return setMessage('Error: Please select some products!');
    }

    setMessage('');
    const addtionalMessage = '- Feature not available due to Heroku time-out is only 30 seconds ' +
      'the Item-based KNN model need more time since its size is very large.';
    try {
      const res = await axios.post('/products/batch',
        {
          products: Array.from(selectedProducts),
          k: kNeighbors,
        },
        {
          baseURL: 'https://thesis-recsys.herokuapp.com/api/v1',
        });
      const { recommendations } = res.data;

      if (!recommendations.length) {
        return false;
      }

      return axios.patch('/management/products/batch/related', { recommendations })
        .then((response) => {
          setMessage(response.data.message);
          setIsFetching(false);
        })
        .catch((err) => setMessage(err.message + addtionalMessage));
    } catch (e) {
      return setMessage(e.message + addtionalMessage);
    }
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

      <DataTableWithSelection
        className="u-ml-auto u-mr-auto u-txt-align-left c-datatable--small-first-col c-datatable--horizontal c-datatable--scrollable"
        data={data}
        selected={selectedProducts}
        select={selectProducts}
        fields={['asin', 'title', 'brand']}
        fieldToCheck="asin"
      />

      <div className="u-mb-12 u-d-flex u-fd--column">
        <label htmlFor="k" className="u-txt--light u-mr-6">
          Number of related products
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

      <AsyncButton
        className="c-btn c-btn--rounded c-btn--primary u-mt-12"
        asyncCallback={getRelatedProducts}
        buttonText="Generate"
        buttonTextOnFetch="Generating..."
      />

    </Section>
  );
}

export default RelatedProductsGenerator;
