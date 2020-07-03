import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QueryString from 'querystring';
import PropTypes from 'prop-types';

function CategoryDropDown(props) {
  const [cats, setCats] = useState('');

  const { onChange, queryOrBody } = props;

  useEffect(() => {
    axios.get('/management/cats?s=&limit=1000')
      .then((res) => {
        const { docs } = res.data;
        setCats(docs);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, []);

  const stringifyCat = (cat) => (QueryString.stringify({ cat: JSON.stringify({ cat: cat.name }) }));

  return (
    <select
      style={
        { maxWidth: '500px' }
      }
      onChange={onChange}
    >
      {
        cats
          ? cats.map((cat) => {
            let { name } = cat;
            name = name.join(', ');
            return (
              <option
                value={queryOrBody === 'query' ? stringifyCat(cat) : cat.name}
                key={name}
              >
                {name}
              </option>
            );
          })
          : ''
      }
    </select>
  );
}

CategoryDropDown.propTypes = {
  onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  queryOrBody: PropTypes.string,
};

CategoryDropDown.defaultProps = {
  queryOrBody: 'query',
};

export default CategoryDropDown;
