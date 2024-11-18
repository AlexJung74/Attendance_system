// src/components/Shared/Form.jsx

import PropTypes from 'prop-types';

function Form({ fields, onSubmit, onCancel, submitLabel = 'Submit', cancelLabel = 'Cancel', isEditing }) {
  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    fields[fieldName].onChange(value);
  };

  return (
    <form onSubmit={onSubmit}>
      {Object.entries(fields).map(([fieldName, fieldProps]) => (
        <div className="mb-3" key={fieldName}>
          <label htmlFor={fieldName} className="form-label">
            {fieldProps.label}
          </label>
          <input
            type={fieldProps.type || 'text'}
            id={fieldName}
            name={fieldName}
            value={fieldProps.value}
            onChange={(e) => handleChange(e, fieldName)}
            className="form-control"
            required={fieldProps.required}
          />
        </div>
      ))}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
            {cancelLabel}
          </button>
        )}
      </div>
    </form>
  );
}

Form.propTypes = {
  fields: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      onChange: PropTypes.func.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  isEditing: PropTypes.bool,
};

export default Form;
