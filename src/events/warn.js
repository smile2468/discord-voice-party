const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'warn',
      (...args) => this.run(...args)
    )
    this.dir = __filename
  }

  async run (info) { this.client.logger.error(`[Event:Warn] ${info}`) }
}

module.exports = Event
