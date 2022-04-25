import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import './App.css';
// import ReadText from './pages/readText';
// import SetText from './pages/setText';
import Accounts from './pages/accounts';
import AddProduct from './pages/addProduct';
import GetProduct from './pages/getProduct';
import BuyProduct from './pages/buyProduct';

class App extends Component {
  // set default account
  componentDidMount() {
    const { drizzleState } = this.props;
    this.setState({ account: drizzleState.accounts[1] });
  }

  // state = { loading: true, drizzleState: null };

  // componentDidMount() {
  //   const { drizzle } = this.props;

  //   // subscribe to changes in the store
  //   this.unsubscribe = drizzle.store.subscribe(() => {

  //     // every time the store updates, grab the state from drizzle
  //     const drizzleState = drizzle.store.getState();

  //     // check to see if it's ready, if so, update local component state
  //     if (drizzleState.drizzleStatus.initialized) {
  //       this.setState({ loading: false, drizzleState });
  //     }
  //   });
  // }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  currentPage = ({ isActive }) => ((isActive ? 'text-primary' : 'text-dark') + " px-4 py-2")

  render() {
    // if (this.state.loading) return "Loading Drizzle...";
    return (
      <BrowserRouter>
        <div className='container'>
          <div className='row justify-content-between mb-4'>
            <div className='col'>
              <div className='d-flex'>
                <NavLink to="/" className={this.currentPage}>Marketplace</NavLink>
                <NavLink to="/sell" className={this.currentPage}>Sell</NavLink>
              </div>
            </div>
            <div className='col'>
              <div class="d-flex justify-content-end">
                <Accounts
                  drizzle={this.props.drizzle}
                  drizzleState={this.props.drizzleState}
                />
              </div>
            </div>
          </div>
          <Routes>
            <Route path="/" element={
              <GetProduct
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
              />
            }>
            </Route>
          </Routes>
          {/* <div className='row'>
            <div className='col-3'></div>
            <div className='col-9'>
            </div>
          </div> */}
        </div>
      </BrowserRouter>
    );

    {/* <ReadText
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
      />
      <SetText
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
      /> */}
    {/* <Accounts
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
        account={this.state.account}
        handleChangeAcc={this.handleChangeAcc}
      />
      <GetProduct
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
        account={this.state.account}
      />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <AddProduct
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            account={this.state.account}
          />
        </div>
        <div>
          <BuyProduct
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            account={this.state.account}
          />
        </div> 
      </div>*/}
  }
}

export default App;
