import React from 'react';
import logo from './logo.svg';
import '@style/App.scss';

function App() {
  return (
    <>
      <div id="left">
        <header></header>
        <nav></nav>
      </div>
      <div id="center">
        <main></main>
      </div>
      <div id="right">
        <aside></aside>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
