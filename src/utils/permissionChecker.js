const Discord = require('discord.js')

class PermissionsChecker {
  constructor (client) {
    this.client = client
    this.permissions = require('./other/permissions')
  }

  chkPerms (member) {
    const result = []
    for (const perm of this.permissions) if (perm.filter(member)) result.push(perm.name)
    return result
  }

  chkChPerms (client, channel, permissions) {
    if (channel instanceof Discord.Channel) return channel.permissionsFor(client.user.id).has(permissions)
    else return this.client.logger.error('[PermissionsChecker:chkChPerms] Channel tpye is only Discord Channel!')
  }
}

module.exports = PermissionsChecker
