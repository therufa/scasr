const { spawn } = require('child_process')
const path = require('path')
const { Writable } = require('stream')


class WritableImageStream extends Writable {
  constructor(...args) {
    super(...args)

    this.buffer = []
  }

  _write(chunk, enc, next) {
    this.buffer.push(chunk)
    return next()
  }

  _final(next) {
    this.emit('finish', undefined, Buffer.concat(this.buffer))
  }
}

const buildArgs = (opts = {}) => {
  return Object.keys(opts).reduce((agg, key) => [...agg, `--${key}`, opts[key]], [])
}

module.exports = function scan(opts) {
  const args = buildArgs(opts)
  const buff = new WritableImageStream()

  const scan = spawn('bash', ['./scan.sh', ...args])

  const promise = new Promise((resolve, reject) => {
    scan.on('close', (code, sig) => {
      if (code !== 0) {
        reject(`unexpected error: ${sig}`)
      }
    })

    buff.on('finish', (err, buffer) => {
      if (err) {
        reject(err)
      }

      if (buffer.length) {
        resolve(buffer)
      }
    })

    buff.on('error', (err) => {
      reject(err)
    })
  })

  scan.stdout.pipe(buff)
  
  return promise
}
