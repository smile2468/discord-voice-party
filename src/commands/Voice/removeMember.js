const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '멤버제거',
      ['removemember', 'apaqjwprj', 'ㄱ드ㅐㅍ드드ㅠㄷㄱ'],
      'VOICE',
      ['Everyone'],
      '<멤버>',
      '멤버를 제거합니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message, args } = compressed
    const getChannel = this.client.voiceUtils.channels.get(this.client.voiceUtils.getFormatter(message.guild.id, message.author.id))
    if (!getChannel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ${message.author} 님이 생성한 채널은 존재하지 않습니다!`)
    // if (!getChannel.locked) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 해당 명령어는 채널이 **잠금** 상태일때만 가능합니다!`)
    const member = args[0]
    if (!member) return message.channel.send(this.argumentNotProvided())
    const getMember = message.guild.members.cache.get(message.mentions.members.first() ? message.mentions.members.first().id : this.mentionId(member))
    if (!getMember) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 해당 멤버를 찾을 수 없습니다!`)
    if (getMember.id === message.author.id) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 자신을 제거할 순 없습니다!`)
    const filterMember = getChannel.members.find(el => el === getMember.id)
    if (!filterMember) return message.channel.send(`> ${this.client.constructors.EMOJI_NO} 해당 멤버는 이미 추가되어 있지 않있습니다!`)
    await getChannel.vch.createOverwrite(getMember.id, { STREAM: false, VIEW_CHANNEL: false, CONNECT: false, SPEAK: false })
    getChannel.members = getChannel.members.filter(el => el !== getMember.id)
    if (getChannel.vch.members.get(getMember.id)) await getMember.voice.setChannel(null)
    await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} **${getMember.user.tag} 님**을 제거하였습니다! **(${getChannel.vch})**`)
  }
}

module.exports = Command
