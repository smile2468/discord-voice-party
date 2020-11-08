const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'guildMemberAdd',
      (...args) => this.run(...args)
    )
  }

  async run (member) {
    this.client.logger.info(`[Event:guildMemberAdd] (${member.id}) has entered (${member.guild.id}) the guild.`)
  }
}

module.exports = Event
