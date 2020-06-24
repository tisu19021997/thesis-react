import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Section from '../../Section';
import { useDataList, useInput } from '../../../helper/hooks';
import Pagination from '../../Pagination';
import DataTable from '../../DataTable';

function RecommendationGenerator() {
  // TODO: use the UseDataList hook instead.
  const {
    data: users, totalDataCount: totalUsers, page, setPage, pages, setSearch, hasPrev, hasNext,
  } = useDataList('/management/users');

  const [selectedUsers, selectUsers] = useState(new Set());
  const [message, setMessage] = useState('');
  const [isFetching, setFetching] = useState(false);

  const { state: k, bind: setK } = useInput(50);

  const searchInputRef = useRef(null);

  const generateRecommendations = async () => {
    // Disable the button.
    await setFetching(true);

    await axios.post('/users/batch',
      {
        users: Array.from(selectedUsers),
        k,
      },
      {
        baseURL: 'http://127.0.0.1:5000/api/v1',
      })
      .then((res) => {
        const { recommendations } = res.data;

        if (!recommendations.length) {
          return false;
        }

        return axios.patch('/management/users/batch/recommendations', { recommendations })
          .then((response) => {
            setMessage(response.data.message);
          })
          .catch((err) => setMessage(err.message));
      })
      .catch((e) => setMessage(e.message));

    await setFetching(false);
  };

  return (
    <Section
      className="o-layout__item"
      title="Generate Recommendations for Users"
      subTitle="Handy user recommendation generator using Incremental SVD model."
      contentClass="u-txt-align-center"
    >
      <input
        className="c-searchbar__box u-mb-24 u-d-iblock u-w--50"
        style={{
          height: '50px',
        }}
        ref={searchInputRef}
        type="search"
        placeholder="Search user by name or email"
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

      <p className="u-txt--light">
        Showing
        <span className="u-txt--bold">{` ${users.length} `}</span>
        of
        <span className="u-txt--bold">{` ${totalUsers} `}</span>
        users
      </p>

      <div className="u-mb-12">
        <Pagination
          currentPage={page}
          totalPages={pages}
          setPage={setPage}
          hasPrevPage={hasPrev}
          hasNextPage={hasNext}
        />
      </div>

      <DataTable
        className="u-ml-auto u-mr-auto u-txt-align-left u-w--33 c-datatable c-datatable--horizontal c-datatable--scrollable"
        selected={selectedUsers}
        select={selectUsers}
        data={users}
        fields={['username']}
        fieldToCheck="username"
      />

      <div className="u-mb-12 u-d-flex u-fd--column">
        <label htmlFor="k" className="u-txt--light u-mr-6">
          Number of recommendation products
        </label>
        <input
          name="k"
          type="number"
          className="u-w--10 u-as--center"
          {...setK}
          defaultValue={k}
        />
      </div>

      <div>{message}</div>

      <button
        type="button"
        className="c-btn c-btn--rounded c-btn--primary u-mt-12"
        disabled={isFetching}
        onClick={generateRecommendations}
      >
        {isFetching ? 'Generating..' : 'Generate'}
      </button>

    </Section>
  );
}

export default RecommendationGenerator;
