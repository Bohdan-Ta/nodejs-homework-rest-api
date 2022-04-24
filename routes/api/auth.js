const express = require('exspress');
const { authJoiSchema } = require('../../middlewares/validatioin');
const { signup } = require('../../repository/auth');

const router = express.Router();

router.post('/signup', validation(authJoiSchema), signup);

module.export = router;
