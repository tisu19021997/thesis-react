import React, { useState } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import ReactModal from 'react-modal';
import { useModal } from 'react-modal-hook';
import { Link } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import Section from '../components/Section';
import { UserContext } from '../context/user';
import { Desktop, Mobile } from '../helper/mediaQuery';
import { useInput } from '../helper/hooks';
import Product from '../components/Product';

function Checkout(props) {
  const {
    cart, updateCart, user, history,
  } = props;

  const [errorMessage, setErrorMessage] = useState('');
  const { state: name, bind: bindName } = useInput('');
  const { state: address, bind: bindAddress } = useInput('');
  const { state: email, bind: bindEmail } = useInput('');
  const { state: shippingMessage, bind: bindShippingMessage } = useInput('');
  // const { state: shippingMethod, bind: bindShippingMethod } = useInput('cod');
  // total value of cart
  let cartTotal = 0;

  const modalStyles = {
    content: {
      inset: '50% auto auto 50%',
      width: '40%',
      height: '25%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, .35)',
    },
  };

  const [showModal, hideModal] = useModal(() => (
    // eslint-disable-next-line react/jsx-filename-extension
    <>
      <Mobile>
        <ReactModal
          style={{
            content: {
              position: 'absolute',
              backgroundColor: 'rgba(255, 255, 255)',
              inset: '50% 0 0 50%',
              transform: 'translate(-50%, -50%)',
              width: '66.66667%',
              overflowY: 'auto',
              padding: '12px',
              maxHeight: '300px',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, .7)',
            },
          }}
          isOpen
        >
          <div className="u-txt-align-center">
            <h1>Thanks for shopping!</h1>
            <p>
              Your order is being processed by now. We have sent you a confirmation email, please
              check.
            </p>
            <button
              className="c-btn [ c-btn--rounded c-btn--primary ] u-ml-12 u-mb-12"
              type="button"
              onClick={() => {
                hideModal();

                // Clear cart (save cart history, maybe?)
                updateCart([]);
                history.push('/');
              }}
            >
              Confirm
            </button>
          </div>
        </ReactModal>
      </Mobile>

      <Desktop>
        <ReactModal
          style={modalStyles}
          isOpen
        >
          <div className="u-txt-align-center">
            <h1>Thanks for shopping!</h1>
            <p>
              Your order is being processed by now. We have sent you a confirmation email, please
              check.
            </p>
            <button
              className="c-btn [ c-btn--rounded c-btn--primary ] u-ml-12 u-mb-12"
              type="button"
              onClick={() => {
                hideModal();

                // Clear cart (save cart history, maybe?)
                updateCart([]);
                history.push('/');
              }}
            >
              Confirm
            </button>
          </div>
        </ReactModal>
      </Desktop>

    </>
  ));

  // Build products DOM while increasing the cart total value.
  const cartProducts = cart.map((item) => {
    cartTotal += parseFloat(item.product.price) * parseInt(item.quantity, 10);

    return (
      // eslint-disable-next-line react/jsx-filename-extension
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
    );
  });

  // TODO: Truncate up to 2 lines for product with long name.
  const orderSummary = cart.map((item) => (
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
  ));

  const checkOut = async (event) => {
    event.preventDefault();

    try {
      // Proceed checking out.
      await axios.post(`users/${user}/checkout`,
        {
          cart,
          name,
          address,
          email,
          shippingMessage,
        });

      const cartProducts = cart.map((item) => (
        {
          product: item.product._id,
          quantity: item.quantity,
        }
      ));

      // Keep track of the transaction.
      await axios.post(`transactions/${user}/`, {
        products: cartProducts,
        name,
        address,
        email,
        message: shippingMessage,
        total: cartTotal,
      });

      // Notify success, redirect to home page.
      showModal();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <UserContext.Consumer>
      {
        () => (
          <Wrapper>

            <Desktop>
              {/* Products Cart and Order Summary */}
              <div className="o-layout [ o-layout--flush ]">

                {/* Cart Items */}
                <Section
                  className="o-layout__item o-layout [ o-layout--small ] u-2/3"
                  data="Your Cart Items"
                  title="Your Cart Items"
                  titleClass="u-txt-24"
                  contentClass="u-mt-24"
                >
                  {cartProducts}
                </Section>

                {/* Order Summary */}
                <Section
                  className="o-layout__item o-layout [ o-layout--flush ] u-1/3 u-border-all-blur"
                  data="Order Summary"
                  title="Order Summary"
                  titleClass="u-txt-24 u-p-6 u-pv-24 u-border--m-blur"
                  contentClass="u-mt-24 u-p-6"
                >
                  <div
                    className="c-table"
                    style={{
                      border: 'none',
                      maxHeight: '340px',
                      overflowY: 'auto',
                    }}
                  >
                    {orderSummary}
                  </div>
                  <div className="u-txt-20 u-txt--light u-txt-align-right u-mt-24">
                    Total:
                    <span className="u-txt--bold">
                      {` $${cartTotal.toFixed(2)}`}
                    </span>
                  </div>
                </Section>

              </div>

              <form method="post" onSubmit={checkOut}>
                <Section
                  title="Shipping Information"
                >
                  <div className="u-mb-12 u-txt-12 u-txt--light">
                    <input
                      className="u-w--20 u-pv-12 u-mb-12 u-mr-12"
                      {...bindName}
                      type="text"
                      placeholder="Your full name"
                      required
                    />
                    <input
                      className="u-w--20 u-pv-12 u-mr-12"
                      {...bindAddress}
                      type="text"
                      placeholder="Your address"
                      required
                    />
                    <input
                      className="u-w--20 u-pv-12 u-mr-12"
                      {...bindEmail}
                      type="text"
                      placeholder="Your email"
                      required
                    />
                  </div>
                  <div className="u-mb-12 u-txt-12 u-txt--light">
                    <textarea
                      className="u-w--66 u-pv-12"
                      cols="8"
                      rows="4"
                      {...bindShippingMessage}
                      placeholder="Leave a message for shipper."
                    />
                  </div>
                </Section>

                {/* <Section title="Shipping Method"> */}
                {/* <span></span> */}
                {/* </Section> */}
                <span className="u-txt-14" style={{ color: 'red' }}>
                  {errorMessage}
                </span>

                <div className="u-mv-12 u-txt-12">
                  <button
                    className="c-btn [ c-btn--rounded c-btn--primary ] u-ml-12"
                    type="submit"
                  >
                    Confirm
                  </button>
                </div>
              </form>


            </Desktop>

            <Mobile>
              <div className="o-layout [ o-layout--flush ]">

                {/* Cart Items */}
                <Section
                  className="o-layout__item o-layout [ o-layout--small ]"
                  data="Your Cart Items"
                  title="Your Cart Items"
                  titleClass="u-txt-24 u-pv-12 u-border--m-blur"
                  contentClass="u-mt-16"
                >
                  <div className="c-product-grid c-product--grid">
                    {cartProducts}
                  </div>
                </Section>

                {/* Order Summary */}
                <Section
                  className="o-layout__item o-layout [ o-layout--flush ] u-border-all-blur"
                  data="Order Summary"
                  title="Order Summary"
                  titleClass="u-txt-24 u-p-6 u-pv-24 u-border--m-blur"
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
                    {orderSummary}
                  </div>
                  <div className="u-txt-20 u-txt--light u-txt-align-right u-mt-24">
                    Total:
                    <span className="u-txt--bold">
                      {` $${cartTotal.toFixed(2)}`}
                    </span>
                  </div>
                </Section>

                {/* Shipping Information */}
                <form
                  method="post"
                  onSubmit={checkOut}
                  className="o-layout__item o-layout [ o-layout--flush ]"
                >
                  <Section
                    data="Shipping Information"
                    title="Shipping Information"
                    titleClass="u-txt-24 u-p-6 u-pv-24 u-border--m-blur"
                    contentClass="u-mt-4 u-p-6"
                  >
                    <div className="u-mb-12 u-txt-12 u-txt--light">
                      <input
                        className="u-w--100 u-pv-12 u-mb-12 u-mr-12"
                        {...bindName}
                        type="text"
                        placeholder="Your full name"
                        required
                      />
                      <input
                        className="u-w--100 u-pv-12 u-mr-12 u-mb-12"
                        {...bindAddress}
                        type="text"
                        placeholder="Your address"
                        required
                      />
                      <input
                        className="u-w--100 u-pv-12 u-mr-12 u-mb-12"
                        {...bindEmail}
                        type="text"
                        placeholder="Your email"
                        required
                      />
                      <textarea
                        className="u-w--100 u-pv-12"
                        cols="8"
                        rows="4"
                        {...bindShippingMessage}
                        placeholder="Leave a message for shipper."
                      />
                    </div>
                    <div className="u-mv-12 u-txt-12">
                      <button
                        className="c-btn [ c-btn--rounded c-btn--primary ] u-ml-12 u-float-right"
                        type="submit"
                      >
                        Confirm
                      </button>
                    </div>
                  </Section>
                </form>


              </div>
            </Mobile>
          </Wrapper>
        )
      }
    </UserContext.Consumer>
  );
}

Checkout.propTypes = {
  cart: PropTypes.array.isRequired,
  updateCart: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  user: PropTypes.string.isRequired,
};

export default withRouter(Checkout);
