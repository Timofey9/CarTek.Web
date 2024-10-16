import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from "./store";
import './fonts/HelveticaNeueCyr-Black.ttf';
import 'bootstrap/dist/js/bootstrap.min';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from "react-redux";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ErrorBoundary } from "react-error-boundary";


function Fallback({ error, resetErrorBoundary }) {
	// Call resetErrorBoundary() to reset the error boundary and retry the render.
	console.log(error);
	return (
		<div role="alert">
			<p>Что-то пошло не так! Сделайте скриншот ошибки и отправьте администратору</p>
			<pre style={{ color: "red" }}>{error.stack}</pre>

			<div>
				<button onClick={() => resetErrorBoundary()} className="btn btn-success">Вернуться</button>
			</div>
		</div>
	);
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<ErrorBoundary
			FallbackComponent={Fallback}
			onReset={(details) => {
				// Reset the state of your app so the error doesn't happen again
			}}>
			<App />
		</ErrorBoundary>
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
