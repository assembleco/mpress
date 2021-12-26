import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './online/reportWebVitals';
import Playground from "./share/playground"

ReactDOM.render(
  <React.StrictMode>
    <div style={{
      background: '#a0a0b0',
      height: '100vh',
      width: '100vw',
    }} >
      <Playground address={null} />
    </div>
  </React.StrictMode>,
  document.getElementById('base')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
