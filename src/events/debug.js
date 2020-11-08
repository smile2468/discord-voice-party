const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'debug',
      (...args) => this.run(...args)
    )
    this.dir = __filename
  }

  async run (message) { this.client.logger.debug(message) }
}

module.exports = Event
