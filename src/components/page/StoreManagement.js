import React from 'react';
import {
  Route, Switch, withRouter, NavLink,
} from 'react-router-dom';
import AddProduct from '../admin/AddProduct';
import ProductList from '../admin/ProductList';

function StoreManagement() {
  return (
    <div className="o-wrapper">
      <div className="o-layout--flush">

        <div className="o-layout__item u-1/6">
          <div className="u-txt-24 u-txt--bold">Products</div>
          <div>
            <NavLink to="/store-management/products/new">
              Create New Product
            </NavLink>
          </div>
          <div>
            <NavLink to="/store-management/products/list">
              Product List
            </NavLink>
          </div>

        </div>

        <div className="o-layout__item u-5/6">

          <Switch>
            <Route
              exact
              path="/store-management/products/new"
              render={(props) => (
                <AddProduct {...props} />
              )}
            />

            <Route
              exact
              path="/store-management/products/list"
              render={(props) => (
                <ProductList {...props} />
              )}
            />
          </Switch>
        </div>

      </div>

    </div>
  );
}

export default withRouter(StoreManagement);
