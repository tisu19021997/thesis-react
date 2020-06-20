import React, { useState, useRef } from 'react';
import UploadDataset from './UploadDataset';
import Wrapper from '../../Wrapper';

function Recommender(props) {
  return (
    <Wrapper>
      <UploadDataset />
    </Wrapper>
  );
}

export default Recommender;
