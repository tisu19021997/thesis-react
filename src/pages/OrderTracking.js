import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import Section from '../components/Section';
import { Desktop, Mobile } from '../helper/mediaQuery';
import Product from '../components/Product';

function OrderTracking(props) {
  const { user } = props;

  const [errorMessage, setErrorMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`/transactions/${user}`)
      .then((res) => {
        setTransactions(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [user]);

  const cancelTransaction = async (event) => {
    if (window.confirm('Do you really want to cancel this transaction?')) {
      const { value: transactionId } = event.target;

      try {
        await axios.delete(`/transactions/${transactionId}`);
        setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const transactionsDOM = transactions.map((transaction) => {
    const transactionProducts = transaction.products.map((item) => (
      <React.Fragment key={item._id}>
        <Desktop>
          <div key={item._id} className="o-layout__item u-1/4 u-mb-24">
            <Product product={item.product} useName={false} usePrice={false} overlay />
          </div>
        </Desktop>

        <Mobile>
          <Link
            key={item.product.asin}
            to={`/products/${item.product.asin}`}
            className="c-product u-p-4 u-pv-6"
          >
            <div className="o-media o-media--tiny">
              <img
                className="o-media__img c-product__img u-1/3"
                style={{ border: '1px solid #dfe1e5' }}
                src={item.product.imUrl}
                alt={item.product.title}
              />
              <div className="o-media__body">
                <div
                  className="u-txt-truncate-2 u-txt--light"
                >
                  {item.product.title}
                </div>
                <div className="c-price [ c-price--small ] ">
                  <div className="c-price__price">
                    <span className="c-price__currency">$</span>
                    {item.product.price}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </Mobile>
      </React.Fragment>
    ));

    const transactionSummary = transaction.products.map((item) => (
      <div
        key={item._id}
        className="c-table"
        style={{
          border: 'none',
          maxHeight: '340px',
          overflowY: 'auto',
        }}
      >
        <div
          key={item._id}
          className="c-table__row u-pv-0 u-mb-24 u-txt-16"
          style={{ backgroundColor: 'transparent' }}
        >
          <div
            className="c-table__row-col c-table__attr u-txt--normal"
            style={{ textTransform: 'uppercase' }}
          >
            {item.product.title}
          </div>

          <div className="c-table__row-col c-table__value u-txt-align-right">
            {`$${item.product.price} x ${item.quantity}`}
          </div>
        </div>
      </div>
    ));

    return (
      <React.Fragment key={transaction._id}>
        <Desktop>

          <div className="o-layout [ o-layout--flush ] u-mb-36 u-border--m-dark">
            <Section
              className="o-layout__item o-layout [ o-layout--small ] u-2/3"
              title={`Order ID: ${transaction._id} (${transaction.status})`}
              titleClass="u-txt-24"
              contentClass="u-mt-24"
            >
              {transactionProducts}
            </Section>

            <Section
              className="o-layout__item o-layout [ o-layout--flush ] u-1/3 u-border-all-blur"
              data="Order Summary"
              title="Order Summary"
              titleClass="u-txt-16 u-p-6 u-pv-24 u-border--m-blur"
              contentClass="u-mt-24 u-p-6"
            >
              {transactionSummary}
              <div className="u-txt-20 u-txt--light u-txt-align-right u-mt-24">
                Total:
                <span className="u-txt--bold">{` $${transaction.total.toFixed(2)}`}</span>
              </div>
            </Section>

            <button
              className="c-btn c-btn--secondary u-d-block u-mv-12 u-txt-16"
              type="button"
              value={transaction._id}
              onClick={cancelTransaction}
            >
              Cancel
            </button>
          </div>

        </Desktop>


        <Mobile>
          <div className="o-layout [ o-layout--flush ] u-mb-12 u-border--m-dark">
            <Section
              className="o-layout__item o-layout [ o-layout--flush ]"
              title={`Order "${transaction._id}"  - ${transaction.status}`}
              titleClass="u-txt-20 u-pv-12 u-border--m-blur"
              contentClass="u-mt-16"
            >
              <div className="c-product-grid c-product--grid">
                {transactionProducts}
              </div>
            </Section>

            {/* Order Summary */}
            <Section
              className="o-layout__item o-layout [ o-layout--flush ] u-border-all-blur"
              data="Order Summary"
              title="Order Summary"
              titleClass="u-txt-16 u-p-6 u-pv-24 u-border--m-blur"
              contentClass="u-mt-4 u-p-6"
            >

              <div
                className="c-table"
                style={{
                  border: 'none',
                  maxHeight: '340px',
                  overflowY: 'auto',
                }}
              >
                {transactionSummary}
              </div>

              <div className="u-txt-20 u-txt--light u-txt-align-right u-mt-24">
                Total:
                <span className="u-txt--bold">{` $${transaction.total.toFixed(2)}`}</span>
              </div>
            </Section>

            <button
              className="c-btn c-btn--secondary u-d-block u-mv-12 u-txt-16"
              type="button"
              value={transaction._id}
              onClick={cancelTransaction}
            >
              Cancel
            </button>
          </div>
        </Mobile>

      </React.Fragment>
    );
  });

  return (
    <Wrapper>
      {errorMessage}
      {isLoading
        ? ''
        : (
          // eslint-disable-next-line react/jsx-filename-extension
          <>
            {transactionsDOM}
          </>
        )}
    </Wrapper>
  );
}

OrderTracking.propTypes = {
  user: PropTypes.string.isRequired,
};

export default withRouter(OrderTracking);
