import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { concatStrWithSuffix } from '../helper/string';

function DataTableWithSelection(props) {
  const {
    data, fields, fieldToCheck, selected, select, className,
  } = props;

  const selectAll = (event) => {
    if (!data.length) {
      return false;
    }

    if (event.target.checked) {
      const newSelectedUsers = new Set(selected);
      data.map((user) => newSelectedUsers.add(user[fieldToCheck]));

      return select(newSelectedUsers);
    }

    return select(new Set([]));
  };

  return (
    <table
      className={`c-datatable ${className}`}
      style={{
        boxShadow: '-2px 4px 17px 7px rgba(199,199,199,1)',
        width: 'auto',
      }}
    >
      <thead>
      <tr>
        <th>
          <input
            style={{ scale: '1.5' }}
            type="checkbox"
            onChange={selectAll}
          />
        </th>
        {
          fields.map((field) => <th key={field}>{field}</th>)
        }
      </tr>
      </thead>

      <tbody style={{
        maxHeight: '500px',
      }}
      >
      {
        data
          ? data.map((dp, index) => (
            <tr
              className={selected.has(dp[fieldToCheck]) ? 'selected' : ''}
              key={index.toString()}
            >
              <td>
                <input
                  style={{ scale: '1.5' }}
                  type="checkbox"
                  value={dp[fieldToCheck]}
                  checked={selected.has(dp[fieldToCheck])}
                  onChange={() => {
                    const newSelectedUsers = new Set(selected);

                    if (newSelectedUsers.has(dp[fieldToCheck])) {
                      newSelectedUsers.delete(dp[fieldToCheck]);
                    } else {
                      newSelectedUsers.add(dp[fieldToCheck]);
                    }

                    return select(newSelectedUsers);
                  }}
                />
              </td>

              {fields.map((field, idx) => {
                if (field && dp[field]) {
                  return (
                    <td key={field}>
                      {concatStrWithSuffix(dp[field].toString(), 40)}
                    </td>
                  );
                }

                return <td key={idx} />;
              })}

            </tr>
          ))
          : <p>Loading</p>
      }
      </tbody>
    </table>
  );
}

DataTableWithSelection.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  fieldToCheck: PropTypes.string,
  selected: instanceOf(Set),
  select: PropTypes.func,
};

DataTableWithSelection.defaultProps = {
  className: '',
  selected: new Set([]),
  fieldToCheck: '',
  select: () => false,
};

export default DataTableWithSelection;
