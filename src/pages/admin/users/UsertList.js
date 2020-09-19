import React, { useState, useRef } from 'react';
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import { useDataList } from '../../../helper/hooks';
import SearchBar from '../../../components/SearchBar';
import DataTableWithHandlers from '../../../components/DataTableWithHandlers';
import DataEditModal from '../../../components/DataEditModal';

function UserList() {
  const [editing, setEditing] = useState(null);
  const [isEditOpen, setEditModal] = useState(false);
  const [, setIsEdited] = useState(false);

  const searchInputRef = useRef(null);

  const {
    data: users, setData: setUsers, totalDataCount: totalUsers, pages, page, limit,
    setPage, setSearch, setSort, setLimit, hasNext, hasPrev, triggerFetch, fetchTriggerer,
  } = useDataList('/management/users');

  const handlers = [
    {
      label: 'Delete',
      cb: (event) => {
        const username = event.currentTarget.getAttribute('data-index');

        if (window.confirm('Do you really want to delete this user?')) {
          axios.delete(`/management/users/${username}`)
            .then(() => {
              return setUsers(users.filter((user) => (user.username !== username)));
            })
            .catch((error) => {
              throw new Error(error);
            });
        }

        return false;
      },
    },
    {
      label: 'Edit',
      cb: (event) => {
        const username = event.currentTarget.getAttribute('data-index');
        const curUser = users.filter((user) => user.username === username)[0];
        const { email, role } = curUser;
        setEditing({
          username,
          email,
          role,
        });
        setEditModal(true);
        setIsEdited(false);
      },
    },
  ];

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
            setLimit(parseInt(event.target.value, 10));
            setPage(1);
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
            setPage(1);
          }}
        >
          <option value="newest">None</option>
          <option value="oldest">Newest</option>
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

      {users.length > 0 && (
        <DataTableWithHandlers
          handlers={handlers}
          indexField="username"
          fields={['username', 'email', 'role', 'createdAt']}
          data={users}
        />
      )}

      {editing && (
        <DataEditModal
          isModalOpen={isEditOpen}
          initData={editing}
          afterEditingCallback={() => triggerFetch(!fetchTriggerer)}
          setModalOpen={setEditModal}
          endpoint="/management/users"
          endpointField="username"
          inputConfigs={
            [
              {
                name: 'username',
                type: 'text',
                label: 'Username',
                defaultValue: editing.username,
                placeHolder: 'Username',
              },
              {
                name: 'email',
                type: 'email',
                label: 'Email',
                defaultValue: editing.email,
                placeHolder: 'Email',
              },
              {
                name: 'role',
                type: 'radio',
                label: 'Role',
                choices: [
                  {
                    value: 'user',
                    label: 'User',
                  },
                  {
                    value: 'admin',
                    label: 'Admin',
                  },
                ],
                defaultValue: editing.role,
              },
            ]
          }
        />
      )}
    </div>
  );
}

export default UserList;
