import React, { Component } from 'react';
import './App.css';
// import ReadText from './pages/readText';
// import SetText from './pages/setText';
import Accounts from './pages/accounts';
import AddProduct from './pages/addProduct';
import GetProduct from './pages/getProduct';
import BuyProduct from './pages/buyProduct';

class App extends Component {
  state = { account: null }

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

  handleChangeAcc = (e) => {
    this.setState({ account: e.target.value });
  }

  render() {
    // if (this.state.loading) return "Loading Drizzle...";
    return <div className="App">
      {/* <ReadText
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
      />
      <SetText
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
      /> */}
      <Accounts
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
      </div>

    </div>;
  }
}

export default App;
