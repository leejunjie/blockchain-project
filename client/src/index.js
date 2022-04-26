import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";
import P2P from "./contracts/P2P.json";

import "bootstrap/dist/css/bootstrap.min.css";

// let drizzle know what contracts we want
const options = {
  contracts: [P2P],
  web3: {
    fallback: {
      type: 'ws',
      url: "ws://127.0.0.1:7545"
    }
  }
};

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

// pass in the drizzle instance
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return <div className="d-flex justify-content-center" style={{ minHeight: 550 }}>
              <div className="spinner-border my-auto" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>;
          }

          return (
            <App drizzle={drizzle} drizzleState={drizzleState} />
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
