import config from './config.js'
import Kraken from 'kraken-api'
import * as timers from "timers";
const kraken = new Kraken(config.key, config.secret);

const resultToTicker = (res) => {
	let r = res.result[config.order_params.pair]
	return {
		ticker: config.order_params.pair,
		low: r.l,
		high: r.h,
		price: r.o
	}
}

const resultToOrder = (res) => {
	return res.result
}

const getTicker = async () => {
	await kraken.api('Ticker', { pair: config.order_params.pair }, (err, res) => {
		console.log(resultToTicker(res))
	});
}

const placeOrder = async () => {
	await kraken.api('AddOrder', config.order_params, (err, res) => {
		if (err !== null) {
			console.error('An error has occurred', err)
			return;
		}
		console.log('Order placed', resultToOrder(res))
	});
}

(async () => {
	await placeOrder()
	timers.setInterval(placeOrder, config.interval_ms)
	// Add order and wait interval
	await getTicker()
	timers.setInterval(getTicker, 10000)
})();
