class BaseCommand {
  constructor (client, name, aliases, category, permissions, usage, description, hide, required) {
    this.client = client
    this.name = name
    this.aliases = aliases
    this.category = category
    this.permissions = permissions
    this.usage = `%PREFIX%%COMMAND% ${usage}`
    this.description = description
    this.hide = hide
    this.required_voice = required.voice
    this.required_dm = required.dm
    this.Discord = require('discord.js')
    this.baseStructure = __filename
  }

  async run (compressed) {}
  codeBlock (message, type) { return `\`\`\`${type}\n${message}\n\`\`\`` }
  mentionId (id) { return String(id).replace(/<|@|#|&|!|>/gi, '') }
  replaceHolder (commandName, text) { return text.replace(/%PREFIX%/gi, this.client._options.bot.prefix).replace(/%COMMAND%/gi, commandName) }
  argumentNotProvided (cmdName = this.name, cmdUsage = this.usage) {
    let result
    if (!cmdUsage.startsWith('%PREFIX%%COMMAND%')) result = `${this.client.utils.constructors.EMOJI_ALERT} **명령어 사용법**\n>>> ${this.codeBlock(this.replaceHolder(cmdName, `%PREFIX%%COMMAND% ${cmdUsage}`), 'fix')}`
    else result = `${this.client.utils.constructors.EMOJI_ALERT} **명령어 사용법**\n>>> ${this.codeBlock(this.replaceHolder(cmdName, cmdUsage), 'fix')}`
    return result
  }

  async sendOver2000 (content, message, options = {}) {
    if (content.length < 1990) return message.channel.send(content, options)
    const messagesList = []
    while (content.length > 1990) {
      let index = content.lastIndexOf('\n\n', 1990)
      if (index === -1) { index = content.lastIndexOf('\n', 1990) }
      if (index === -1) { index = content.lastIndexOf(' ', 1990) }
      if (index === -1) { index = 1990 }
      messagesList.push(await message.channel.send(content.substring(0, index), options))
      content = content.substring(index).trim()
    }
    messagesList.push(await message.channel.send(content, options))
    return messagesList
  }
}

module.exports = BaseCommand
