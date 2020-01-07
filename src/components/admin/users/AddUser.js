import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useInput } from '../../../helper/hooks';

function AddUser() {
  const { state: username, bind: bindUsername } = useInput('');
  const { state: password, bind: bindPassword } = useInput('');
  const { state: email, bind: bindEmail } = useInput('');
  const { state: role, bind: bindRole } = useInput('user');

  const [message, setMessage] = useState({
    status: null,
    message: '',
  });

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.post('/store-management/users', {
      username,
      password,
      email,
      role,
    })
      .then((res) => {
        setMessage({
          status: res.status,
          content: res.data.message,
        });
      })
      .catch((error) => {
        setMessage(
          {
            status: error.response.status,
            content: `Error ${error.response.status}: ${error.response.data.message}`,
          });
      });
  };

  return (
    <div className="u-mv-24">
      {message
        ? (
          <p style={message.status === 201
            ? {
              color: 'green',
            }
            : {
              color: 'red',
            }}
          >
            {message.content}
          </p>
        )
        : ''}


      <div className="u-txt-40 u-txt--bold u-mb-24">
        Create new product
      </div>

      <form method="post" onSubmit={onFormSubmit}>
        <div className="u-mb-12">
          <input
            {...bindUsername}
            type="text"
            placeholder="username"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindPassword}
            type="password"
            placeholder="password"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindEmail}
            type="email"
            placeholder="email"
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt-14">Role: </span>
          <br />
          <input
            type="radio"
            {...bindRole}
            name="role"
            defaultChecked={role === 'admin'}
            value="admin"
          />
          Admin

          <br />

          <input
            type="radio"
            {...bindRole}
            name="role"
            defaultChecked={role === 'user'}
            value="user"
          />
          User
        </div>

        <button
          className="c-btn c-btn--primary u-d-block u-mt-12"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default AddUser;
