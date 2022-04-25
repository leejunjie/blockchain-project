import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import './App.css';
// import ReadText from './pages/readText';
// import SetText from './pages/setText';
import Accounts from './pages/accounts';
import GetProduct from './pages/getProduct';
import ViewProduct from './pages/viewProduct';
import AddProduct from './pages/addProduct';
import BuyProduct from './pages/buyProduct';

class App extends Component {
  // set default account
  componentDidMount() {
    const { drizzleState } = this.props;
    this.setState({ account: drizzleState.accounts[1] });
  }

  currentPage = ({ isActive }) => ((isActive ? 'text-primary' : 'text-dark') + " px-4 py-2 text-decoration-none")

  render() {
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
              <div className="d-flex justify-content-end">
                <Accounts
                  drizzle={this.props.drizzle}
                  drizzleState={this.props.drizzleState}
                />
              </div>
            </div>
          </div>
          <Routes>
            <Route exact path="/" element={
              <GetProduct
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
              />
            } />
            <Route exact path='/product' element={
              <ViewProduct
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
              />
            } />
            <Route exact path='/sell' element={
              <AddProduct
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
              />
            } />
          </Routes>
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
    {/* 
      <div style={{ display: "flex", justifyContent: "space-around" }}>
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
