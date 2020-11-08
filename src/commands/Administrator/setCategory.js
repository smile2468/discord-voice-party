const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '카테고리설정',
      ['setcategory', 'zkxprhfltjfwjd', 'ㄴㄷㅅㅊㅁㅅㄷ해교'],
      'Administrator',
      ['Administrator'],
      '<카테고리>',
      '음성 채널이 생성될 카테고리를 설정합니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message, args } = compressed
    const category = args[0]
    if (!category) return message.channel.send(this.argumentNotProvided())
    if (isNaN(category)) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 카테고리 아이디는 **오로지 숫자**만 가능합니다!`)
    if (category === '없음') {
      const getCategory = this.client.voiceUtils.category.get(message.guild.id)
      getCategory.categoryId = null
      await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} 카테고리가 **없음** 으로 변경되었습니다!`)
    } else {
      const getCategory = this.client.voiceUtils.category.get(message.guild.id)
      const getChannel = message.guild.channels.cache.get(category)
      if (getChannel.type !== 'category') return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 오로지 **카테고리**로만 설정 가능합니다!`)
      if (!getCategory) this.client.voiceUtils.category.set(message.guild.id, { guildId: message.guild.id, categoryId: category })
      else getCategory.categoryId = category
      await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} 카테고리가 **${getChannel}** 으로 변경되었습니다!`)
    }
  }
}

module.exports = Command
