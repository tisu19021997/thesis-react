import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as FileSaver from 'file-saver';
import Section from '../../Section';
import { modelsConfig } from '../../../helper/constant';
import { useInput } from '../../../helper/hooks';

function ModelTrainer(props) {
  const { state: model, bind: bindModel } = useInput('insvd');
  const { state: trainType, bind: bindTrainType } = useInput('full');
  const { state: datasetType, bind: bindDatasetType } = useInput('server');

  const [paramsConfig, setParamsConfig] = useState(modelsConfig[model].params);
  const [modelParams, setModelParams] = useState({});
  const [saveOnServer, setSaveOnServer] = useState(false);
  const [saveOnLocal, setSaveOnLocal] = useState(false);
  const [trainBtnDisabled, setTrainBtnDisabled] = useState(false);

  const { dataset } = props;

  const handleParamsChange = (event) => {
    if (Object.keys(modelParams).length === 0) {
      setModelParams({ [event.target.name]: event.target.value });
    } else {
      const temp = { ...modelParams };
      temp[event.target.name] = event.target.value;
      setModelParams(temp);
    }
    return true;
  };

  const train = async () => {
    setTrainBtnDisabled(true);

    // If a param is not set, set it to default value.
    const modelDefaults = {};

    modelsConfig[model].params.map(
      (param) => {
        modelDefaults[param.name] = modelParams[param.name] || param.default;
      },
    );

    axios.post('/recommender/models', {
      model,
      params: modelDefaults,
      trainType,
      dataset: datasetType === 'local' ? dataset : [],
      saveOnServer,
      saveOnLocal,
    })
      .then(async (res) => {
        // TODO: Fix wrong file saving
        if (saveOnLocal) {
          const { data: trainedModel } = res;
          const filename = 'model';
          const file = new File([trainedModel], filename, { type: 'text/plain' });
          FileSaver.saveAs(file);
        }

        setTrainBtnDisabled(false);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    // Update parameters corresponding to the model.
    setParamsConfig(modelsConfig[model].params);
    // Reset model params.
    setModelParams({});
  }, [model]);

  return (
    <Section title="Train Your Model" className="o-layout__item">
      <div className="u-mb-12 u-d-flex">

        <div className="u-d-flex u-fd--column u-mr-24">
          <span className="u-txt--light">Select algorithm: </span>
          <select
            defaultValue={model}
            {...bindModel}
          >
            {Object.keys(modelsConfig)
              .map((modelId) => (
                <option
                  key={modelId}
                  value={modelId}
                >
                  {modelsConfig[modelId].name}
                </option>
              ))}
          </select>
        </div>

        <div className="u-d-flex u-fd--column u-mr-24">
          <span className="u-txt--light">Training Type: </span>
          <select
            defaultValue={trainType}
            {...bindTrainType}
          >
            <option value="full">Full Trainset</option>
            <option value="82">80:20</option>
          </select>
        </div>

        <div className="u-d-flex u-fd--column">
          <span className="u-txt--light">Dataset: </span>
          <select
            defaultValue={datasetType}
            {...bindDatasetType}
          >
            <option value="server">On server</option>
            <option value="local" disabled={dataset.length === 0}>Just uploaded</option>
          </select>
        </div>

      </div>

      <div className="u-mb-12 u-d-flex">
        {paramsConfig.map((param) => (
          <div key={param.name} className="u-d-flex u-fd--column">
            <span className="u-txt--light">{param.label}</span>
            <input
              name={param.name}
              className="u-w--50"
              type={param.type}
              defaultValue={param.default}
              placeholder={param.label}
              onChange={handleParamsChange}
            />
          </div>
        ))}

      </div>

      <div className="u-mt-24 u-mb-6">
        <input
          type="checkbox"
          name="save"
          defaultChecked={(value) => value === saveOnServer}
          onChange={(event) => setSaveOnServer(event.target.checked)}
        />
        <label htmlFor="save">
          Save model to server
          <span
            style={{ color: 'red' }}
          >
             (*CAUTION: This will overrides the last trained model)
          </span>
        </label>
      </div>

      <div className="u-mb-6">
        <input
          type="checkbox"
          name="save"
          defaultChecked={(value) => value === saveOnLocal}
          onChange={(event) => setSaveOnLocal(event.target.checked)}
        />
        <label htmlFor="save">
          Save model to your computer.
        </label>
      </div>

      <button
        disabled={trainBtnDisabled}
        className="c-btn c-btn--primary c-btn--rounded u-ml-6"
        onClick={train}
      >
        {trainBtnDisabled ? 'Training...' : 'Train Model'}
      </button>

    </Section>
  );
}

export default ModelTrainer;
