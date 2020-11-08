const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '이름변경',
      ['rename', 'dlfmaqusrud', 'ㄱ두믇'],
      'VOICE',
      ['Everyone'],
      '<텍스트>',
      '채널 이름을 변경합니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message, args } = compressed
    const getChannel = this.client.voiceUtils.channels.get(this.client.voiceUtils.getFormatter(message.guild.id, message.author.id))
    if (!getChannel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ${message.author} 님이 생성한 채널은 존재하지 않습니다!`)
    const string = args.join(' ')
    if (!string) return message.channel.send(this.argumentNotProvided())
    if (string.length > 15) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} **15자 이하**로 입력해주세요!`)
    const getPromise = new Promise((resolve, reject) => { try { resolve(`(async () => { await ${getChannel.vch.setName(string)} })()`) } catch (e) { reject(e) } })
    try {
      await Promise.race([this.timeout(message, 8500), getPromise])
      await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} 채널 이름을 변경하였습니다! **(${string})**\n\`직접 채널 설정을 통하여, 이름을 변경할 수 있습니다.\``)
    } catch (e) {
      await message.channel.send(`> ${this.client.utils.constructors.EMOJI_WARN} 알 수 없는 오류가 발생하여, 채널 이름을 변경하지 못하였습니다!\n\`직접 채널 설정을 통하여, 이름을 변경하여주세요.\``)
    }
  }

  async timeout (message, time) {
    await this.client.wait(time)
    throw new Error('Execution Timed out.')
  }
}

module.exports = Command
