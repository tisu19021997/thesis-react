import React, { useState } from 'react';
import DatasetUploader from './DatasetUploader';
import Wrapper from '../../Wrapper';
import ModelTrainer from './ModelTrainer';
import Section from '../../Section';
import RecommendationGenerator from './RecommendationGenerator';
import RelatedProductsGenerator from './RelatedProductsGenerator';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

function Recommender() {
  const [dataset, setDataset] = useState([]);

  return (
    <Wrapper>
      <Section
        title="RecLab"
        titleClass="u-txt-40"
        contentClass="o-layout o-layout--flush"
        subTitle="Manage recommender system dataset, train and test model."
      >

        <Tabs className="c-tab u-mt-36 u-mb-24">
          <TabList className="c-tab__header u-border--m-blur">
            <Tab
              className="c-tab__header-name u-txt-22"
              selectedClassName="active"
            >
              Dataset
            </Tab>
            <Tab
              className="c-tab__header-name u-txt-22"
              selectedClassName="active"
            >
              Model
            </Tab>
            <Tab
              className="c-tab__header-name u-txt-22"
              selectedClassName="active"
            >
              Users Recommendation
            </Tab>
            <Tab
              className="c-tab__header-name u-txt-22"
              selectedClassName="active"
            >
              Related Products
            </Tab>
          </TabList>


          <div className="c-tab__content">

            <TabPanel className="c-tab__content-item u-txt--normal">
              <DatasetUploader setDataset={setDataset} />
            </TabPanel>

            <TabPanel className="c-tab__content-item u-txt--normal">
              <ModelTrainer dataset={dataset} />
            </TabPanel>

            <TabPanel className="c-tab__content-item u-txt--normal">
              <RecommendationGenerator />
            </TabPanel>

            <TabPanel className="c-tab__content-item u-txt--normal">
              <RelatedProductsGenerator />
            </TabPanel>

          </div>
        </Tabs>


      </Section>
    </Wrapper>
  );
}

export default Recommender;
