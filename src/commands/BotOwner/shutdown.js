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
    if (this.client.shard) {
      await compressed.message.channel.send(`> ${this.client.utils.constructors.EMOJI_MAILBOX} 모든 샤드 **${this.client.shard.count} 개**에 종료 신호를 보냅니다...`)
      const shards = await this.client.shard.broadcastEval('this.shutdown()')
      for (const shard of shards) {
        await compressed.message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} 샤드 ${shard} 번의 종료가 시작되었습니다.`)
      }
    } else {
      await compressed.message.channel.send(`> ${this.client.utils.constructors.EMOJI_MAILBOX} 종료 중...`)
      this.client.shutdown()
    }
  }
}

module.exports = Command
