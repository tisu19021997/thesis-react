import React, { useState, useRef } from 'react';
import DatasetUploader from './DatasetUploader';
import Wrapper from '../../Wrapper';
import ModelTrainer from './ModelTrainer';
import Section from '../../Section';

function Recommender() {
  const [dataset, setDataset] = useState([]);

  return (
    <Wrapper>
      <Section
        title="RecLab"
        titleClass="u-txt-40"
        subTitle="Manage recommender system dataset, train and test model."
      >

        <DatasetUploader setDataset={setDataset} />

        <ModelTrainer dataset={dataset} />

      </Section>
    </Wrapper>
  );
}

export default Recommender;
