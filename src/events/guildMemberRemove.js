const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'guildMemberRemove',
      (...args) => this.run(...args)
    )
  }

  async run (member) {
    this.client.logger.info(`[Event:guildMemberRemove] (${member.id}) has left (${member.guild.id}) the guild.`)
  }
}

module.exports = Event
