const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'shutdown',
      ['셧다운', '노ㅕㅅ애주', 'tutekdns'],
      'BotOwner',
      ['BotOwner'],
      '<없음>',
      '봇을 종료합니다.',
      false,
      { voice: false, dm: false }
    )
    this.dir = __filename
  }

  async run (compressed) {
    await compressed.message.channel.send(`${this.client.utils.constructors.EMOJI_SLEEP} Shutting down (**Client**)...`)
    process.exit(0)
  }
}

module.exports = Command
