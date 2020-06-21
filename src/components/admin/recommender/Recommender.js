import React, { useState, useRef } from 'react';
import DatasetUploader from './DatasetUploader';
import Wrapper from '../../Wrapper';
import ModelTrainer from './ModelTrainer';

function Recommender() {
  const [dataset, setDataset] = useState([]);

  return (
    <Wrapper>
      <DatasetUploader setDataset={setDataset} />

      <ModelTrainer dataset={dataset} />
    </Wrapper>
  );
}

export default Recommender;
