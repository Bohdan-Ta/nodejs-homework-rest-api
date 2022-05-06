const express = require('express');
const {
  registration,
  login,
  logout,
  verifyUser,
  reverifyEmail,
  getCurrent,
} = require('../../../controlers/auth');
const { validateBody } = require('../../../middlewares/validatioin');
const { authJoiSchema } = require('../contacts/contacts-validation');
const { wrapper: wrapperError } = require('../../../middlewares/error-handler');
const guard = require('../../../middlewares/guard');
const limiter = require('../../../middlewares/rate-limit');

const router = express.Router();

router.post(
  '/registration',
  limiter(15 * 60 * 1000, 10),
  wrapperError(registration),
);
router.post('/login', validateBody(authJoiSchema), wrapperError(login));
router.get('/verify/:token', wrapperError(verifyUser));
router.post('/verify', wrapperError(reverifyEmail));

router.post('/logout', guard, wrapperError(logout));
router.get('/current', guard, wrapperError(getCurrent));

module.exports = router;
