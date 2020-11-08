const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '담당자변경',
      ['transferauthor', 'ekaekdwkqusrud', 'ㅅㄱ문ㄹㄷㄱ며쇅'],
      'VOICE',
      ['Everyone'],
      '<멤버>',
      '담당자를 변경합니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message, args } = compressed
    const getChannel = this.client.voiceUtils.channels.get(this.client.voiceUtils.getFormatter(message.guild.id, message.author.id))
    if (!getChannel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ${message.author} 님이 생성한 채널은 존재하지 않습니다!`)
    const member = args[0]
    if (!member) return message.channel.send(this.argumentNotProvided())
    const getMember = message.guild.members.cache.get(message.mentions.members.first() ? message.mentions.members.first().id : this.mentionId(member))
    if (!getMember) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 해당 멤버를 찾을 수 없습니다!`)
    if (getMember.id === message.author.id) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 자신에게 양도할 수 없습니다!`)
    if (getMember.user.bot) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 봇에겐 양도할 수 없습니다!`)
    await getChannel.vch.createOverwrite(getMember.id, { STREAM: true, VIEW_CHANNEL: true, CONNECT: true, SPEAK: true, MANAGE_CHANNELS: true })
    await getChannel.vch.createOverwrite(message.author.id, { STREAM: true, VIEW_CHANNEL: true, CONNECT: true, SPEAK: true, MANAGE_CHANNELS: false })
    getChannel.members.push(message.author.id)
    getChannel.author = getMember.id
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} **${message.author} 님**에서  **${getMember.user.tag} 님**으로 담당자가 변경되었습니다! **(${getChannel.vch})**`)
  }
}

module.exports = Command
