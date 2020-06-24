import React, { useState } from 'react';
import axios from 'axios';
import { useInput } from '../../../helper/hooks';

function AddCat() {
  const { state: name, bind: bindName } = useInput('');
  const { state: iconClass, bind: bindIcon } = useInput('');
  const { state: imUrl, bind: bindIm } = useInput('');

  const [message, setMessage] = useState({
    status: null,
    message: '',
  });

  const onFormSubmit = (event) => {
    event.preventDefault();

    axios.post('/management/cats', {
      name,
      iconClass,
      imUrl,
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
        Create new category
      </div>

      <form method="post" onSubmit={onFormSubmit}>
        <div className="u-mb-12">
          <input
            {...bindName}
            type="text"
            placeholder="name"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindIcon}
            type="text"
            placeholder="icon class"
          />
        </div>

        <div className="u-mb-12">
          <input
            {...bindIm}
            type="text"
            placeholder="image url"
          />
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

export default AddCat;
