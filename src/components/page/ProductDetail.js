import React from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from 'react-tabs';
import axios from 'axios';
import array from 'lodash/array';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { findIndex, sortBy } from 'lodash';
import local from '../../helper/localStorage';
import { toProductModel } from '../../helper/data';
import Wrapper from '../Wrapper';
import Section from '../Section';
import Breadcrumb from '../Breadcrumb';
import ProductZoom from '../ProductZoom';
import Bundle from '../Bundle';
import ProductSlider from '../slider/ProductSlider';
import PrevArrow from '../slider/PrevArrow';
import NextArrow from '../slider/NextArrow';
import { UserContext } from '../../context/user';
import { Desktop, Mobile } from '../../helper/mediaQuery';
import Rating from '../Rating';
import ReadMore from '../ReadMore';

class ProductDetail extends React.Component {
  /**
   * Update user history handler:
   * == 1. Check user logged-in status:
   * ==== a. Logged-in: make a PUT request to update the database
   * ==== b. Guess user: Save history to localStorage
   *
   * @param {object} product
   * @param  {string} user
   * @param {string} token
   * @returns {boolean}
   */
  static saveHistory(token, product, user = local.get('user') || '') {
    if (user) {
      axios.patch(`/users/${user}/history`, product)
        .then(() => true)
        .catch((error) => {
          throw new Error(error.message);
        });
    } else {
      let localHistory = local.get('history') || [];
      const historyModel = {
        product,
        time: Date.now(),
      };

      if (findIndex(localHistory, (o) => o.product.asin === product.asin) !== -1) {
        // if the item is already in history, re-order it to the first position
        localHistory = sortBy(localHistory, (item) => item.product._id.toString() !== product._id);
      } else {
        localHistory = [historyModel, ...localHistory];
      }

      local.save('history', localHistory);
    }

    return true;
  }

  constructor(props) {
    super(props);

    this.state = {
      product: {},
      alsoBought: {},
      alsoViewed: {},
      bundleProducts: {},
      sameCategory: {},
      sameBrand: {},
      ready: false,
      quantity: 1,
    };

    this.purchaseHandle = this.purchaseHandle.bind(this);
    this.purchaseAndCheckOutHandle = this.purchaseAndCheckOutHandle.bind(this);
    this.purchaseAllHandle = this.purchaseAllHandle.bind(this);

    this.historyTracking = this.historyTracking.bind(this);
    this.pageInit = this.pageInit.bind(this);

    this.onChangeHandle = this.onChangeHandle.bind(this);
  }

  componentDidMount() {
    this.pageInit();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match } = this.props;
    const { params } = match;

