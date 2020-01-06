import React, { Component } from "react";
import "./App.css";
import logo from "./logo.svg";
import { createCreds, validateCreds } from "./webauthn";

const buttonStyle = {
  padding: 10,
  margin: 5
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>react-webauthn</p>
          <button style={buttonStyle} onClick={createCreds}>
            登録ボタン
          </button>

          <button style={buttonStyle} onClick={validateCreds}>
            ログインボタン
          </button>
        </header>
      </div>
    );
  }
}

export default App;
