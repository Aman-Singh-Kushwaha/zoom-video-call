const router = require("express").Router();

const { v4: uuidv4 } = require('uuid'); 

router.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

router.get('/:room', (req, res) => {
  res.status(200).render('room', { roomId: req.params.room })
})

module.exports = router;