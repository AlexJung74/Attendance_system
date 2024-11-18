// src/components/shared/Table.jsx

import PropTypes from 'prop-types';

function Table({ headers, data = [], actions }) {
  if (!Array.isArray(data)) data = []; // Ensure data is an array

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
          {actions && actions.length > 0 && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
              {actions && (
                <td>
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className={`btn btn-${action.type || 'primary'} btn-sm`}
                      onClick={() => action.onClick(row)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length + (actions ? 1 : 0)} className="text-center">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    })
  ),
};

export default Table;
