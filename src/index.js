const scan = require('./scanimage')
const fs = require('fs')

scan().then(imageBuffer => {
  fs.open('yay.jpg', 'w', (err, fd) => {
    fs.write(fd, imageBuffer, () => { })
  })
})

