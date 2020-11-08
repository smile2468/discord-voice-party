const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'guildDelete',
      (...args) => this.run(...args)
    )
  }

  async run (guild) {
    this.client.logger.info(`[Event:guildDelete] (${guild.id}) guild to leave.`)
  }
}

module.exports = Event
