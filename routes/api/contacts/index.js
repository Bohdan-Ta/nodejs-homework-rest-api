const express = require('express');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
} = require('../../../controlers/contacts');

const {
  schemaCreateContact,
  favoriteJoiSchema,
} = require('./contacts-validation');

const { validateBody } = require('../../../middlewares/validatioin');
const guard = require('../../../middlewares/guard');

const { wrapper: wrapperError } = require('../../../middlewares/error-handler');

const router = express.Router();

router.get('/', guard, listContacts);

router.get('/:contactId', guard, wrapperError(getContactById));

router.post(
  '/',
  guard,
  validateBody(schemaCreateContact),
  wrapperError(addContact),
);

router.delete('/:contactId', guard, wrapperError(removeContact));

router.put(
  '/:contactId',
  guard,
  validateBody(schemaCreateContact),
  wrapperError(updateContact),
);

router.patch(
  '/:contactId/favorite',
  guard,
  validateBody(favoriteJoiSchema),
  wrapperError(updateStatus),
);

module.exports = router;
