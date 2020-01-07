import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useInput } from '../../../helper/hooks';

function EditUser(props) {
  const { user, closeModal, setIsEdited } = props;

  const { state: username, bind: bindUsername } = useInput(user.username);
  const { state: email, bind: bindEmail } = useInput(user.email);
  const { state: role, bind: bindRole } = useInput(user.role);

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.patch(`/store-management/users/${user._id}`, {
      username,
      email,
      role,
    })
      .then(() => {
        closeModal();
        setIsEdited(true);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  return (
    <div>
      <div className="u-txt-24 u-txt--bold u-mb-24">
        {`Editing "${user.username}"`}
      </div>

      <form method="post" onSubmit={onFormSubmit}>
        <div className="u-mb-12">
          <span className="u-txt--bold">Username:</span>
          <input
            className="u-w--100"
            {...bindUsername}
            type="text"
            placeholder="username"
            defaultValue={username}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Email:</span>
          <input
            className="u-w--100"
            {...bindEmail}
            type="text"
            placeholder="user email"
            defaultValue={email}
          />
        </div>

        <div className="u-mb-12">
          <span className="u-txt--bold">Role:</span>
          <input
            type="radio"
            {...bindRole}
            name="role"
            defaultChecked={role === 'admin'}
            value="admin"
          />
          Admin

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
          className="c-btn c-btn--primary u-d-block u-mv-12"
          type="submit"
        >
          Save
        </button>
      </form>

    </div>
  );
}

EditUser.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setIsEdited: PropTypes.func.isRequired,
};

export default EditUser;
