import React from 'react';
import { Route, Link, Switch, withRouter, NavLink } from 'react-router-dom';
import AddProduct from '../form/AddProduct';

class StoreManagement extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();


  }

  render() {
    return (
      <div className="o-wrapper">
        <div className="o-layout--flush">

          <div className="o-layout__item u-1/6">
            <div>
              <NavLink to="/store-management/products/new">
                Create new product
              </NavLink>
            </div>
            <div>
              <NavLink to="/store-management/products/search">
                Search product
              </NavLink>
            </div>
            <div>
              <NavLink to="/store-management/products/list">
                Product List
              </NavLink>
            </div>

          </div>

          <div className="o-layout__item u-5/6">
            <Route
              path="/store-management/products/new"
              render={(props) => (
                <AddProduct {...props} />
              )}
            />
          </div>

        </div>

      </div>
    );
  }
}

export default withRouter(StoreManagement);
