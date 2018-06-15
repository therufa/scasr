const express = require('express');
const router = express.Router();
const scanimage = require('../../scanimage')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Scasm' });
})

router.get('/scan', async (req, res, next) => {
  const { query: {
    mode = undefined,
    brightness = undefined
  } } = req

  const opts = {
    mode,
    brightness
  }

  try {
    const image = await scanimage(opts)

    res.contentType('image/jpeg')
    res.end(image)
  } catch (err) {
    next(err)
  }
})

module.exports = router;
