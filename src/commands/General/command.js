const { BaseCommand } = require('../../structures')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      '명령어',
      ['commands', 'audfuddj', '채ㅡㅡ뭉ㄴ'],
      'GENERAL',
      ['Everyone'],
      '<명령어>',
      '명령어에 대한 도움말을 봅니다.',
      false,
      { voice: false, dm: false }
    )
  }

  async run (compressed) {
    const { message, args } = compressed
    const command = args[0]
    const categories = {
      List: ['GENERAL', 'VOICE', 'BotOwner'],
      Convert: (emoji = false) => {
        return emoji ? {
          GENERAL: `${this.client.utils.constructors.EMOJI_PERSON} 일반`,
          VOICE: `${this.client.utils.constructors.EMOJI_MUSIC} 음성`,
          BotOwner: `${this.client.utils.constructors.EMOJI_HAMMER} 개발자`
        } : {
          GENERAL: '일반',
          VOICE: '음성',
          BotOwner: '개발자'
        }
      }
    }
    const Embed = new this.Discord.MessageEmbed()
      .setColor(this.client._options.colors.default)
    if (!command) {
      Embed.setTitle(`${this.client.user.username} 봇의 명령어`)
        .setDescription(`명령어의 자세한 도움말을 확인하시려면, \`${compressed.data.prefix}${this.name} <명령어>\` 를 사용해주세요.`)
      for (const item of categories.List) {
        const Commands = this.client.commands.filter(el => String(el.category).toUpperCase() === String(item).toUpperCase())
        Embed.addField(categories.Convert(true)[item], Commands.keyArray().length < 1 ? '`명령어가 존재하지 않습니다`' : '`' + Commands.keyArray().join('`, `') + '`')
      }
    } else {
      const Command = this.client.commands.get(command) || this.client.aliases.get(command)
      if (!Command) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 해당 명령어는 존재하지 않습니다!\n\`명령어를 확인하시려면, ${compressed.data.prefix}${this.name} 을 이용해주세요.\``)
      Embed.setTitle(`명령어 정보 :: ${Command.name}`)
        .addFields([
          {
            name: `${this.client.utils.constructors.EMOJI_PAPER} 명령어 설명`,
            value: this.codeBlock(this.replaceHolder(Command.name, Command.description), 'fix'),
            inline: false
          },
          {
            name: `${this.client.utils.constructors.EMOJI_ALERT} 명령어 사용법`,
            value: this.codeBlock(this.replaceHolder(Command.name, Command.usage), 'fix'),
            inline: false
          },
          {
            name: `${this.client.utils.constructors.EMOJI_PIN} 명령어 단축키`,
            value: '`' + Command.aliases.join('`, `') + '`',
            inline: true
          }
        ])
    }
    message.channel.send(Embed)
  }
}

module.exports = Command
