import React from 'react';
import './App.css';
import { decode } from 'jsonwebtoken';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faApple } from '@fortawesome/free-brands-svg-icons';
import {
  faSearch,
  faGlobe,
  faUser,
  faShoppingCart,
  faAngleLeft,
  faAngleRight,
  faBasketballBall,
  faTshirt,
  faCameraRetro,
  faLaptopCode,
  faHeadphonesAlt,
  faTv,
  faTrain,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faBars,
  faFilter,
  faSortAmountUpAlt,
  faBorderAll,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { ModalProvider } from 'react-modal-hook';
import { UserContext } from './context/user';
import local from './helper/localStorage';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/page/Home';
import ProductDetail from './components/page/ProductDetail';
import ProductSearch from './components/page/ProductSearch';
import StoreManagement from './components/page/StoreManagement';
import ProductCategory from './components/page/ProductCategory';
import Checkout from './components/page/Checkout';
import OrderTracking from './components/page/OrderTracking';

// create font-awesome icons library
library.add(fab, faSearch, faGlobe, faUser, faShoppingCart, faAngleLeft, faAngleRight, faApple,
  faBasketballBall, faTshirt, faCameraRetro, faLaptopCode, faHeadphonesAlt, faTv, faTrain, faTimes,
  faChevronRight, faChevronLeft, faBars, faFilter, faSortAmountUpAlt, faBorderAll, faStar);

// axios default configurations
axios.defaults.baseURL = process.env.REACT_APP_SERVER_HOST || 'http://localhost:8081';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: local.get('user') || '',
      token: local.get('token') || '',
      cart: [],
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.updateCart = this.updateCart.bind(this);
    this.bundlePurchase = this.bundlePurchase.bind(this);
  }

  login(user, token) {
    this.setState({
      currentUser: user.username,
      token,
    });
    local.save('user', user.username);
    local.save('token', token);
  }

  logout() {
    this.setState({
      currentUser: '',
      token: '',
    });
    local.remove('user');
    local.remove('token');
  }

  updateCart(cart) {
    this.setState({
      cart,
    });
  }

  bundlePurchase(products) {
    this.setState({
      cart: products,
    });
  }

  render() {
    const { currentUser, token, cart } = this.state;
    const isAdmin = local.get('token') ? decode(local.get('token')).role === 'admin' : false;

    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    return (
      <UserContext.Provider value={{
        currentUser,
        token,
      }}>
        <ModalProvider>
          <Router>
            <div className="App">

              <Header
                currentUser={currentUser}
                login={this.login}
                logout={this.logout}
                cart={cart}
                updateCart={this.updateCart}
              />

              {isAdmin
                ? (
                  <Route
                    path="/store-management"
                    render={(props) => (
                      <StoreManagement {...props} />
                    )}
                  />)
                : ''}


              <Switch>

                <Route
                  path="/"
                  exact
                  render={(props) => (
                    <Home {...props} currentUser={currentUser} />
                  )}
                />

                <Route
                  path="/checkout"
                  exact
                  render={(props) => (
                    <Checkout
                      {...props}
                      updateCart={this.updateCart}
                      user={currentUser}
                      cart={cart}
                    />
                  )}
                />

                <Route
                  path="/orders"
                  exact
                  render={(props) => (
                    <OrderTracking
                      {...props}
                      user={currentUser}
                    />
                  )}
                />

                <Route
                  path="/products/search"
                  exact
                  render={(props) => (
                    <ProductSearch
                      {...props}
                    />
                  )}
                />

                <Route
                  path="/products/:asin"
                  render={(props) => (
                    <ProductDetail
                      {...props}
                      loggedIn={currentUser !== ''}
                      currentUser={currentUser}
                      updateCart={this.updateCart}
                      onBundlePurchase={this.bundlePurchase}
                    />
                  )}
                />

                <Route
                  path="/categories/:id"
                  exact
                  render={(props) => (
                    <ProductCategory
                      {...props}
                    />
                  )}
                />

              </Switch>

              <Footer />


            </div>
          </Router>
        </ModalProvider>
      </UserContext.Provider>
    );
  }
}
