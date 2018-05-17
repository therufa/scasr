const express = require('express');
const router = express.Router();
const scanimage = require('../../scanimage')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Scasm' });
});

router.get('/image', async (req, res) => {
  res.contentType('image/jpeg')

  const image = await scanimage()

  res.end(image)
})

module.exports = router;
