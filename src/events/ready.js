const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'ready',
      (...args) => this.run(...args)
    )
    this.dir = __filename
  }

  async run () {
    this.client.logger.info(`[Event:Ready] Logged as ${this.client.user.tag}(${this.client.user.id})`)
    this.client.user.setActivity({ name: `${this.client._options.bot.prefix}명령어 로 명령어들을 확인할 수 있어요!`, type: 'PLAYING' })
  }
}

module.exports = Event
