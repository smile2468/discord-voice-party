const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'guildCreate',
      (...args) => this.run(...args)
    )
  }

  async run (guild) {
    this.client.logger.info(`[Event:guildCreate] Entered (${guild.id}) the guild.`)
  }
}

module.exports = Event
