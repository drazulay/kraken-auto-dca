import config from './config.js'
import Kraken from 'kraken-api'
import { setInterval } from "timers";
const kraken = new Kraken(config.key, config.secret);

/**
 * Gets result from response object
 * @param res
 * @returns {RemoteObject | PropertyDescriptor[] | SearchMatch[] | Runtime.RemoteObject | ScriptCoverage[] | ScriptTypeProfile[] | T | SVGAnimatedString | string | ArrayBuffer}
 */
const getResult = (res) => {
	return res.result
}

/**
 * Displays the current ticker information
 * @returns {Promise<void>}
 */
const getTickerData = async () => {
	await kraken.api('Ticker', { pair: config.order_params.pair }, (err, res) => {
		if (err !== null) {
			console.error('An error has occurred', err)
			return;
		}
		console.log(getResult(res))
	});
}

/**
 * Place an order
 * @returns {Promise<void>}
 */
const placeOrder = async () => {
	await kraken.api('AddOrder', config.order_params, (err, res) => {
		if (err !== null) {
			console.error('An error has occurred', err)
			return;
		}
		console.log('Order placed', getResult(res))
	});
}

/**
 * Main loop consisting of two intervals,
 * one for orders and the other for ticker data
 */
(async () => {
	await placeOrder()
	setInterval(placeOrder, config.order_interval_ms)
	// Add order and wait interval
	await getTickerData()
	setInterval(getTickerData, config.ticker_interval_ms)
})();
