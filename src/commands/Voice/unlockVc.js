const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '잠금해제',
      ['unlock', 'wkarmagowp', 'ㅕㅟㅐ차'],
      'VOICE',
      ['Everyone'],
      '<없음>',
      '음성 채널 잠금을 해제니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message } = compressed
    const getChannel = this.client.voiceUtils.channels.get(this.client.voiceUtils.getFormatter(message.guild.id, message.author.id))
    if (!getChannel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ${message.author} 님이 생성한 채널은 존재하지 않습니다!`)
    if (!getChannel.locked) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 이미 잠금해제 상태입니다! **(${getChannel.vch})**`)
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_UNLOCK} 해당 채널 잠금을 해제하였습니다! **(${getChannel.vch})**\n\`모든 유저가 입장할 수 있습니다.\``)
    await getChannel.vch.overwritePermissions([
      {
        id: message.author.id,
        allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MANAGE_CHANNELS']
      },
      {
        id: message.guild.id,
        allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM'],
        deny: ['MANAGE_CHANNELS']
      }
    ])
    getChannel.locked = false
    getChannel.roles = []
  }
}

module.exports = Command
