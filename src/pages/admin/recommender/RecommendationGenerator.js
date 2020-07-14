import React, { useState, useRef } from 'react';
import axios from 'axios';
import Section from '../../../components/Section';
import { useDataList, useInput } from '../../../helper/hooks';
import Pagination from '../../../components/Pagination';
import DataTableWithSelection from '../../../components/DataTableWithSelection';
import SearchBar from '../../../components/SearchBar';
import AsyncButton from '../../../components/AsyncButton';

function RecommendationGenerator() {
  const {
    data: users, totalDataCount: totalUsers, page, setPage, pages, setSearch, hasPrev, hasNext,
  } = useDataList('/management/users');

  const [selectedUsers, selectUsers] = useState(new Set());
  const [message, setMessage] = useState('');
  const { state: k, bind: setK } = useInput(50);

  const searchInputRef = useRef(null);

  const generateRecommendations = async () => {
    if (!selectedUsers.size) {
      return setMessage('Error: Please select some users!');
    }

    try {
      const res = await axios.post('/users/batch',
        {
          users: Array.from(selectedUsers),
          k,
        },
        {
          baseURL: 'http://127.0.0.1:5000/api/v1',
        });
      const { recommendations } = res.data;

      if (!recommendations.length) {
        return false;
      }

      return axios.patch('/management/users/batch/recommendations', { recommendations })
        .then((response) => {
          setMessage(response.data.message);
        })
        .catch((err) => setMessage(err.message));
    } catch (e) {
      setMessage(e.message);
    }

    return false;
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

      <DataTableWithSelection
        className="u-ml-auto u-mr-auto u-txt-align-left c-datatable--small-first-col c-datatable--horizontal c-datatable--scrollable"
        data={users}
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

      <AsyncButton
        asyncCallback={generateRecommendations}
        className="c-btn c-btn--rounded c-btn--primary u-mt-12"
        buttonText="Generate"
        buttonTextOnFetch="Generating.."
      />


    </Section>
  );
}

export default RecommendationGenerator;
