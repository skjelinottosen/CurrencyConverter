import React from 'react';
import CurrencyConverter from "./CurrencyConverter"
import Clock from "./Clock"

function App() {
  return (
    <div id="mastergrid">
      <header id="header">
        <Clock />
      </header>
      <CurrencyConverter />
    </div>
  );
}

export default App;
