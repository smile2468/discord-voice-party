const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '생성',
      ['create', 'todtjd', 'ㅊㄱㄷㅁㅅㄷ'],
      'VOICE',
      ['Everyone'],
      '<없음|인원|역할|멤버>',
      '음성 채널을 생성합니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message, args } = compressed
    const userLimit = args.join(' ')
    const arr = []
    // if (!userLimit) return message.channel.send(this.argumentNotProvided())
    if ((/[0-9]/g.test(userLimit) && (userLimit.length !== 1 && userLimit.length > 2)) || isNaN(userLimit) || (isNaN(userLimit) && userLimit.includes('<') && userLimit.includes('>'))) {
      for (const item of userLimit.split(' ').map(el => this.mentionId(el))) {
        const getRoleOrMember = message.guild.members.cache.get(item)
          ? { type: 'member', get: message.guild.members.cache.get(item) }
          : message.guild.roles.cache.get(item)
            ? { type: 'role', get: message.guild.roles.cache.get(item) }
            : { type: 'unknown', get: undefined }
        if (getRoleOrMember.get && getRoleOrMember.get.id !== message.author.id) arr.push({ type: getRoleOrMember.type, id: getRoleOrMember.get.id })
      }
      return this.client.voiceUtils.createVoiceChannel(message, 0, arr)
    }
    if (!userLimit) return this.client.voiceUtils.createVoiceChannel(message, 0)
    else return this.client.voiceUtils.createVoiceChannel(message, userLimit)
  }
}

module.exports = Command
