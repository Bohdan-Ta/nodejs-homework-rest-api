const express = require('express');
const { avatar } = require('../../../controlers/users');
const { wrapper: wrapperError } = require('../../../middlewares/error-handler');
const guard = require('../../../middlewares/guard');
const upload = require('../../../middlewares/upload');

const router = express.Router();

router.patch('/avatar', guard, upload.single('avatar'), wrapperError(avatar));

module.exports = router;
