import config from './config.js'
import Kraken from 'kraken-api'
import { setInterval } from "timers";
const kraken = new Kraken(config.key, config.secret);

/**
 * Gets result from response object and adds epoch time
 * @param res
 * @returns {Object}
 */
const getResult = (res) => {
	res.result['time'] = Date.now()
	return res.result
}

/**
 * Displays the current ticker information
 * @returns {Promise<void>}
 */
const ticker = async () => {
	await kraken.api('Ticker', { pair: config.order_params.pair }, (err, res) => {
		if (err !== null) {
			console.error('An error has occurred', err)
			return
		}
		console.log(getResult(res))
	});
}

/**
 * Place an order
 * @returns {Promise<void>}
 */
const addOrder = async () => {
	await kraken.api('AddOrder', config.order_params, (err, res) => {
		if (err !== null) {
			console.error('An error has occurred', err)
			return
		}
		console.log('Order placed', getResult(res))
	});
}

/**
 * Main loop consisting of two intervals,
 * one for orders and the other for ticker data
 */
(async () => {
	// Place an order immediately
	await addOrder()
	// Wait interval to place next order
	setInterval(addOrder, config.order_interval_ms)

	// Get ticker data immediately
	await ticker()
	// Wait interval to get next ticker data
	setInterval(ticker, config.ticker_interval_ms)
})();
