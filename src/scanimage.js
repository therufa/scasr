const { spawn } = require('child_process')
const path = require('path')
const { Writable } = require('stream')


class WritableImageStream extends Writable {
  constructor(cb, ...args) {
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

module.exports = function scan() {
  const scan = spawn('bash', ['./scan.sh', 'yoga.jpg'])
  const buff = new WritableImageStream()

  const promise = new Promise((resolve, reject) => {
    buff.on('finish', (err, buffer) => {
      resolve(buffer)
    })

    buff.on('error', (err) => {
      reject(err)
    })
  })

  scan.stdout.pipe(buff)
  
  return promise
}
