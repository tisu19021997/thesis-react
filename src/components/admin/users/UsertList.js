import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import EditUser from './EditUser';
import { isoDateToString } from '../../../helper/string';
import Pagination from '../../Pagination';

function UserList() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sort, setSort] = useState('');
  const [limit, setLimit] = useState(50);
  const [editing, setEditing] = useState('');
  const [isEditOpen, setEditModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const query = `?s=${search}&page=${page}&limit=${limit}&sort=${sort}`;

    axios.get(`/store-management/users${query}`)
      .then((res) => {
        const {
          docs, totalPages, page: paging, totalDocs,
        } = res.data;

        // update state
        setUsers(docs);
        setPages(totalPages);
        setPage(paging);
        setTotal(totalDocs);
        setIsSearching(false);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [page, isSearching, limit, sort, isEdited]);

  const resetPaging = () => {
    setPage(1);
  };

  const deleteHandle = (event) => {
    const id = event.currentTarget.getAttribute('data-id');

    if (window.confirm('Do you really want to delete this user?')) {
      axios.delete(`/store-management/users/${id}`)
        .then((res) => {
          const { id: userId } = res.data;
          setUsers(users.filter((user) => (user._id !== userId)));
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
        User List
      </div>

      <input
        style={{ width: '50%' }}
        className="c-searchbar__box u-mb-24"
        onChange={(event) => {
          const { value } = event.target;
          setSearch(value);
        }}
        type="search"
        placeholder="Search"
        data-border="rounded"
      />

      <button
        type="button"
        className="c-btn c-btn--small c-btn--rounded c-btn--primary"
        onClick={() => {
          setIsSearching(true);
          resetPaging();
        }}
      >
        Search
      </button>

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
          max={totalUsers}
          defaultValue={limit}
          onChange={(event) => {
            setLimit(event.target.value);
            resetPaging();
          }}
          className="u-txt-20"
        />
        <span className="u-txt--light">
          of
          <span className="u-txt-20 u-txt--bold">{` ${totalUsers} `}</span>
          users
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
          <option value="oldest">Oldest</option>
          <option value="role">Role</option>
        </select>
      </div>


      <table border={1}>
        <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created At</th>
        </tr>
        </thead>
        <tbody>
        {
          users
            ? users.map((user) => (
              <tr key={user.username}>
                <td>
                  <Link className="u-txt-underline" to={`/users/${user.username}`}>
                    {user.username}
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{isoDateToString(user.createdAt)}</td>
                <td>
                  <button
                    type="button"
                    className="c-btn c-btn--rounded"
                    data-id={user._id}
                    onClick={deleteHandle}
                  >
                    <FontAwesomeIcon icon="times" size="1x" />
                  </button>
                </td>

                <td>
                  <button
                    type="button"
                    className="c-btn c-btn--rounded"
                    data-id={JSON.stringify(user)}
                    onClick={editHandle}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
            : <p>Loading</p>
        }
        </tbody>
      </table>


      <Pagination
        currentPage={page}
        totalPages={pages}
        setPage={setPage}
      />


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
        <EditUser
          setIsEdited={setIsEdited}
          closeModal={() => {
            setEditModal(false);
          }}
          user={editing}
        />
      </Modal>

    </div>
  );
}

export default UserList;
