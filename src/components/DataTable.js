import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';

function DataTable(props) {
  const {
    data, fields, hasSelect, fieldToCheck, selected, select, className,
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
      className={className}
      style={{
        boxShadow: '-2px 4px 17px 7px rgba(199,199,199,1)',
        width: 'auto',
      }}
    >
      <thead>
      <tr>
        {hasSelect && (
          <th>
            <input
              style={{ scale: '1.5' }}
              type="checkbox"
              onChange={selectAll}
            />
          </th>
        )}

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
            <tr key={index}>
              {hasSelect && (
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
              )}

              {fields.map((field, idx) => {
                if (field && dp[field]) {
                  return (
                    <td key={field}>
                      {`${dp[field].toString()
                        .substr(0, 40)}...`}
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

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  fieldToCheck: PropTypes.string,
  selected: instanceOf(Set),
  select: PropTypes.func,
  hasSelect: PropTypes.bool,
};

DataTable.defaultProps = {
  className: 'c-datatable',
  hasSelect: false,
  selected: new Set([]),
  fieldToCheck: '',
  select: () => false,
};

export default DataTable;
