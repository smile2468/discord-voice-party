const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'message',
      (...args) => this.run(...args)
    )
    this.dir = __filename
  }

  async run (message) {
    if (!(message.author.bot || message.system || message.channel.type === 'dm')) {
      if (message.guild && message.guild.ownerID !== message.author.id && !(message.member || message.guild.members.cache.get(message.author.id))) {
        await message.guild.members.fetch(message.author.id)
        await this.client.users.fetch(message.member.id)
      }
      if (message.guild && message.guild.ownerID === message.author.id && !(message.member || message.guild.members.cache.get(message.guild.ownerID))) {
        await message.guild.members.fetch(message.guild.ownerID)
        await this.client.users.fetch(message.member.id)
      }
    }
    await this.commandHandler(message)
  }

  async commandHandler (message) {
    if (message.author.bot || message.system) return
    const { prefix } = this.client._options.bot
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const Command = this.client.commands.get(command) || this.client.aliases.get(command)

    if (message.content.startsWith(prefix) && Command) {
      if (!Command.required_dm && message.channel.type === 'dm') return message.channel.send(`${this.client.utils.constructors.EMOJI_NO} Commands are not available on **DM** Channels!`)
      if (Command.required_voice && !message.member.voice.channel) {
        if (await this.client.audio._guildBotFilter(message, args[0]) === this.client.user.id) return message.channel.send(`${this.client.utils.constructors.EMOJI_NO} 먼저 음설 채널에 입장 후, 명령어를 입력해주세요!`)
      }
      let count = 0
      const permissions = this.client.permissionChecker.chkPerms(message.member)
      for (const perm of permissions) {
        if (Command.permissions.includes(perm)) {
          count++
          this.client.logger.debug(`[Event:Message:commandHandler] Execute Command... (Member: ${message.guild.id}-${message.author.id}) (Command: ${Command.name})`)
          try {
            await Command.run({ message, args, data: { prefix, permissions } })
          } catch (error) {
            this.client.logger.error(`[Event:Message:commandHandler] Error executing command! (Error: ${error.name}, ${error.stack})-(${message.guild.id}, ${message.channel.id}, ${message.id}, ${message.author.id})`)
            await message.channel.send(`>>> ${this.client.utils.constructors.EMOJI_WARN} 알 수 없는 오류가 발생하였습니다! \`오류 코드: ${error.name}\``)
            if (this.client._options.bot.owner.includes(message.author.id) && this.client.debug) await message.channel.send(error.stack, { code: 'js' })
          }
        }
      }
      if (count === 0) return message.channel.send(`${this.client.utils.constructors.EMOJI_NO} 해당 명령어를 사용하려면 다음 권한이 필요합니다! (\`${Command.permissions.join('`, `')}\`)`)
    }
  }
}

module.exports = Event
