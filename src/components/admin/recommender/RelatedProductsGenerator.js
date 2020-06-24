import React, { useRef, useState } from 'react';
import Section from '../../Section';
import { useDataList } from '../../../helper/hooks';
import DataTable from '../../DataTable';
import Pagination from '../../Pagination';

function RelatedProductsGenerator() {
  const {
    data, totalDataCount, page, setPage, pages, setSearch, hasPrev, hasNext,
  } = useDataList('/management/products');

  const [selectedProducts, selectProducts] = useState(new Set());

  const searchInputRef = useRef(null);

  return (
    <Section
      className="o-layout__item"
      title="Generate Related Products"
      subTitle="Using Item-based KNN model to find products' neighbors."
      contentClass="u-txt-align-center"
    >
      <input
        className="c-searchbar__box u-mb-24 u-d-iblock u-w--50"
        style={{ height: '50px' }}
        ref={searchInputRef}
        type="search"
        placeholder="Search by name or ASIN or brand"
        data-border="rounded"
      />
      <button
        type="button"
        className="c-btn c-btn--small c-btn--rounded c-btn--primary u-d-iblock"
        onClick={() => {
          setSearch(searchInputRef.current.value);
          setPage(1);
        }}
      >
        Search
      </button>

      {data && (
        <p className="u-txt--light">
          Showing
          <span className="u-txt--bold">{` ${data.length} `}</span>
          of
          <span className="u-txt--bold">{` ${totalDataCount} `}</span>
          users
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
        className="u-ml-auto u-mr-auto u-txt-align-left u-w--33 c-datatable c-datatable--horizontal c-datatable--scrollable"
        data={data}
        selected={selectedProducts}
        select={selectProducts}
        fields={['asin']}
        fieldToCheck="asin"
      />

    </Section>
  );
}

export default RelatedProductsGenerator;
