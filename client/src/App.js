import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import './App.css';
import Accounts from './pages/accounts';
import Balance from './pages/balance';
import GetProduct from './pages/getProduct';
import ViewProduct from './pages/viewProduct';
import AddProduct from './pages/addProduct';

class App extends Component {
  state = { account: "" }
  // set default account
  componentDidMount() {
    const { drizzleState } = this.props;
    const self = this;

    this.setState({ account: drizzleState.accounts[0] });

    window.ethereum.on('accountsChanged', function (accounts) {
      const account = self.state.account;
      if (accounts[0] !== account) {
        // self.setState({ account: accounts[0] }); // address become lower case
        window.location.reload();
      }
    });
  }

  componentDidUpdate(prevProps) {
    console.log(this.props)
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  currentPage = ({ isActive }) => ((isActive ? 'text-primary' : 'text-dark') + " px-4 py-2 text-decoration-none")

  render() {
    const { account } = this.state;

    return (
      <BrowserRouter>
        <div className='container-fluid shadow bg-white border-bottom'>
          <div className='container'>
            <div className='row justify-content-between align-items-center py-2'>
              <div className='col'>
                <div className='d-flex'>
                  <NavLink to="/" className={this.currentPage}>Marketplace</NavLink>
                  <NavLink to="/sell" className={this.currentPage}>Sell</NavLink>
                </div>
              </div>
              <div className='col'>
                <Accounts
                  drizzle={this.props.drizzle}
                  drizzleState={this.props.drizzleState}
                  account={account}
                />
              </div>
              <div className='col'>
                <Balance
                  drizzle={this.props.drizzle}
                  drizzleState={this.props.drizzleState}
                  account={account}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid position-relative bg-light bg-gradient' style={{ minHeight: "calc(100vh - 57px)" }}>
          <div className="card position-absolute top-50 left-50 translate-middle" style={{ minWidth: 900 }}>
            <div className="card-body">
              <Routes>
                <Route exact path="/" element={
                  <GetProduct
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                    account={account}
                  />
                } />
                <Route exact path='/product' element={
                  <ViewProduct
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                    account={account}
                  />
                } />
                <Route exact path='/sell' element={
                  <AddProduct
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                    account={account}
                  />
                } />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
