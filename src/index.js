import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.css";
import App from "./App";
import { register } from 'register-service-worker'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

register(process.env.PUBLIC_URL + 'service-worker.js', {
  ready(registration) {
    console.log('Service worker is active.')
  },
  registered(registration) {
    console.log('Service worker has been registered.')
  },
  cached(registration) {
    console.log('Content has been cached for offline use.')
  },
  updatefound(registration) {
    console.log('New content is downloading.')
  },
  updated(registration) {
    console.log('New content is available; please refresh.')
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error(error) {
    console.error('Error during service worker registration:', error)
  }
})