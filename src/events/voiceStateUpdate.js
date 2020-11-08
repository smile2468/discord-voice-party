const { BaseEvent } = require('../structures')

class Event extends BaseEvent {
  constructor (client) {
    super(
      client,
      'voiceStateUpdate',
      (...args) => this.run(...args)
    )
    this.dir = __filename
  }

  async run (oldMember, newMember) {
    /**
     * newMemberJoin - {"guild":"533714165869576198","id":"267658832291823626","serverDeaf":false,"serverMute":false,"selfDeaf":false,"selfMute":false,"selfVideo":false,"sessionID":"b06025e7e344f33b65d1b098c1597b4f","streaming":false,"channel":"653995411182321674"}
     * oldMemberJoin - {"guild":"533714165869576198","id":"267658832291823626","serverDeaf":null,"serverMute":null,"selfDeaf":null,"selfMute":null,"selfVideo":null,"sessionID":null,"streaming":false,"channel":null}
     *
     * newMemberLeave - {"guild":"533714165869576198","id":"267658832291823626","serverDeaf":false,"serverMute":false,"selfDeaf":false,"selfMute":false,"selfVideo":false,"sessionID":"b06025e7e344f33b65d1b098c1597b4f","streaming":false,"channel":null}
     * oldMemberLeave - {"guild":"533714165869576198","id":"267658832291823626","serverDeaf":false,"serverMute":false,"selfDeaf":false,"selfMute":false,"selfVideo":false,"sessionID":"b06025e7e344f33b65d1b098c1597b4f","streaming":false,"channel":"653995411182321674"}
     */
    if (newMember.channel) {
      const getChannel = this.client.voiceUtils.channels.filter(el => el.guildId === newMember.guild.id && el.vchId === newMember.channel.id).first()
      const getDestroyTimer = this.client.voiceUtils.destroyTimer.get(this.getFormatter(newMember.guild.id, newMember.channel.id))
      if (getChannel && !getDestroyTimer) return this.client.logger.info(`[Event:voiceStateUpdate] [newMember:Join] DestroyTimer is not Found! (${newMember.guild.id}-${newMember.channel.id})`)
      if (getChannel && getDestroyTimer) {
        if (getChannel.vch.members.size > 0) {
          this.client.logger.info(`[Event:voiceStateUpdate] VoiceChannel has DestroyTimer, Removing DestroyTimer... (${newMember.guild.id}-${newMember.channel.id})`)
          this.client.voiceUtils.removeDestroyTimer(newMember.guild.id, newMember.channel.id)
        }
      }
    }
    if (oldMember.channel) {
      const getChannel = this.client.voiceUtils.channels.filter(el => el.guildId === oldMember.guild.id && el.vchId === oldMember.channel.id).first()
      const getDestroyTimer = this.client.voiceUtils.destroyTimer.get(this.getFormatter(oldMember.guild.id, oldMember.channel.id))
      if (getChannel && getDestroyTimer) return this.client.logger.info(`[Event:voiceStateUpdate] [oldMember:Leave] DestroyTimer is Found! (${oldMember.guild.id}-${oldMember.channel.id})`)
      if (getChannel && !getDestroyTimer) {
        if (getChannel.vch.members.size <= 0) {
          this.client.logger.info(`[Event:voiceStateUpdate] VoiceChannel is not has DestroyTimer, Creating DestroyTimer... (${oldMember.guild.id}-${oldMember.channel.id})`)
          this.client.voiceUtils.createDestroyTimer(oldMember.guild.id, oldMember.channel.id)
        }
      }
    }
  }

  getFormatter (...args) { return args.join('-') }
}

module.exports = Event
