const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '잠금',
      ['lock', 'wkarma', 'ㅣㅐ차'],
      'VOICE',
      ['Everyone'],
      '<없음>',
      '음성 채널을 잠굽니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message } = compressed
    const getChannel = this.client.voiceUtils.channels.get(this.client.voiceUtils.getFormatter(message.guild.id, message.author.id))
    if (!getChannel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ${message.author} 님이 생성한 채널은 존재하지 않습니다!`)
    if (getChannel.locked) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 이미 잠금 상태입니다! **(${getChannel.vch})**`)
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_LOCK} 해당 채널을 잠궜습니다! **(${getChannel.vch})**\n\`현재 입장한 유저 빼곤 입퇴장 할 수 없습니다.\``)
    const user = []
    const arr = []
    for (const member of getChannel.vch.members.array()) {
      if (member.id === getChannel.author) {
        arr.push({
          id: member.id,
          allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MANAGE_CHANNELS']
        })
        arr.push({
          id: message.guild.id,
          deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MANAGE_CHANNELS']
        })
      } else {
        arr.push({
          id: member.id,
          allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM'],
          deny: ['MANAGE_CHANNELS']
        })
      }
      user.push(member.user.tag)
    }
    getChannel.locked = true
    getChannel.roles = []
    await getChannel.vch.overwritePermissions(arr)
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} **${user.length} 명**을 등록하였습니다.\n\`${user.join(', ')}\``)
  }
}

module.exports = Command
