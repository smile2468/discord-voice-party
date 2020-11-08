const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '삭제',
      ['delete', 'tkrwp', 'ㅇ딛ㅅㄷ'],
      'VOICE',
      ['Everyone'],
      '<없음>',
      '자신이 생성한 채널을 삭제합니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message } = compressed
    const getChannel = this.client.voiceUtils.channels.get(this.client.voiceUtils.getFormatter(message.guild.id, message.author.id))
    if (!getChannel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ${message.author} 님이 생성한 채널은 존재하지 않습니다!`)
    const msg = await message.channel.send(`> ${this.client.utils.constructors.EMOJI_SANDCLOCK} 채널 사용을 정리하시겠습니까?`)
    const emojis = [this.client.utils.constructors.EMOJI_YES, this.client.utils.constructors.EMOJI_NO]
    for (const emoji of emojis) await msg.react(emoji)
    try {
      const collector = await msg.awaitReactions((reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id, { max: 1, time: 16000, erros: ['time'] })
      const collected = collector.first()
      if (collected.emoji.name === emojis[0]) {
        try { msg.reactions.removeAll() } catch (e) {}
        await msg.edit(`> ${this.client.utils.constructors.EMOJI_YES} 성공적으로 채널 사용을 마무리하였습니다!`)
        await this.client.voiceUtils.removeVoiceChannel(this.client.voiceUtils.channels.get(this.client.voiceUtils.getFormatter(message.guild.id, message.author.id)), false)
      }
      if (collected.emoji.name === emojis[1]) {
        try { msg.reactions.removeAll() } catch (e) {}
        await msg.edit(`> ${this.client.utils.constructors.EMOJI_NO} 작업을 취소하였습니다...`)
      }
    } catch (e) {
      message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 시간이 초과되었습니다!`)
    }
  }
}

module.exports = Command
