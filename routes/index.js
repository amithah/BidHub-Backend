const express = require("express");
const { upload } = require("../controllers/uploadController");
const router = express.Router();

router.use(require("./auth"));
router.use(require("./users"));
router.use(require("./item"));
router.use(require("./auction"));
router.use(require("./bid"));

router.post('/upload',upload);


module.exports = router;
