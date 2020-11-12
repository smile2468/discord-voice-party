const Discord = require('discord.js')

class VoiceUtils {
  constructor (client) {
    this.client = client
    this.category = new Discord.Collection()
    this.channels = new Discord.Collection()
    this.destroyTimer = new Discord.Collection()
    this.destroyTimeout = 600000
  }

  async createVoiceChannel (message, userLimit, roleOrMembers = undefined) {
    // TODO: Filter Permissions and Create VoiceChannel in Category
    // const getFirstCategories = message.guild.channels.cache.filter(el => el.type === 'category').array()
    // const filterChannel = message.guild.channels.cache.filter(el => el.type === 'voice' && el.name.includes(message.author.username))
    if ((userLimit !== 0 && userLimit < 2) || userLimit > 99) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} 인원 제한은 **1명 이상**, **99명 이하**로 설정해주세요!`)
    const filterChannel = this.channels.get(this.getFormatter(message.guild.id, message.author.id))
    const getChannel = filterChannel ? message.guild.channels.cache.get(filterChannel.vchId) : undefined
    if (filterChannel && getChannel) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_NO} ${message.author} 님이 생성한 채널이 이미 존재합니다! **(${getChannel})**`)
    if (roleOrMembers && roleOrMembers.length <= 0) return message.channel.send(`> ${this.client.utils.constructors.EMOJI_THINKING} 역할 또는 멤버를 찾을 수 없어요!`)
    else if (filterChannel && !getChannel) {
      this.client.logger.warn(`[voiceUtils:createVoiceChannel] VoiceChannel is not Found! Destroying DestroyTimer and Create New VoiceChannel... (${message.guild.id}-${message.author.id})`)
      await this.removeDestroyTimer(filterChannel.guildId, filterChannel.vchId)
      this.channels.delete(this.getFormatter(filterChannel.guildId, filterChannel.author))
      return this.createVoiceChannel(message, userLimit, roleOrMembers)
    }
    try {
      await message.react(this.client.utils.constructors.EMOJI_SANDCLOCK)
      const parentId = this.category.get(message.guild.id)
      const result = await message.guild.channels.create(`${message.author.username}의 파티장`, {
        type: 'voice',
        userLimit,
        parent: parentId ? parentId.categoryId : null,
        permissionOverwrites: roleOrMembers
          ? [
            {
              id: message.author.id,
              allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MANAGE_CHANNELS']
            },
            {
              id: message.guild.id,
              deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MANAGE_CHANNELS']
            }
          ]
          : [
            {
              id: message.author.id,
              allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM', 'MANAGE_CHANNELS']
            },
            {
              id: message.guild.id,
              allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM'],
              deny: ['MANAGE_CHANNELS']
            }
          ]
      })
      this.channels.set(this.getFormatter(message.guild.id, message.author.id), {
        guildId: message.guild.id,
        tchId: message.channel.id,
        vchId: result.id,
        parentId: parentId ? parentId.categoryId : null,
        author: message.author.id,
        members: [],
        roles: [],
        locked: false,
        vch: result
      })
      if (roleOrMembers instanceof Array) {
        for (const item of roleOrMembers) {
          await result.createOverwrite(item.id, { STREAM: true, VIEW_CHANNEL: true, CONNECT: true, SPEAK: true, MANAGE_CHANNELS: false })
          const getChannel = this.channels.get(this.getFormatter(message.guild.id, message.author.id))
          getChannel.locked = true
          if (item.type === 'member') getChannel.members.push(item.id)
          if (item.type === 'role') getChannel.roles.push(item.id)
        }
      }
      await this.createDestroyTimer(message.guild.id, result.id)
      if (message.member.voice.channel) try { await message.member.voice.setChannel(result.id) } catch {}
      await message.reactions.removeAll()
      await message.channel.send(`> ${this.client.utils.constructors.EMOJI_YES} 성공적으로 채널이 생성되었습니다! **(${result.name})**`)
    } catch (e) {
      if (String(e).toLowerCase().includes('permission')) await message.channel.send(`> ${this.client.utils.constructors.EMOJI_WARN} 권한이 부족하여 채널을 생성하지 못했습니다!`)
      else await message.channel.send(`> ${this.client.utils.constructors.EMOJI_WARN} 알 수 없는 오류가 발생하였습니다! **(${e.name})**`)
      if (this.client.debug) await message.channel.send(`[voiceUtils:createVoiceChannel]\n\`\`\`js\n${e.stack}\n\`\`\``)
    }
  }

  async removeVoiceChannel (data, send = true) {
    // const getTch = this.client.guilds.cache.get(data.guildId).channels.cache.get(data.tchId)
    // const author = this.client.guilds.cache.get(data.guildId).members.cache.get(data.author)
    // if (!getTch) return
    // const getVch = this.client.guilds.cache.get(data.guildId).channels.cache.get(data.vchId)
    // if (!getVch) return this.removeDestroyTimer(data.guildId, data.vchId, true)
    // await getTch.send(`> ${this.client.utils.constructors.EMOJI_STOPWATCH} **10분** 동안 통화방에 유저가 없어, **${author || '알 수 없음'} 님**의 통화방이 삭제되었습니다.`)
    // try {
    //   this.client.logger.debug(`[voiceUtils:removeVoiceChannel] Removed VoiceChannel (guildId: ${data.guildId}, vchId: ${data.vch.id}, author: ${data.author})`)
    //   await this.removeDestroyTimer(data.guildId, data.vchId)
    //   await getVch.remove()
    //   const getChannel = this.channels.get(this.getFormatter(data.guildId, data.author))
    //   if (getChannel) this.channels.delete(this.getFormatter(data.guildId, data.author))
    // } catch (e) {
    //   this.client.logger.error(`[voiceUtils:removeVoiceChannel] Removing VoiceChannel an Error!\n${e.stack}`)
    //   await getTch.send(`> ${this.client.utils.constructors.EMOJI_WARN} 권한이 부족하여 채널을 제거하지 못했습니다! **(${getVch || '알 수 없음'})**`)
    // }
    this.client.logger.debug(`[voiceUtils:removeVoiceChannel] Removing VoiceChannel... (${data.guildId}-${data.vchId})`)
    const getTch = this.client.guilds.cache.get(data.guildId).channels.cache.get(data.tchId)
    const getVch = this.client.guilds.cache.get(data.guildId).channels.cache.get(data.vchId)
    const getAuthor = this.client.guilds.cache.get(data.guildId).members.cache.get(data.author)
    if (getVch) {
      try {
        await getVch.delete()
        await this.removeDestroyTimer(data.guildId, data.vchId)
        if (getTch && send) await getTch.send(`> ${this.client.utils.constructors.EMOJI_STOPWATCH} **${this.destroyTimeout / 60000}분** 동안 통화방에 유저가 없어, **${getAuthor || '알 수 없음'} 님**의 통화방이 정리되었습니다.`)
      } catch (e) {
        await getTch.send(`> ${this.client.utils.constructors.EMOJI_WARN} 권한이 부족하여 채널을 제거하지 못했습니다! **(${getVch || '알 수 없음'})**`)
        if (this.client.debug) await getTch.send(e.stack, { code: 'js' })
      }
      const getChannel = this.channels.get(this.getFormatter(data.guildId, getAuthor.id))
      if (getChannel) this.channels.delete(this.getFormatter(data.guildId, getAuthor.id))
    }
  }

  async createDestroyTimer (guild, channel) {
    this.client.logger.debug(`[voiceUtils:createDestroyTimer] Creating DestroyTimer... (${guild}-${channel})`)
    const getChannel = this.channels.filter(el => el.guildId === guild && el.vchId === channel).first()
    if (!getChannel) return this.client.logger.info(`[voiceUtils:createDestroyTimer] Not Found VoiceChannel! (${guild}-${channel})`)
    this.destroyTimer.set(
      this.getFormatter(guild, channel),
      setTimeout(() => {
        this.removeDestroyTimer(guild, channel)
        this.removeVoiceChannel(getChannel, true)
        const getTimer = this.destroyTimer.get(this.getFormatter(guild, channel))
        if (getTimer) this.destroyTimer.delete(this.getFormatter(guild, channel))
      }, this.destroyTimeout))
  }

  async removeDestroyTimer (guild, channel, force = false) {
    this.client.logger.debug(`[voiceUtils:removeDestroyTimer] Destroying DestroyTimer... (${guild}-${channel}) (force: ${force})`)
    const getTimer = this.destroyTimer.get(this.getFormatter(guild, channel))
    if ((!force && !getTimer) || (force && !getTimer)) return this.client.logger.info(`[voiceUtils:removeDestroyTimer] DestroyTimer is Not Found! (${guild}-${channel}) (force: ${force})`)
    if ((!force && getTimer) || (force && getTimer)) {
      clearTimeout(getTimer)
      this.destroyTimer.delete(this.getFormatter(guild, channel))
    }
  }

  async clearChannels () {
    for (const data of this.channels.array()) {
      this.client.logger.info(`[voiceUtils:clearChanneks] Removing Channel... (${data.guildId}-${data.vchId})`)
      await this.removeVoiceChannel(data)
    }
  }

  getFormatter (...args) { return args.join('-') }
}

module.exports = VoiceUtils
