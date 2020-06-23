import React from 'react';
import {
  Route, Switch, withRouter, NavLink,
} from 'react-router-dom';
import AddProduct from '../admin/products/AddProduct';
import ProductList from '../admin/products/ProductList';
import ImportProduct from '../admin/products/ImportProduct';
import UserList from '../admin/users/UsertList';
import ImportUser from '../admin/users/ImportUser';
import AddUser from '../admin/users/AddUser';
import CatList from '../admin/cats/CatList';
import AddCat from '../admin/cats/AddCat';

function StoreManagement() {
  const navActiveStyle = {
    fontWeight: 'bold',
  };

  return (
    <div className="o-wrapper">

      <div className="o-layout o-layout--small">


        {/* #SIDE MENU */}
        <div className="o-layout__item u-1/3">

          {/* #PRODUCTS */}
          <div className="u-mb-24">
            <div className="u-txt-24 u-txt--bold">Products</div>
            <div>
              <NavLink
                to="/store-management/products/new"
                activeStyle={navActiveStyle}
              >
                Create New Product
              </NavLink>
            </div>
            <div>
              <NavLink
                to="/store-management/products/list"
                activeStyle={navActiveStyle}
              >
                Product List
              </NavLink>
            </div>
            <div>
              <NavLink
                to="/store-management/products/import"
                activeStyle={navActiveStyle}
              >
                Import/Export
              </NavLink>
            </div>
          </div>
          {/* /PRODUCTS */}


          {/* #USERS */}
          <div className="u-mb-24">
            <div className="u-txt-24 u-txt--bold">Users</div>
            <div>
              <NavLink
                to="/store-management/users/new"
                activeStyle={navActiveStyle}
              >
                Create New User
              </NavLink>
            </div>
            <div>
              <NavLink
                to="/store-management/users/list"
                activeStyle={navActiveStyle}
              >
                Users List
              </NavLink>
            </div>
            <div>
              <NavLink
                to="/store-management/users/import"
                activeStyle={navActiveStyle}
              >
                Import/Export
              </NavLink>
            </div>
          </div>
          {/* #USERS */}

          {/* #CATS */}
          <div className="u-mb-24">
            <div className="u-txt-24 u-txt--bold">Categories</div>
            <div>
              <NavLink
                to="/store-management/cats/new"
                activeStyle={navActiveStyle}
              >
                Create New Category
              </NavLink>
            </div>
            <div>
              <NavLink
                to="/store-management/cats/list"
                activeStyle={navActiveStyle}
              >
                Category List
              </NavLink>
            </div>
          </div>
          {/* /CATS */}

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
                <ImportProduct {...props} />
              )}
            />

            <Route
              exact
              path="/store-management/users/list"
              render={(props) => (
                <UserList {...props} />
              )}
            />

            <Route
              exact
              path="/store-management/users/import"
              render={(props) => (
                <ImportUser {...props} />
              )}
            />

            <Route
              exact
              path="/store-management/users/new"
              render={(props) => (
                <AddUser {...props} />
              )}
            />

            <Route
              exact
              path="/store-management/cats/list"
              render={(props) => (
                <CatList {...props} />
              )}
            />

            <Route
              exact
              path="/store-management/cats/new"
              render={(props) => (
                <AddCat {...props} />
              )}
            />

          </Switch>

        </div>

      </div>

    </div>
  );
}

export default withRouter(StoreManagement);
