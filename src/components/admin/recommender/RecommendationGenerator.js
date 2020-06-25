import React, { useState, useRef } from 'react';
import axios from 'axios';
import Section from '../../Section';
import { useDataList, useInput } from '../../../helper/hooks';
import Pagination from '../../Pagination';
import DataTable from '../../DataTable';
import SearchBar from '../../SearchBar';

function RecommendationGenerator() {
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
    setFetching(true);

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
      titleClass="u-h1"
      subTitle="Handy user recommendation generator using Incremental SVD model."
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
          inputPlaceholder="Search by Name or Email"
        />
      </div>

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
        className="u-ml-auto u-mr-auto u-txt-align-left c-datatable--small-first-col c-datatable c-datatable--horizontal c-datatable--scrollable"
        data={users}
        hasSelect
        selected={selectedUsers}
        select={selectUsers}
        fields={['username']}
        fieldToCheck="username"
      />

      <div className="u-mb-12 u-d-flex u-fd--column">
        <label htmlFor="k" className="u-txt--light u-mr-6">
          Number of recommendation products
          {' '}
          <input
            name="k"
            type="number"
            className="u-w--10 u-as--center"
            {...setK}
            defaultValue={k}
          />
        </label>
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
