import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import EditUser from './EditUser';
import { isoDateToString } from '../../../helper/string';
import Pagination from '../../Pagination';
import { useDataList } from '../../../helper/hooks';
import SearchBar from '../../SearchBar';

function UserList() {
  const [isSearching, setIsSearching] = useState(false);
  const [editing, setEditing] = useState('');
  const [isEditOpen, setEditModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const searchInputRef = useRef(null);

  const {
    data: users, setData: setUsers, totalDataCount: totalUsers, pages, page, limit,
    setPage, setSearch, setSort, setLimit, hasNext, hasPrev,
  } = useDataList('/management/users');

  const resetPaging = () => {
    setPage(1);
  };

  const deleteHandle = (event) => {
    const id = event.currentTarget.getAttribute('data-id');

    if (window.confirm('Do you really want to delete this user?')) {
      axios.delete(`/management/users/${id}`)
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

      <div className="u-w--50 u-mb-24">
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

      <div className="u-mb-24">
        <Pagination
          currentPage={page}
          totalPages={pages}
          setPage={setPage}
          hasNextPage={hasNext}
          hasPrevPage={hasPrev}
        />
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
