const EventEmitter = require('events');

/**
 * A logger for a server - you decide how you want to handle message ;)
 * @private
 */
class Logger extends EventEmitter {
	/**
	 * Emits a log message.
	 * @param {string} msg The message to emit.
	 * @param {string} type The type of log message (info|warn|error.)
	 */
	message(message, type) {
		/**
		 * Log message event.
		 * @event Logger#message
		 * @type {object}
		 * @property {string} message The log message.
		 * @property {string} type The log type (info|warn|error.)
		 * @property {Date} date The date at which the event was emitted.
		 */
		this.emit('message', {
			message,
			type,
			date: new Date()
		});
	}
	/**
	 * Emits a log message with type 'info'.
	 * @param {string} msg The log message.
	 */
	info(message) { this.message(message, 'info'); }
	/**
	 * Emits a log message with type 'warn'.
	 * @param {string} msg The log message.
	 */
	warn(message) { this.message(message, 'warn'); }
	/**
	 * Emits a log message with type 'error', as well as an error event.
	 * @param {Error} msg The log message.
	 */
	error(error) {
		this.message(error.toString(), 'error');
		this.emit('error', error);
	}
}

module.exports = Logger;
