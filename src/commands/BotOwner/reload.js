const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'reload',
      ['리로드', 'ㄹㄹㄷ', 'flfhem', 'ㄱ디ㅐㅁㅇ', 'ffe'],
      'BotOwner',
      ['BotOwner'],
      '<없음>',
      '봇의 필요한 구성 요소들을 리로드합니다.',
      false,
      { voice: false, dm: false }
    )
    this.dir = __filename
  }

  async run (compressed) {
    const msg = await compressed.message.channel.send(`${this.client.utils.constructors.EMOJI_SANDCLOCK} Reloading at **Client**...`)
    try {
      await this.client.reload()
      await msg.edit(`${this.client.utils.constructors.EMOJI_YES} Reloaded at **Client**!`)
    } catch (e) {
      await msg.edit(`${this.client.utils.constructors.EMOJI_WARN} Reloading at **Client** an Error! \`(${e.name})\``)
      if (this.client.debug) await compressed.message.channel.send(e.stack, { code: 'js' })
    }
  }
}

module.exports = Command
