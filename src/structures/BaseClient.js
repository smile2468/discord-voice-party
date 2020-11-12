const { Client, Collection, Intents } = require('discord.js')
const path = require('path')
const Utils = require('../utils')
const { MyBot } = require('koreanbots')

class BaseClient extends Client {
  constructor (options) {
    super({
      disableMentions: 'everyone',
      ws: { intents: Intents.ALL }
    })

    this._options = options
    this.utils = Utils
    this.logger = new Utils.Logger(this)
    this.permissionChecker = new Utils.PermissionChecker(this)
    this.voiceUtils = new Utils.VoiceUtils(this)

    this.events = new Collection()
    this.commands = new Collection()
    this.aliases = new Collection()

    this.globAsync = require('util').promisify(require('glob'))
    this.wait = require('util').promisify(setTimeout)

    this.Bot = null
    this.updateInterval = null

    this.debug = process.argv[2] === '--debug'

    this.models_loaded = false
    this.commands_loaded = false
    this.events_loaded = false
    this.initialized = false

    this.shutting_down = false
  }

  async init () {
    this.logger.warn('[Init] Initializing...')
    await this.loadEvents()
    await this.loadCommands()
    await this.login(this._options.bot.token)

    if (this._options.koreanbots.token && this.shard.ids[0] === 0) {
      this.Bot = new MyBot(this._options.koreanbots.token, {
        clientID: this.user.id
      })
    }
  }

  async loadEvents (reload = false) {
    const ReloadOrLoad = `${this.events_loaded ? 'Reload' : 'Load'}`
    this.logger.debug(`[Event:${ReloadOrLoad}] ${ReloadOrLoad}ing Events...`)

    const loadEvents = await this.globAsync(path.join(process.cwd(), 'src/events/**/*.js'))
    this.logger.info(`[Event:${ReloadOrLoad}] ${ReloadOrLoad}ed Events: ${loadEvents.length}`)
    this.logger.info(`[Event:${ReloadOrLoad}] Event Files: (${loadEvents.join(' | ')})`)

    for (const file of loadEvents) {
      const Event = require(file)
      const event = new Event(this)
      if (reload) {
        const { listener } = this.events.get(event.name)
        if (listener) {
          this.removeListener(event.name, listener)
          this.logger.warn(`[Event:${ReloadOrLoad}] Removing Event Listener for Event ${event.name}`)
          this.events.delete(event.name)
        }
      }
      delete require.cache[require.resolve(file)]
      this.logger.info(`[Event:${ReloadOrLoad}] Added Event Listener for Event ${event.name}`)
      this.events.set(event.name, event)
      this.on(event.name, event.listener)
    }
    this.logger.info(`[Event:${ReloadOrLoad}] Successfully ${ReloadOrLoad}ed Events!`)
    this.events_loaded = true
    return this.events
  }

  async loadCommands () {
    const ReloadOrLoad = `${this.commands_loaded ? 'Reload' : 'Load'}`
    this.logger.debug(`[Command:${ReloadOrLoad}] ${ReloadOrLoad}ing Commands...`)

    const loadCommands = await this.globAsync(path.join(process.cwd(), 'src/commands/**/*.js'))
    this.logger.info(`[Command:${ReloadOrLoad}] ${ReloadOrLoad}ed Commands: ${loadCommands.length}`)
    this.logger.info(`[Command:${ReloadOrLoad}] Command Files: (${loadCommands.join(' | ')})`)

    for (const cmd of loadCommands) {
      const Command = require(cmd)
      const command = new Command(this)

      this.logger.debug(`[Command:${ReloadOrLoad}] Command Set: (${command.name})`)

      for (const aliases of command.aliases) {
        this.logger.debug(`[Command:${ReloadOrLoad}] Aliases Set: (${aliases}) of ${command.name}`)
        this.aliases.set(aliases, command)
      }
      delete require.cache[require.resolve(cmd)]
      this.commands.set(command.name, command)
    }
    this.logger.info(`[Command:${ReloadOrLoad}] Successfully ${ReloadOrLoad}ed Commands!`)
    this.commands_loaded = true
    return this.commands
  }

  async reload () {
    await this.loadEvents(true)
    await this.loadCommands()
    for (const util of await this.globAsync(path.join(process.cwd(), 'src/utils/**/*.js'))) if (!util.includes('voiceUtils.js')) delete require.cache[require.resolve(util)]
    for (const structure of await this.globAsync(path.join(process.cwd(), 'src/structures/**/*.js'))) if (!structure.includes('BaseClient.js')) delete require.cache[require.resolve(structure)]
    delete require.cache[require.resolve('../utils/constructors')]
    delete require.cache[require.resolve('../settings')]
    const { PermissionChecker, constructors } = require('../utils')
    this.utils.constructors = constructors
    this._options = require('../settings')
    this.permissionChecker = new PermissionChecker(this)
  }

  getRam () { return `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` }

  shutdown () {
    this.shutting_down = true
    this.voiceUtils.clearChannels().then(() => {
      this.client.logger.warn('[Shutdown] Shutting Down in 10 Seconds...')
      setTimeout(() => process.exit(0), 10000)
    })
    return this.shard ? this.shard.ids : 0
  }
}

new BaseClient(require('../settings')).init()

const logger = new Utils.Logger()
process.on('uncaughtException', error => logger.error(`[BaseClient:uncaughtException] ${error.stack || error}`))
process.on('unhandledRejection', (reason, promise) => logger.error(`[BaseClient:unhandledRejection] ${reason.stack || reason}`))

module.exports = BaseClient
