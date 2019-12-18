import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import axios from 'axios';
import local from '../helper/localStorage';
import { UserContext } from '../context/user';
import { Mobile, Desktop } from '../helper/mediaQuery';

// bind modal to root, see http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement('#root');

const modalStyles = {
  content: {
    inset: '50% auto auto 50%',
    width: '55%',
    height: '45%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, .35)',
  },
};


class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      isLoginModalOpen: false,
      isMenuOpen: false,
      isCartOpen: false,
      cartCounter: 0,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.openCart = this.openCart.bind(this);
    this.openCartMobile = this.openCartMobile.bind(this);
    this.closeCart = this.closeCart.bind(this);
    this.deleteCartItem = this.deleteCartItem.bind(this);
    this.productQtyHandle = this.productQtyHandle.bind(this);


    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

    this.searchProduct = this.searchProduct.bind(this);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    axios.get('/categories')
      .then((res) => {
        const { categories } = res.data;

        this.setState({
          categories,
        });
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    this.updateCartHandle();
  }

  /**
   * Update the cart every time changes happen:
   * == 1. Check user log-in status
   * == 2.
   * ==== a. Logged-in: send GET request to server to get the up-to-date cart
   * ==== b. Guess user: get the cart from the localStorage
   * == 3. Update state
   */
  updateCartHandle() {
    const { currentUser } = this.context;
    const { updateCart } = this.props;

    // if the user is logged-in, get the cart object from server
    if (currentUser) {
      axios.get(`/users/${currentUser}/cart`)
        .then((res) => {
          const { cart } = res.data;
          // send cart object back to App
          updateCart(cart);
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } else {
      // get the cart from local storage (if there is any)
      const cart = local.get('cart');

      if (cart) {
        updateCart(cart);
      }
    }
  }

  /**
   * Handle remove a product in cart:
   * == 1. Create a new cart that doesn't include item that need to be deleted
   * == 2. Check user log-in status
   * ==== a. Logged-in: Make a PUT request to server to replace old cart with new one
   * ==== b. Guess user: Replace old cart in localStorage with new one
   * == 3. Update the cart state using updateCart method
   *
   * @param event
   */
  deleteCartItem(event) {
    const { cart, updateCart, currentUser } = this.props;
    const productAsin = event.currentTarget.getAttribute('data-product');
    // filter the product that we need to delete from the current cart
    const newCart = cart.filter((item) => (item.product.asin !== productAsin));

    // send request to server to update the database
    if (currentUser) {
      axios.patch(`/users/${currentUser}/cart`, {
        action: 'delete',
        cart: newCart,
      })
        .then((res) => {
          // TODO: implement the front-end message when successfully delete the item
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } else {
      local.save('cart', newCart);
    }

    return updateCart(newCart);
  }

  productQtyHandle(event) {
    const { currentUser, updateCart } = this.props;

    const product = JSON.parse(event.currentTarget.getAttribute('data-product'));
    const incOrDesc = event.currentTarget.getAttribute('data-action');

    // bail if exceed the limit quantity
    if (product.quantity === 1 && incOrDesc === 'desc') {
      return false;
    }

    product.quantity = incOrDesc === 'inc' ? product.quantity + 1 : product.quantity - 1;

    if (currentUser) {
      axios.patch(`/users/${currentUser}/cart/products/${product._id}/quantity`, { quantity: product.quantity })
        .then((res) => updateCart(res.data))
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      // save to local storage
    }
  }

  /**
   * As its name, handle input changes:
   * == 1. Get the value from the input field
   * == 2. Set state with the format [input's name] = input's value
   */
  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  }

  /**
   * Handle user log-in form submit event:
   * == 1. Check if both password and username is not empty
   * == 2. Send POST request to server to authenticate
   * == 3. Call parent handler to update state
   *
   * @param event
   * @returns {boolean}
   */
  login(event) {
    event.preventDefault();

    const { usernameLogin, passwordLogin } = this.state;
    const { login, updateCart } = this.props;

    if (usernameLogin && passwordLogin) {
      axios.post('/login', {
        username: usernameLogin,
        password: passwordLogin,
      })
        .then((res) => {
          const { data } = res;
          const { status } = data;

          // login failed
          if (status === 404) {
            return false;
          }

          // login success
          const { user, token } = data;
          login(user.username, token);

          // close the modal
          this.closeModal();


          // update the cart
          if (user.products) {
            updateCart(user.products);
          }

          return true;
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    }

    return false;
  }

  /**
   * Handle user log-out event:
   * == 1. Check if there is a cart in localStorage
   * == 2.
   * ==== a. Yes: update the cart using localStorage
   * ==== b. No: create empty cart
   * == 3. Call parent handler to update cart
   */
  logout() {
    const { logout, updateCart } = this.props;
    const cart = local.get('cart') || [];

    // call to the parent logout method
    logout();

    return updateCart(cart);
  }

  /**
   * Handle user register event:
   * == 1. Check if the username and the password is empty
   * == 2. Send POST request to server to create new user
   */
  register(event) {
    event.preventDefault();

    const { usernameRegister, passwordRegister } = this.state;

    if (usernameRegister && passwordRegister) {
      axios.post('/users/register', {
        username: usernameRegister,
        password: passwordRegister,
      })
        .then(() => true)
        .catch((error) => {
          throw new Error(error.message);
        });
    }

    return false;
  }

  /**
   * Modal handler(s)
   */
  openModal(event) {
    event.preventDefault();
    this.setState({
      isLoginModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      isLoginModalOpen: false,
    });
  }

  openMenu() {
    this.setState({
      isMenuOpen: true,
    });
  }

  closeMenu() {
    this.setState({
      isMenuOpen: false,
    });
  }

  openCart() {
    const { isCartOpen } = this.state;

    this.setState({
      isCartOpen: !isCartOpen,
    });
  }

  openCartMobile() {
    this.setState({
      isCartOpen: true,
    });
  }

  closeCart() {
    this.setState({
      isCartOpen: false,
    });
  }

  searchProduct(event) {
    event.preventDefault();

    const { keyword } = this.state;
    const { history } = this.props;

    if (!keyword) {
      return false;
    }

    return history.push(`/products/search?s=${keyword}`);
  }

  render() {
    const {
      categories, isLoginModalOpen, isCartOpen, isMenuOpen,
    } = this.state;
    const { cart } = this.props;
    let { cartCounter } = this.state;

    const categoriesItem = categories.map((category, index) => (
      <React.Fragment key={index.toString()}>
        <Desktop>
          <li
            className="o-carousel__item c-cat-list__item u-txt-align-center"
            key={index.toString()}
          >
            <Link
              to={`/categories/${category._id}`}
              className="c-cat-list__item-detail"
            >
              <FontAwesomeIcon icon={category.iconClass} className="large" size="lg" />
              {category.name}
            </Link>
          </li>
        </Desktop>

        <Mobile>
          <li className="o-col__item">
            <Link
              to={`/categories/${category._id}`}
              className=" u-txt-14"
            >
              {category.name}
            </Link>
          </li>

        </Mobile>

      </React.Fragment>
    ));

    const categoryList = (
      <section className="c-section" data-section="Category List">
        <div className="c-cat-list c-cat-list--horizontal c-cat-list--dark">
          <ul className="o-carousel o-carousel--8col o-carousel--small u-mb-0">
            {categoriesItem}
          </ul>
        </div>
      </section>
    );


    const cartProductList = cart.map((item, index) => {
      cartCounter += item.quantity;

      return (
        <div
          key={index.toString()}
          className="cart-product o-layout o-layout--flush u-d-flex u-ai--center u-pv-12"
        >

          <div
            className="cart-counter o-layout__item u-txt-12 u-1/6 u-txt-align-center u-txt-underline"
          >
            <button
              onClick={this.productQtyHandle}
              data-product={JSON.stringify(item)}
              data-action="desc"
              type="button"
              className="c-btn--fake u-txt-16"
            >
              -
            </button>
            <span className="u-ph-6">{item.quantity}</span>
            <button
              onClick={this.productQtyHandle}
              data-product={JSON.stringify(item)}
              data-action="inc"
              type="button"
              className="c-btn--fake u-txt-16"
            >
              +
            </button>
          </div>

          <div
            className="cart-product__name o-layout__item u-txt-12 u-4/6 u-txt-align-left u-txt-lineh-1"
          >
            <div className="o-media">
              <img
                className="o-media__img u-1/4"
                src={item.product.imUrl}
                alt={item.product.title}
              />

              <div className="o-media__body">
                <div className="u-txt-truncate-2 u-txt--bold">
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
          </div>

          <div className="cart-product__tool o-layout__item u-1/6 u-txt-align-right">
            <button
              data-product={item.product.asin}
              type="button"
              className="c-btn--fake"
              onClick={this.deleteCartItem}
            >
                <span>
                  <FontAwesomeIcon size="1x" icon="times" />
                </span>
            </button>
          </div>

        </div>
      );
    });

    const cartView = cart.length
      ? (
        <aside className="cart-view u-txt-align-left u-w--100 u-cf">
          <div className="cart-view__content">

            <div className="cart-header u-d-flex u-border--m-blur">
              <Link to="/cart" className="u-txt-underline u-txt-12">
                Proceed to checkout
              </Link>
              <div className="u-txt-20 u-line u-txt-align-center u-txt--bold u-ml-auto">
                {cartCounter}
                <div className="u-txt-10 u-txt--blur u-txt--light">
                  items
                </div>
              </div>
            </div>


            {/* #CART PRODUCT LIST */}
            {cartProductList}
            {/* #CART PRODUCT LIST */}

          </div>
        </aside>
      )
      : (
        <aside className="cart-view u-txt-align-left u-w--100 u-cf">
          <div className="cart-view__content">
            <p className="u-txt-12 u-txt--blur">Your cart is empty.</p>
          </div>
        </aside>
      );

    return (
      <UserContext.Consumer>
        {({ currentUser }) => (
          <>
            <Desktop>
              <header className="c-header">

                <nav className="c-header__topnav">
                  <div className="c-header__topnav-wrapper">
                    <ul className="c-header__topnav-list">
                      <li className="c-header__topnav-item">
                        <Link to="/sell"><span>Sell</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/registry"><span>Registry</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/gift-cards"><span>Gift Cards</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/buy-again"><span>Buy Again</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/account"><span>Account</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/faq"><span>FAQ</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/history"><span>History</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/registry"><span>Registry</span></Link>
                      </li>
                      <li className="c-header__topnav-item">
                        <Link to="/deals"><span>Today Deals</span></Link>
                      </li>
                    </ul>
                  </div>
                </nav>


                <div className="o-layout c-header__nav">
                  <div className="o-layout__item c-header__nav-logo u-1/10 left">

                    <Link to="/">
                      <svg
                        className="c-header__nav-logo-img"
                        viewBox="0 0 256 315"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        preserveAspectRatio="xMidYMid"
                      >
                        <g>
                          <path
                            d="M213.803394,167.030943 C214.2452,214.609646 255.542482,230.442639 256,230.644727 C255.650812,231.761357 249.401383,253.208293 234.24263,275.361446 C221.138555,294.513969 207.538253,313.596333 186.113759,313.991545 C165.062051,314.379442 158.292752,301.507828 134.22469,301.507828 C110.163898,301.507828 102.642899,313.596301 82.7151126,314.379442 C62.0350407,315.16201 46.2873831,293.668525 33.0744079,274.586162 C6.07529317,235.552544 -14.5576169,164.286328 13.147166,116.18047 C26.9103111,92.2909053 51.5060917,77.1630356 78.2026125,76.7751096 C98.5099145,76.3877456 117.677594,90.4371851 130.091705,90.4371851 C142.497945,90.4371851 165.790755,73.5415029 190.277627,76.0228474 C200.528668,76.4495055 229.303509,80.1636878 247.780625,107.209389 C246.291825,108.132333 213.44635,127.253405 213.803394,167.030988 M174.239142,50.1987033 C185.218331,36.9088319 192.607958,18.4081019 190.591988,0 C174.766312,0.636050225 155.629514,10.5457909 144.278109,23.8283506 C134.10507,35.5906758 125.195775,54.4170275 127.599657,72.4607932 C145.239231,73.8255433 163.259413,63.4970262 174.239142,50.1987249"
                            fill="/00000"
                          />
                        </g>
                      </svg>
                    </Link>

                  </div>


                  <div className="o-layout__item c-header__nav-search u-6/10">
                    <form
                      className="c-searchbar"
                      method="get"
                      onSubmit={this.searchProduct}
                      role="search"
                      acceptCharset="utf-8"
                    >
                      <div className="c-searchbar__box">
                        <input
                          type="search"
                          name="keyword"
                          onChange={this.handleInputChange}
                          placeholder="Search anything..."
                          aria-label="Search"
                          data-border="rounded"
                        />
                        <div className="c-searchbar__button">
                          <button
                            type="button"
                            onClick={this.searchProduct}
                            className="c-searchbar__button-icon"
                            style={{
                              border: 'none',
                              background: 'transparent',
                            }}
                          >
                            <FontAwesomeIcon icon="search" className="medium" />
                          </button>
                          <input type="submit" defaultValue="Go" />
                        </div>
                      </div>
                    </form>
                  </div>


                  <div className="o-layout__item c-header__nav-tool u-3/10 right">
                    <a
                      href="/"
                      className="u-margin-horizontal-tiny"
                      data-display="inline-flex"
                      data-hover="darkblue"
                    >
                      <FontAwesomeIcon icon="globe" className="large" />
                      <span className="c-header__nav-tool-text">English</span>
                    </a>

                    <div
                      className="u-margin-horizontal-tiny"
                      data-display="inline-flex"
                      data-hover="darkblue"
                    >
                      <FontAwesomeIcon icon="user" className="large" />
                      {!currentUser
                        ? (
                          <button
                            type="button"
                            className="c-btn--fake"
                            onClick={this.openModal}
                          >
                            <span className="c-header__nav-tool-text">Log-in</span>
                          </button>
                        )
                        : (
                          <>
                            <div className="c-header__nav-tool-text">{`Hello, ${currentUser}`}</div>
                            <button
                              type="button"
                              onClick={this.logout}
                              className="c-header__nav-tool-text u-txt-underline c-btn--fake"
                            >
                              Log-out
                            </button>
                          </>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={this.openCart}
                      className="c-header__cart c-btn--fake"
                      data-display="inline-flex"
                      data-hover="darkblue"
                    >
                      <FontAwesomeIcon icon="shopping-cart" className="large" />
                      <span className="c-header__nav-tool-text">
                        Cart
                        {' '}
                        <span className="u-txt--bold">{cartCounter}</span>
                        {
                          isCartOpen ? <span className="cart-caret" /> : ''
                        }
                        </span>
                    </button>

                    {/* #CART VIEW */}
                    {isCartOpen
                      ? cartView
                      : ''}
                    {/* /CART VIEW */}

                  </div>

                </div>

                {!currentUser
                  ? (
                    <Modal
                      style={modalStyles}
                      isOpen={isLoginModalOpen}
                      onRequestClose={this.closeModal}
                    >
                      <div className="o-layout o-layout--flush">

                        {/* #LOG-IN FORM */}
                        <div className="o-layout__item u-1/2">
                          <div
                            className="modal-title u-txt-40 u-txt--hairline u-mt-12 u-mb-36">Log-in
                          </div>
                          <form onSubmit={this.login}>
                            <input
                              type="text"
                              name="usernameLogin"
                              placeholder="username"
                              className="u-d-block u-mb-12 u-w--60"
                              required
                              onChange={this.handleInputChange}
                            />
                            <input
                              type="password"
                              name="passwordLogin"
                              placeholder="password"
                              className="u-d-block u-mb-6 u-w--60"
                              required
                              onChange={this.handleInputChange}
                            />
                            <Link to="/forget">
                              <span className="u-txt-underline u-txt-8">Forget your password?</span>
                            </Link>
                            <input
                              type="submit"
                              className="c-btn c-btn--primary c-btn--rounded u-d-block u-txt-12 u-mt-36 u-1/3"
                              value="Log-in"
                            />
                          </form>
                        </div>
                        {/* /LOG-IN FORM */}

                        {/* #SIGN-UP FORM */}
                        <div className="o-layout__item u-1/2">
                          <div className="modal-title u-txt-40 u-txt--hairline u-mt-12 u-mb-36">
                            Sign-up
                          </div>
                          <form onSubmit={this.register}>
                            <input
                              type="text"
                              name="usernameRegister"
                              placeholder="username"
                              required
                              className="u-d-block u-mb-12 u-w--70"
                              onChange={this.handleInputChange}
                            />
                            <input
                              type="password"
                              name="passwordRegister"
                              placeholder="password"
                              required
                              className="u-d-block u-mb-6 u-w--70"
                              onChange={this.handleInputChange}
                            />
                            <input
                              type="submit"
                              className="c-btn c-btn--primary c-btn--rounded u-d-block u-txt-12 u-mt-36 u-1/3"
                              value="Sign-up"
                            />
                          </form>
                        </div>
                        {/* /SIGN-UP FORM */}

                      </div>

                    </Modal>
                  )
                  : ''}


                {categoryList}
              </header>
            </Desktop>


            <Mobile>

              <header className="c-header">

                {/* #NAV-TOP */}
                <nav className="c-header__topnav">
                  <div className="c-header__topnav-wrapper">
                    <ul className="c-header__topnav-list">
                      <li className="c-header__topnav-item">
                        <a href="/"><span>Sell</span></a>
                      </li>
                      <li className="c-header__topnav-item">
                        <a href="/"><span>Registry</span></a>
                      </li>
                      <li className="c-header__topnav-item">
                        <a href="/"><span>Gift Cards</span></a>
                      </li>
                      <li className="c-header__topnav-item">
                        <a href="/"><span>Buy Again</span></a>
                      </li>
                      <li className="c-header__topnav-item">
                        <a href="/">
                          <span>Account</span>
                        </a>
                      </li>
                      <li className="c-header__topnav-item">
                        <a href="/">
                          <span>Today&apos;s Deals</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>
                {/* /Nav Top */}

                {/* #NAV-MAIN */}
                <div className="o-layout [ o-layout--flush ] c-header__nav u-ai--center">

                  {/* #HAMBURGER MENU */}
                  <div className="o-layout__item c-header__nav-bars u-1/6 left">
                    <button
                      onClick={this.openMenu}
                      type="button"
                    >
                      <FontAwesomeIcon icon="bars" className="large" />
                    </button>
                  </div>

                  <Modal
                    className="ReactMenu__Content"
                    style={{
                      content: {
                        position: 'absolute',
                        backgroundColor: 'rgba(255, 255, 255)',
                        inset: 0,
                        height: '100%',
                        overflowY: 'auto',
                      },
                      overlay: {
                        backgroundColor: 'rgba(0, 0, 0, .7)',
                      },
                    }}
                    isOpen={isMenuOpen}
                    onRequestClose={this.closeMenu}
                  >
                    <div className="ReactModal-Topbar" />

                    <div className="ReactModal-Wrapper">

                      <button
                        type="button"
                        onClick={this.closeMenu}
                        className="ReactMenu-Close u-mb-12"
                      >
                        <FontAwesomeIcon icon="times" size="2x" />
                      </button>

                      <div className="ReactMenu-Content">

                        <div className="ReactMenu-Item">
                          <div className="u-txt--bold u-txt-underline u-txt-24 u-mb-12">
                            Account
                          </div>
                          <div className="u-txt-16 u-txt--light">
                            <div className="u-ml-6 u-mb-6">Log-in</div>
                            <div className="u-ml-6 u-mb-6">Sign-up</div>
                            <div className="u-ml-6 u-mb-6">Order</div>
                            <div className="u-ml-6 u-mb-6">History</div>
                          </div>
                        </div>

                        <div className="ReactMenu-Item">
                          <div className="u-txt--bold u-txt-underline u-txt-24 u-mb-12">
                            Shop
                          </div>
                          <div className="u-txt-16 u-txt--light">
                            <div className="u-ml-6 u-mb-6">Shop by Departments</div>
                            <div className="u-ml-6 u-mb-6">Today&apos;s Deals</div>
                            <div className="u-ml-6 u-mb-6">Last-minute Deals</div>
                            <div className="u-ml-6 u-mb-6">Recommendations</div>
                          </div>
                        </div>

                        <div className="ReactMenu-Item">
                          <div className="u-txt--bold u-txt-underline u-txt-24 u-mb-12">
                            Help & Settings
                          </div>
                          <div className="u-txt-16 u-txt--light">
                            <div className="u-ml-6 u-mb-6">Q&A</div>
                            <div className="u-ml-6 u-mb-6">Customer Service</div>
                            <div className="u-ml-6 u-mb-6">Policy & Privacy</div>
                            <div className="u-ml-6 u-mb-6">Shipping</div>
                          </div>
                        </div>

                      </div>


                    </div>
                  </Modal>

                  {/* /Hamburger Menu */}


                  {/* #LOGO */}
                  <div className="o-layout__item c-header__nav-logo u-4/6">
                    <Link to="/">
                      <svg
                        className="c-header__nav-logo-img"
                        viewBox="0 0 256 315"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        preserveAspectRatio="xMidYMid">
                        <g>
                          <path
                            d="M213.803394,167.030943 C214.2452,214.609646 255.542482,230.442639 256,230.644727 C255.650812,231.761357 249.401383,253.208293 234.24263,275.361446 C221.138555,294.513969 207.538253,313.596333 186.113759,313.991545 C165.062051,314.379442 158.292752,301.507828 134.22469,301.507828 C110.163898,301.507828 102.642899,313.596301 82.7151126,314.379442 C62.0350407,315.16201 46.2873831,293.668525 33.0744079,274.586162 C6.07529317,235.552544 -14.5576169,164.286328 13.147166,116.18047 C26.9103111,92.2909053 51.5060917,77.1630356 78.2026125,76.7751096 C98.5099145,76.3877456 117.677594,90.4371851 130.091705,90.4371851 C142.497945,90.4371851 165.790755,73.5415029 190.277627,76.0228474 C200.528668,76.4495055 229.303509,80.1636878 247.780625,107.209389 C246.291825,108.132333 213.44635,127.253405 213.803394,167.030988 M174.239142,50.1987033 C185.218331,36.9088319 192.607958,18.4081019 190.591988,0 C174.766312,0.636050225 155.629514,10.5457909 144.278109,23.8283506 C134.10507,35.5906758 125.195775,54.4170275 127.599657,72.4607932 C145.239231,73.8255433 163.259413,63.4970262 174.239142,50.1987249"
                            fill="#000000" />
                        </g>
                      </svg>
                    </Link>
                  </div>
                  {/* /Logo */}


                  {/* #CART */}
                  <div className="o-layout__item c-header__nav-tool u-1/6 right">
                    <button
                      onClick={this.openCartMobile}
                      type="button"
                      className="c-header__cart"
                    >
                      <FontAwesomeIcon icon="shopping-cart" className="large" />
                    </button>
                  </div>


                  <Modal
                    className="ReactCart__Content"
                    style={{
                      content: {
                        position: 'absolute',
                        backgroundColor: 'rgba(255, 255, 255)',
                        right: 0,
                        height: '100%',
                        overflowY: 'auto',
                      },
                      overlay: {
                        backgroundColor: 'rgba(0, 0, 0, .7)',
                      },
                    }}
                    isOpen={isCartOpen}
                    onRequestClose={this.closeCart}
                  >
                    <div className="ReactModal-Topbar" />

                    {/* #MODAL WRAPPER */}
                    <div className="ReactModal-Wrapper">

                      {/* #CLOSE BUTTON */}
                      <div className="u-txt-align-right">
                        <button
                          type="button"
                          onClick={this.closeCart}
                          className="ReactCart-Close u-mb-12"
                        >
                          <FontAwesomeIcon icon="times" size="2x" />
                        </button>
                      </div>
                      {/* /Close Button */}

                      <hr />

                      {/* #MODAL HEADER */}
                      <div className="u-mv-24 u-d-flex u-ai--fe">

                        <Link
                          to="/checkout"
                          className="u-txt--light u-txt-16 u-txt-underline"
                        >
                          Proceed to Checkout
                        </Link>

                        <div className="u-txt-20 u-line u-txt-align-center u-txt--bold u-ml-auto">
                          {cartCounter}
                          <div className="u-txt-16 u-txt--blur u-txt--light">
                            items
                          </div>
                        </div>

                      </div>
                      {/* /Modal Header */}


                      {/* #PRODUCTS LIST */}
                      <div className="">
                        {
                          cart.map((item, index) => {
                            cartCounter += item.quantity;

                            return (
                              <div
                                key={index.toString()}
                                className="ReactCart__Product o-layout o-layout--flush u-d-flex u-pv-12 u-ph-6"
                              >

                                {/* #DELETE BUTTON */}
                                <div className="o-layout__item u-1/10">
                                  <button
                                    data-product={item.product.asin}
                                    type="button"
                                    onClick={this.deleteCartItem}
                                  >
                                    <span>
                                      <FontAwesomeIcon size="1x" icon="times" />
                                    </span>
                                  </button>
                                </div>
                                {/* /Delete Button */}


                                {/* #PRODUCT INFORMATION */}
                                <Link
                                  to={`/products/${item.product.asin}`}
                                  className="o-layout__item u-4/6"
                                >
                                  <div className="o-media o-media--tiny">
                                    <img
                                      className="o-media__img u-2/5"
                                      src={item.product.imUrl}
                                      alt={item.product.title}
                                    />
                                    <div className="o-media__body">
                                      <div className="u-txt-14 u-txt-truncate-3 u-txt--light">
                                        {item.product.title}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                                {/* /PRODUCT INFORMATION */}


                                <div
                                  className="o-layout__item u-txt-16 u-as--center u-txt-align-center u-2/6">
                                  <button
                                    onClick={this.productQtyHandle}
                                    data-product={JSON.stringify(item)}
                                    data-action="desc"
                                    type="button"
                                    className="c-btn--fake u-txt-20"
                                  >
                                    -
                                  </button>
                                  <span
                                    className="u-ph-12 u-txt-20 u-txt-underline">{item.quantity}</span>
                                  <button
                                    onClick={this.productQtyHandle}
                                    data-product={JSON.stringify(item)}
                                    data-action="inc"
                                    type="button"
                                    className="c-btn--fake u-txt-20"
                                  >
                                    +
                                  </button>
                                </div>
                                ;
                              </div>
                            );
                          })
                        }
                      </div>

                    </div>
                    {/* /Modal Wrapper */}

                  </Modal>

                  {/* /Cart */}


                  {/* #SEARCH BAR */}
                  <div className="o-layout__item c-header__nav-search">
                    <form
                      className="c-searchbar"
                      method="get"
                      onSubmit={this.searchProduct}
                      role="search"
                      acceptCharset="utf-8"
                    >
                      <div className="c-searchbar__box">

                        <input
                          type="search"
                          name="keyword"
                          onChange={this.handleInputChange}
                          placeholder="Search anything..."
                          aria-label="Search"
                          data-border="rounded"
                        />
                        <div className="c-searchbar__button">
                          <button
                            type="button"
                            onClick={this.searchProduct}
                            style={{
                              border: 'none',
                              background: 'transparent',
                            }}
                            className="c-searchbar__button-icon"
                          >
                            <FontAwesomeIcon icon="search" className="medium" />
                          </button>
                          <input type="submit" tabIndex={0} defaultValue="Go" />
                        </div>

                      </div>
                    </form>
                  </div>
                  {/* /Search Bar */}

                </div>
                {/* #Nav-Main */}

              </header>


              {/* #CATEGORY SLIDER */}
              <ul
                className="o-col [ o-col--small o-col--scrollable ] u-m-0 u-bg-darkblue u-txt--white"
              >
                {categoriesItem}
              </ul>
              {/* /Category Slider */}

            </Mobile>

          </>
        )}
      </UserContext.Consumer>
    );
  }
}

Header.contextType = UserContext;

Header.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  currentUser: PropTypes.string,
  cart: PropTypes.array.isRequired,
  updateCart: PropTypes.func.isRequired,
};

Header.defaultProps = {
  currentUser: '',
};

export default withRouter(Header);
