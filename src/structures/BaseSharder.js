const { ShardingManager } = require('discord.js')
const path = require('path')
const settings = require('../settings')
const Logger = new (require('../utils/Logger'))()

const sharder = new ShardingManager(path.join(process.cwd(), 'src/structures/BaseClient.js'), {
  token: settings.bot.token,
  totalShards: 5,
  respawn: true
})

sharder.on('shardCreate', (shard) => {
  setUpEvents(shard)
  Logger.info(`[Sharder] Successfully Launched Shard of ${shard.id}`)
})

sharder.spawn()

function setUpEvents (shard) {
  shard.on('ready', () => {
    if (sharder.totalShards - 1 === shard.id) {
      Logger.info(`[Sharder] Successfully Launched All Shards! (${sharder.totalShards} Shards)`)
    }
    Logger.info(`[Shard ${shard.id}] Shard is Ready.`)
  })
  shard.on('error', (error) => {
    Logger.error(`[Shard ${shard.id}] ${error}`)
  })
  shard.on('reconnecting', () => Logger.warn(`[Shard ${shard.id}] Shard reconnecting`))
  shard.on('spawn', () => Logger.info(`[Shard ${shard.id}] Shard spawned`))
  shard.on('death', () => Logger.warn(`[Shard ${shard.id}] Shard death`))
  shard.on('disconnect', () => Logger.warn(`[Shard ${shard.id}] Shard disconnected`))
}

module.exports = sharder
