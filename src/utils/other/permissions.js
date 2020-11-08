const settings = require('../../settings')

/**
 * Discord Permissions
 * https://discord.com/developers/docs/topics/permissions
 */

module.exports = [
  {
    name: 'BotOwner',
    filter: (member) => settings.bot.owner.includes(member.id)
  },
  {
    name: 'GuildOwner',
    filter: (member) => settings.bot.owner.includes(member.id) || member.guild.owner.id === member.id
  },
  {
    name: 'Administrator',
    filter: (member) => settings.bot.owner.includes(member.id) || member.permissions.has(['ADMINISTRATOR'])
  },
  {
    name: 'Everyone',
    filter: () => true
  }
]