    if (prevProps.match.params.asin !== params.asin) {
      this.pageInit();
    }
  }

  onChangeHandle(event) {
    const { target } = event;
    const { name, value } = target;

    this.setState({
      [name]: value,
    });
  }

  historyTracking() {
    const { product } = this.state;
    const { token } = this.context;
    return this.constructor.saveHistory(token, product);
  }

  /**
   * Handle purchase event:
   * == 1. Check user log-in status
   * == 2.
   * ==== a. Logged-in: Send PUT request to update database
   * ==== b. Guess user: Update the cart in localStorage
   * == 3. Update state of parent component
   */
  purchaseHandle() {
    const { product, quantity } = this.state;
    const { currentUser } = this.context;
    const { updateCart, loggedIn } = this.props;
    const productModel = toProductModel(product);

    if (loggedIn) {
      axios.patch(`/users/${currentUser}/cart`, {
        cartProducts: product,
        quantity,
        single: true,
      })
        .then((res) => {
          // TODO: Get the successful message and display it to UI
          updateCart(res.data);
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } else {
      // get the cart from localStorage
      let localCart = local.get('cart') || [];
      const productIndex = array.findIndex(localCart, (o) => o.product.asin === product.asin);

      // if the cart exists and the product is already in cart
      // update the quantity only
      if (productIndex !== -1) {
        localCart[productIndex].quantity += 1;
      } else {
        localCart = [...localCart, productModel];
      }

      // save the cart to localStorage and update state
      local.save('cart', localCart);
      updateCart(localCart);
    }
  }

  async purchaseAndCheckOutHandle() {
    const { history } = this.props;
    await this.purchaseHandle();
    history.push('/checkout');
  }

  /**
   * Handle bundle purchase event:
   * == 1. Check user log-in status
   * == 2.
   * ==== a. Logged-in: Send PUT request to update database
   * ==== b. Guess user: Update the cart in localStorage
   * == 3. Update state of parent component
   */
  purchaseAllHandle(products) {
    const { currentUser } = this.context;
    const { loggedIn, onBundlePurchase } = this.props;

    if (loggedIn) {
      axios.patch(`/users/${currentUser}/cart`, {
        cartProducts: products,
        single: false,
      })
        .then((res) => {
          onBundlePurchase(res.data);
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } else {
      let localCart = local.get('cart') || [];

      // loop through each product of the bundle
      products.map((product) => {
        const productModel = toProductModel(product);
        const productIndex = array.findIndex(localCart, (o) => o.product.asin === product.asin);

        if (productIndex !== -1) {
          localCart[productIndex].quantity += 1;
        } else {
          localCart = [...localCart, productModel];
        }
        return true;
      });

      local.save('cart', localCart);
      onBundlePurchase(localCart);
    }
  }

  /**
   * Initialize Product Page:
   * == 1. Send request to server to fetch data
   * == 2. Set the initial state
   * == 3. Update user browsing product's history
   */
  pageInit() {
    const { match } = this.props;
    const { params } = match;

    // send GET request to server to get necessary data
    axios.get(`/products/${params.asin}`)
      .then((res) => {
        const {
          product, alsoBought, alsoViewed, alsoRated, bundleProducts, sameCategory, sameBrand,
        } = res.data;

        // set initial state
        this.setState({
          product,
          alsoBought,
          alsoViewed,
          alsoRated,
          bundleProducts,
          sameCategory,
          sameBrand,
          ready: true,
        });
        // update the user history
        this.historyTracking();
      })
      .catch((error) => {
        // TODO: Eror 404 Page.
        throw new Error(error.message);
      });
  }

  render() {
    const { ready } = this.state;

    // stop the rendering if data has not been fetched yet
    if (!ready) {
      return false;
    }

    const {
      product,
      bundleProducts,
      alsoBought,
      alsoViewed,
      sameCategory,
      sameBrand,
      alsoRated,
    } = this.state;

    const { categories } = product;

    const sliderSettings = {
      slidesToShow: 6,
      slidesToScroll: 6,
      arrows: true,
      infinite: false,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
    };

    const sliderMobileSettings = {
      slidesToShow: 2.5,
      slidesToScroll: 3,
      infinite: false,
      lazyLoad: 'ondemand',
      dots: false,
      arrows: false,
    };

    const bundleIds = bundleProducts.products.map((bundleProduct) => bundleProduct._id);

    // exclude the current product from the recommended products
    // alsoRated = alsoRated.filter((item) => item.asin !== product.asin);

    const sliders = [
      {
        products: alsoViewed,
        title: 'Customers who viewed this product also viewed',
      },
      {
        products: alsoBought,
        title: 'Customers who bought this product also bought',
      },
      {
        products: alsoRated,
        title: 'Related to this product',
      },
      {
        products: sameCategory,
        title: 'From the same category',
      },
    ];

    const sliderDOM = sliders.map((slider) => (slider.products.length ? (
      <React.Fragment key={slider.title}>
        <Desktop>
          <Section
            data={slider.title}
            title={slider.title}
            titleClass="c-section__title--no-margin"
          >

            <ProductSlider
              products={slider.products}
              settings={sliderSettings}
              className="c-slider--tiny-gut u-ph-48"
            />
          </Section>
        </Desktop>

        <Mobile>
          <Section
            title={slider.title}
            className="c-section--splitted"
          >
            <ProductSlider
              products={slider.products}
              settings={sliderMobileSettings}
              className="c-slider--tiny-gut"
            />

          </Section>
          <hr className="thick" />
        </Mobile>
      </React.Fragment>

    ) : ''));

    return (
      <UserContext.Consumer>
        {
          ({ currentUser }) => (
            <>
              <Desktop>
                <Wrapper className="u-ph-0">


                  <main>

                    {/* #PRODUCT PREVIEW */}
                    <Section className="c-section" data="Product Preview">

                      {/* #BREADCRUMB */}
                      {
                        categories.length > 0
                          ? (<Breadcrumb breadcrumbItems={categories} />)
                          : ''
                      }

                      {/* /BREADCRUMB */}


                      {/* #PRODUCT VIEW BLOCK */}
                      <div className="o-layout [ o-layout--small ]">

                        {/* #PRODUCT IMAGE ZOOM */}
                        <section
                          className="o-layout__item u-3/10 u-margin-top"
                          data-section="Product Images"
                        >
                          <ProductZoom
                            // array of imUrl for demo-ing, need to change
                            productImages={[
                              product.imUrl,
                              product.imUrl,
                              product.imUrl,
                            ]}
                          />
                        </section>
                        {/* /PRODUCT IMAGE ZOOM */}


                        {/* #PRODUCT DETAIL */}
                        <section
                          className="o-layout__item u-4/10 u-push-1/20"
                          data-section="Product Detail"
                        >

                          <div
                            className="[ u-txt--title u-txt--dark u-txt--bold ] u-margin-bottom-small"
                          >
                            {product.title}
                          </div>

                          <div className="u-margin-top-small u-margin-bottom-tiny u-cf">

                            <span className="[ u-txt--tiny ]">
                    Brand:
                              <span
                                className="[ u-txt--bright u-txt--xbold ]"
                              >
                                {product.brand}
                              </span>
                            </span>

                            <div className="[ u-float-right u-d-flex u-fd--column ]">
                              <span className="[ u-txt--tiny u-txt--light ]">12,345 ratings</span>
                            </div>

                            {/* #INFORMATION PRODUCT */}
                            <Section className="u-cf" data="Product Information">
                              <ul className="[ u-txt-12 u-margin-bottom-none u-margin-left-small ]">
                                <li>
                                  <span>
                                    <ReadMore text={product.description} />
                                  </span>
                                </li>
                              </ul>
                            </Section>
                            {/* /Product information */}

                          </div>

                        </section>
                        {/* /Product Detail */}


                        {/* #CTA */}
                        <section
                          className="o-layout__item u-2/10 u-push-1/10"
                          data-section="Call to Action"
                        >

                          <div className="o-list-inline">
                            {product.discountPrice
                              ? (
                                <>
                                  <div className="o-list-inline__item t-price u-txt--larger">

                                    <span className="u-txt-16">$</span>
                                    {product.discountPrice}

                                  </div>
                                  <div
                                    className="o-list-inline__item t-price--before u-txt-linethrough  u-txt--light"
                                  >
                                    <span className="u-txt-12">$</span>
                                    {product.price}
                                  </div>
                                </>
                              )

                              : (
                                <div className="o-list-inline__item t-price u-txt--larger">
                                  <span className="u-txt-16">$</span>
                                  {product.price}

                                </div>
                              )}
                          </div>


                          <div className="c-option [ c-option--control ] u-margin-top-small">
                            <div className="c-option__board">
                              <label className="u-txt--blur u-txt-12 u-mr-6">Quantity: </label>
                              <input
                                className="js-option-screen"
                                onChange={(event) => {
                                  const { target } = event;
                                  this.setState({
                                    quantity: target.value,
                                  });
                                }}
                                id="qty"
                                type="number"
                                min={1}
                                defaultValue={1}
                              />
                            </div>
                          </div>


                          {/* #CTA-BUTTONS */}
                          <div className="u-d-flex u-fd--column u-margin-top u-margin-bottom-large">
                            <button
                              onClick={this.purchaseAndCheckOutHandle}
                              className="c-btn [ c-btn--cta c-btn--rounded c-btn--type-large ] u-flex-1 u-margin-bottom-small"
                              type="button"
                              title="Buy Now"
                            >
                              Buy Now
                            </button>
                            <button
                              onClick={this.purchaseHandle}
                              className="c-btn [ c-btn--primary c-btn--rounded c-btn--type-large ] u-flex-1"
                              type="button"
                              title="Add to Cart"
                            >
                              Add to Cart
                            </button>
                          </div>
                          {/* #CTA-BUTTONS */}


                          {/* #SAME BRAND */}

                          {
                            sameBrand.length > 0
                              ? (
                                <Section className="c-section" data="Same Brand Products">
                                  <div className="c-section__title [ c-section__title--no-margin ]">
                                    From the same brand
                                  </div>
                                  <ul className="o-list-bare">
                                    {
                                      sameBrand.map((p) => (
                                        <Link
                                          to={`/products/${p.asin}`}
                                          key={p.asin}
                                          className="o-media c-product [ c-product--secondary ]"
                                        >
                                          <img
                                            src={p.imUrl}
                                            className="o-media__img c-product__img u-w--30 u-mr-6 u-border-all-blur"
                                            alt="Product 1"
                                          />
                                          <div className="o-media__body">
                                            <div className="c-product__name u-txt--bold">
                                              {p.title}
                                            </div>
                                            <div className="c-price [ c-price--small ] ">
                                              <div className="c-price__price">
                                                <span className="c-price__currency">$</span>
                                                {p.discountPrice || p.price}
                                              </div>
                                              {p.discountPrice
                                                ? (
                                                  <div className="c-price__price--secondary">
                                                    <span className="c-price__currency">$</span>
                                                    {p.price}
                                                  </div>
                                                )
                                                : ''}
                                            </div>
                                          </div>
                                        </Link>
                                      ))
                                    }
                                  </ul>
                                </Section>
                              )
                              : ''
                          }
                          {/* /Same brand */}


                        </section>
                        {/* /CTA */}


                      </div>
                      {/* /PRODUCT VIEW BLOCK */}


                    </Section>
                    {/* #PRODUCT PREVIEW */}


                    <hr />


                    {/* #BUNDLE PRODUCT */}
                    {bundleProducts.products.length > 0
                      ? (
                        <Section
                          className="u-6/10"
                          title="Usually Bought Together"
                          titleClass="c-section__title--no-margin"
                        >

                          <Bundle
                            bundleProducts={[product, ...bundleProducts.products]}
                            bundleProductIds={[product._id, ...bundleIds]}
                            currentProduct={product}
                            totalPrice={bundleProducts.totalPrice}
                            purchaseAll={this.purchaseAllHandle}
                            user={currentUser}
                          />

                          <hr />
                        </Section>
                      )
                      : ''}
                    {/* /BUNDLE PRODUCT */}


                    {/* #TABS */}
                    <Tabs className="c-tab u-mt-36 u-mb-24">
                      <TabList className="c-tab__header u-border--m-blur">
                        <Tab
                          className="c-tab__header-name u-txt-14"
                          selectedClassName="active"
                        >
                          Description
                        </Tab>
                        <Tab
                          className="c-tab__header-name u-txt-14"
                          selectedClassName="active"
                        >
                          Customer Reviews
                        </Tab>
                      </TabList>


                      <div className="c-tab__content">

                        <TabPanel className="c-tab__content-item u-txt--normal u-txt-14 u-2/3">
                          {product.description}
                        </TabPanel>


                        <TabPanel className="c-tab__content-item u-txt-14 u-w--80">

                          <Rating asin={product.asin} user={currentUser} productId={product._id} />

                          <hr />

                        </TabPanel>

                      </div>
                    </Tabs>
                    {/* /TABS */}

                    {/* Products Slider from Different Categories */}
                    {sliderDOM}

                  </main>
                </Wrapper>
              </Desktop>


              <Mobile>
                <Wrapper className="o-wrapper--flush">

                  <main>

                    {/* #PREVIEW PRODUCT */}
                    <Section className="c-section--splitted">


                      {/* #BREADCRUMB */}
                      <Breadcrumb breadcrumbItems={categories} className="u-ml-6 u-mt-6" />
                      {/* /Breadcrumb */}


                      <div className="c-section__title">
                        {product.title}
                      </div>


                      {/* #PRODUCT ZOOM */}
                      <Slider
                        className="u-mb-6"
                        settings={{
                          slidesToShow: 1,
                          arrows: false,
                          dots: true,
                          lazyLoad: 'ondemand',
                        }}
                      >
                        <div className="c-product">
                          <img
                            className="c-product__img"
                            src={product.imUrl}
                            alt={product.title}
                            style={{ margin: '0 auto' }}
                          />
                        </div>
                        <div className="c-product">
                          <img
                            className="c-product__img"
                            src={product.imUrl}
                            alt={product.title}
                            style={{ margin: '0 auto' }}
                          />
                        </div>

                      </Slider>
                      {/* /Product Zoom */}


                    </Section>
                    {/* /Preview Product */}


                    {/* #PRODUCT OPTIONS */}
                    <Section
                      className="c-section--splitted"
                      data="Product Options"
                    >

                      {/* #QUANTITY CONTROL */}
                      <div className="c-option [ c-option--control ] u-ml-6">
                        <label htmlFor="qty" className="c-option__detail">Quantity:</label>
                        <div className="c-option__board">
                          <input
                            className="js-option-screen"
                            onChange={(event) => {
                              const { target } = event;
                              this.setState({
                                quantity: target.value,
                              });
                            }}
                            id="qty"
                            type="number"
                            min={1}
                            defaultValue={1}
                          />
                        </div>
                      </div>
                      {/* /Quantity Control */}


                      <hr />


                      {/* #CTA BUTTON */}
                      <div className="o-layout u-mh-6 o-layout--tiny">


                        <div>

                          {/* #PRODUCT PRICE */}
                          <div className="o-layout__item u-1/2 u-mb-12">
                            <span className="c-price [ c-price--huge ]">
                              <span className="c-price__price">
                                <span className="c-price__currency">$</span>
                                {product.price}
                              </span>
                            </span>
                          </div>
                          {/* /Product Price */}


                          {/* #BUTTON */}
                          <div className="o-layout__item u-1/2 js-fixed-bottom">
                            <button
                              onClick={this.purchaseHandle}
                              className="c-btn [ c-btn--rounded c-btn--primary ] u-w--100 u-mb-12"
                              type="button"
                              title="Add to Cart"
                            >
                              Add to Cart
                            </button>

                            <button
                              onClick={this.purchaseAndCheckOutHandle}
                              className="c-btn [ c-btn--rounded c-btn--cta ] u-w--100"
                              type="submit"
                              title="Buy Now"
                            >
                              Buy Now
                            </button>
                          </div>
                          {/* /Button */}


                        </div>


                      </div>

                      {/* /CTA BUTTON */}

                    </Section>

                    {/* /Product Options */}


                    {bundleProducts.products.length > 0
                      ? (
                        <>
                          <hr className="thick" />

                          <Section
                            className="c-section--splitted"
                            data="Product Bundle"
                            title="Usually Bought Together"
                          >
                            <Bundle
                              bundleProducts={[product, ...bundleProducts.products]}
                              bundleProductIds={[product._id, ...bundleIds]}
                              currentProduct={product}
                              totalPrice={bundleProducts.totalPrice}
                              purchaseAll={this.purchaseAllHandle}
                              user={currentUser}
                            />
                          </Section>
                        </>
                      )
                      : ''}

                    <hr className="thick" />

                    {/* Products Slider from Different Categories */}
                    {sliderDOM}

                  </main>
                </Wrapper>
              </Mobile>
            </>
          )
        }
      </UserContext.Consumer>
    );
  }
}

ProductDetail.contextType = UserContext;

ProductDetail.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  currentUser: PropTypes.string.isRequired,
  updateCart: PropTypes.func.isRequired,
  onBundlePurchase: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default ProductDetail;
