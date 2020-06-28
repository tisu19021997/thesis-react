import React from 'react';
import PropTypes from 'prop-types';
import { concatStrWithSuffix } from '../helper/string';

function DataTableWithHandlers(props) {
  const {
    data, fields, handlers, indexField, className,
  } = props;

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
        {
          fields.map((field) => <th key={field}>{field}</th>)
        }
        {
          handlers.map((handler) => <th key={handler.label} />)
        }
      </tr>
      </thead>

      <tbody style={{ maxHeight: '500px' }}>
      {
        data
          ? data.map((dp, index) => (
            <tr key={index.toString()}>
              {fields.map((field, idx) => {
                if (field && dp[field]) {
                  return (
                    <td key={field}>
                      {concatStrWithSuffix(dp[field].toString(), 40)}
                    </td>
                  );
                }

                return <td key={idx.toString()} />;
              })}

              {
                handlers
                  .map((handler) => (
                    <td key={handler.label}>
                      <button
                        type="button"
                        className="c-btn c-btn--rounded"
                        data-index={dp[indexField]}
                        onClick={handler.cb}
                      >
                        {handler.label}
                      </button>
                    </td>
                  ))
              }

            </tr>
          ))
          : <p>Loading</p>
      }
      </tbody>
    </table>
  );
}

DataTableWithHandlers.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  indexField: PropTypes.string.isRequired,
  handlers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

DataTableWithHandlers.defaultProps = {
  className: '',
};

export default DataTableWithHandlers;
