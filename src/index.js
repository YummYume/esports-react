import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import App from './pages/App';
import { BrowserRouter } from "react-router-dom";

import './styles/Index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import RouterScrollToTop from './components/common/RouterScrollToTop';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <RouterScrollToTop />
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
