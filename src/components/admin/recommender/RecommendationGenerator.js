import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Section from '../../Section';
import { useInput } from '../../../helper/hooks';
import Pagination from '../../Pagination';

function RecommendationGenerator() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUsers, selectUsers] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  // For users pagination
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  // Button state.
  const [isFetching, setFetching] = useState(false);

  const { state: k, bind: setK } = useInput(50);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const query = `?s=${search}&page=${page}&sort=newest&limit=100`;

    axios.get(`/management/users${query}`)
      .then((res) => {
        const {
          docs, totalDocs, totalPages, hasPrevPage, hasNextPage
        } = res.data;
        setUsers(docs);
        setPages(totalPages);
        setTotalUsers(totalDocs);
        setHasPrev(hasPrevPage);
        setHasNext(hasNextPage);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [page, search]);

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

  const selectAllUsers = (event) => {
    if (!users.length) {
      return false;
    }

    if (event.target.checked) {
      const newSelectedUsers = new Set(selectedUsers);
      users.map((user) => newSelectedUsers.add(user.username));

      return selectUsers(newSelectedUsers);
    }

    return selectUsers(new Set([]));
  };

  return (
    <Section
      className="o-layout__item u-1/2"
      title="Generate Recommendations for Users"
      subTitle="Handy user recommendation generator using Incremental SVD model."
    >
      <input
        className="c-searchbar__box u-mb-24 u-d-iblock u-w--50"
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

      <table className="u-w--50 c-datatable c-datatable--horizontal c-datatable--scrollable">
        <thead>
        <tr>
          <th>
            <input
              style={{ scale: '1.5' }}
              type="checkbox"
              onChange={selectAllUsers}
            />
          </th>
          <th>Username</th>
        </tr>
        </thead>

        <tbody style={{
          maxHeight: '500px',
        }}
        >
        {
          users
            ? users.map((user) => (
              <tr key={user.username}>
                <td>
                  <input
                    style={{ scale: '1.5' }}
                    type="checkbox"
                    value={user.username}
                    checked={selectedUsers.has(user.username)}
                    onChange={() => {
                      const newSelectedUsers = new Set(selectedUsers);

                      if (newSelectedUsers.has(user.username)) {
                        newSelectedUsers.delete(user.username);
                      } else {
                        newSelectedUsers.add(user.username);
                      }

                      return selectUsers(newSelectedUsers);
                    }}
                  />
                </td>

                <td>
                  <span className="u-p-6">{user.username}</span>
                </td>

              </tr>
            ))
            : <p>Loading</p>
        }
        </tbody>
      </table>

      <div className="u-mb-12 u-d-flex u-fd--column">
        <label htmlFor="k" className="u-txt--light u-mr-6">
          Number of recommendation products
        </label>
        <input
          name="k"
          type="number"
          className="u-w--10"
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
