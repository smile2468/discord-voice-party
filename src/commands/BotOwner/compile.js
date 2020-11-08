/* eslint-disable no-unused-vars */
const { BaseCommand } = require('../../structures')
const Discord = require('discord.js')
const child = require('child_process')
const util = require('util')
const sleep = util.promisify(setTimeout)
const moment = require('moment-timezone')
require('moment-duration-format')(moment)
moment.locale('ko-KR')

class Command extends BaseCommand {
  constructor (client) {
    super(
      client,
      'compile',
      ['cmd', 'eval'],
      'BotOwner',
      ['BotOwner'],
      '<Code>',
      '코드를 실행합니다',
      false,
      { voice: false, dm: false }
    )
    this.dir = __filename
  }

  async run (compressed) {
    const { message, args } = compressed
    const waitReaction = await message.react(this.client.utils.constructors.EMOJI_SANDCLOCK)
    const codeToRun = args.join(' ')
    const startTime = this.getNanoSecTime()
    let endTime
    try {
      // eslint-disable-next-line no-eval
      const evalPromise = (code) => new Promise((resolve, reject) => { try { resolve(eval(`(async () => { ${code} })()`)) } catch (e) { reject(e) } })
      const result = await Promise.race([this.timeout(15000), evalPromise(codeToRun)])
      endTime = this.getNanoSecTime() - startTime
      await message.react(this.client.utils.constructors.EMOJI_YES)
      await this.sendOver2000(util.inspect(result, { depth: 1 }), message, { code: 'js' })
    } catch (e) {
      endTime = this.getNanoSecTime() - startTime
      await message.react(this.client.utils.constructors.EMOJI_X)
      await this.sendOver2000(e.stack || e.message || e.name || e, message, { code: 'js' })
    } finally {
      await message.channel.send(`> \`Processing Time: ${endTime}ns, ${endTime / 1000000}ms\``)
      try {
        await waitReaction.remove()
      } catch {}
    }
  }

  async timeout (time) {
    await sleep(time)
    throw new Error('Execution Timed out.')
  }

  getNanoSecTime () {
    const hrTime = process.hrtime()
    return hrTime[0] * 1000000000 + hrTime[1]
  }
}

module.exports = Command
