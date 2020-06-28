import React from 'react';
import PropTypes from 'prop-types';

function InputsFromConfig(props) {
  const { configs, onChange } = props;

  const inputs = configs.map((config) => {
    switch (config.type) {
      case 'radio':
        return (
          <div className="u-mb-12" key={config.name}>
            {`${config.label}: `}
            {config.choices.map((choice) => (
              <label key={choice.value} htmlFor={config.name}>
                {choice.label}
                <input
                  className={config.className}
                  name={config.name}
                  type="radio"
                  defaultChecked={choice.value === config.defaultValue}
                  value={choice.value}
                  onChange={onChange}
                />
              </label>
            ))}

          </div>
        );
      default:
        return (
          <div className="u-mb-12" key={config.name}>
            <label htmlFor={config.name}>
              {`${config.label}: `}
              <input
                className={config.className}
                name={config.name}
                type={config.type}
                placeholder={config.placeHolder}
                defaultValue={config.defaultValue}
                onChange={onChange}
              />
            </label>
          </div>
        );
    }
  });

  return (
    inputs
  );
}

InputsFromConfig.propTypes = {
  configs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default InputsFromConfig;
