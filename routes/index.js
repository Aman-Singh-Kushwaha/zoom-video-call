const router = require("express").Router();

router.use("/", (req, res) => {
  res.status(200).render('room');
});

module.exports = router;