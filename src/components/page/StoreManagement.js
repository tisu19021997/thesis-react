import React from 'react';
import {
  Route, Switch, withRouter, NavLink,
} from 'react-router-dom';
import AddProduct from '../admin/AddProduct';
import ProductList from '../admin/ProductList';
import ProductImport from '../admin/ProductImport';

function StoreManagement() {
  return (
    <div className="o-wrapper">
      <div className="o-layout o-layout--small">


        {/* #SIDE MENU */}
        <div className="o-layout__item u-1/3">

          <div className="u-mb-24">
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
            <div>
              <NavLink to="/store-management/products/import">
                Import Products
              </NavLink>
            </div>
          </div>

          <div className="u-mb-24">
            <div className="u-txt-24 u-txt--bold">Promotions</div>
            <div>
              <NavLink to="/store-management/promotions/new">
                Create New Promotion
              </NavLink>
            </div>
            <div>
              <NavLink to="/store-management/promotions/list">
                Promotion List
              </NavLink>
            </div>
          </div>

        </div>
        {/* /SIDE MENU */}

        <div className="o-layout__item u-2/3">

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

            <Route
              exact
              path="/store-management/products/import"
              render={(props) => (
                <ProductImport {...props} />
              )}
            />
          </Switch>
        </div>

      </div>

    </div>
  );
}

export default withRouter(StoreManagement);
