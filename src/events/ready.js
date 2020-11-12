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
    this.client.updateInterval = setInterval(() => this.updateGuildsSize(), 600000)
  }

  async updateGuildsSize () {
    if (this.client.shard.ids[0] !== 0) return
    try {
      const totalGuildsSize = await this.client.shard.broadcastEval('this.guilds.cache.size')
      const reduceGuildsSize = totalGuildsSize.reduce((prev, val) => prev + val)
      const result = await this.client.Bot.update(reduceGuildsSize)
      this.client.logger.info(`[KoreanBots:Update] Updated Guilds Size: (${reduceGuildsSize}) (${JSON.stringify(result)})`)
    } catch (e) {
      this.client.logger.error(`[KoreanBots:Update] Updating Guilds Size an Error! (${e.name})`)
    }
  }
}

module.exports = Event
