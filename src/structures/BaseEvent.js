class BaseEvent {
  constructor (client, name, listener = (...args) => this.run(...args)) {
    this.client = client
    this.name = name
    this.listener = listener
    this.Discord = require('discord.js')
    this.baseStructure = __filename
  }

  async run () {}
}

module.exports = BaseEvent
