'use strict';

const _total = new WeakMap(); // how much to do
const _tracker = new WeakMap(); // how much done
const _logger = new WeakMap(); // use for logging
const _perc = new WeakMap(); // log by percent
const _msg = new WeakMap(); // log message
const _logArr = new WeakMap(); // array of times to log progress

/**
 * Class to track and log a running
 * process of known length and discrete
 * steps
 */
class Acker {

    /**
	 * Initialize the Acker
     * @param config
     * @param config.total The total to process
     * @param config.percentage Log evern completion of this percentage (default 10)
     * @param config.logger (Optional) Logging function
     * @param config.logger (Optional) Message to log: 'PCT' -> percentage, INCR -> 'X of Y'
     */
	constructor (config) {
		config = config || {};
		_tracker.set(this, 0); // init tracker
        _total.set(this, config.total);
		_perc.set(this, config.percentage || 10);
		_logger.set(this, config.logger || console.log);
		_msg.set(this, config.message || '---- PCT completed! ----');

		this._buildLogArr()
	}

    /**
	 * Acknowledge one or more steps have been completed
     * @param count
     */
	ack (count = 1) {
		if (!_total.get(this)) {
			_logger.get(this)('Acker instance must have a configured total; set acker.total');
		}
        _tracker.set(this, _tracker.get(this) + count);
        this._log();
    }

    // ----- priv -----

	_log () {
        let done = _tracker.get(this);
        let total = _total.get(this);
        if (done > total) {
        	return _logger.get(this)('ACKER WARN: `done` is greater than `total`...');
		}
        let nextLog = _logArr.get(this)[0];
        if (nextLog && (done * 100/total) >= nextLog) {
        	_logArr.set(this, _logArr.get(this).filter(x => x > (done * 100/total)));
            _logger.get(this)(_msg.get(this)
                .replace('INCR', `${done} of ${total}`)
				.replace('PCT', `${parseInt(100 * done/total)}%`));
        }
	}

    /**
	 * build array of percents to log
     * @private
     */
	_buildLogArr () {
		let arr = [];
		let index = 1;
		let pct = _perc.get(this);
		while (index++ * pct < 100) {
			arr.push(index * pct);
		}
		arr.push(100);
		_logArr.set(this, arr);
	}

	// ----- get/set -----

    /**
	 * set the percentage to log by
     * @param {Number} perc
     */
	set logByPercentage (perc) {
        // todo validate
        _perc.set(this, perc);
	}

    /**
     * get the percentage to log by
	 * @return {Number} percentage
     */
    get logByPercentage () {
        _perc.get(this);
    }

    /**
	 * set the template message
     * @param {String} message
     */
	set message (message) {
		_msg.set(this, message);
		this._buildLogArr();
	}

    /**
	 * get the message template
     * @returns {String}
     */
	get message () {
		return _msg.get(this);
	}

    /**
	 * set the total
     * @param {Number} total
     */
	set total (total) {
		if (typeof total !== 'number' || total < 1) {
			throw new Error('ACKER ERR: Invalid TOTAL set:', total);
		}
		_total.set(this, parseInt(total));
	}

    /**
	 * get the total
     * @returns {Number}
     */
    get total () {
        return _total.get(this);
    }

    /**
	 * get logger
     * @returns {Function}
     */
    get logger () {
    	return _logger.get(this);
	}

    /**
	 * set the logger
     * @param {Function} logger
     */
	set logger (logger) {
    	_logger.set(this, logger);
	}

    /**
     * get progress as a raw number
     * @returns {Number} progress percent, eg 6.6666
     */
    get progress () {
        return _tracker.get(this) * 100 / _total.get(this);
    }

    /**
     * get progress as a string percentage
     * @returns {String} progress percent, eg '5%'
     */
    get progressString () {
        return `${parseInt(this.progress)}%`;
    }
}

module.exports = Acker;
