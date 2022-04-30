const { HTTP_STATUS_CODE } = require('../../libs/constans');

const contactsService = require('../../servises/contacts');

const listContacts = async (req, res) => {
  const contacts = await contactsService.getAll(req.query, req.user);
  res.json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    payload: { ...contacts },
  });
};

const getContactById = async (req, res) => {
  const contact = await contactsService.getById(req.params.contactId, req.user);
  return res.json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    payload: { contact },
  });
};

const addContact = async (req, res) => {
  const contact = await contactsService.create(req.body, req.user);
  res.status(HTTP_STATUS_CODE.CREATED).json({
    status: 'success',
    code: HTTP_STATUS_CODE.CREATED,
    payload: { contact },
  });
};

const removeContact = async (req, res) => {
  const contact = await contactsService.remove(req.params.contactId, req.user);
  return res.json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    payload: { contact },
  });
};

const updateContact = async (req, res, next) => {
  const contact = await contactsService.update(
    req.params.contactId,
    req.body,
    req.user,
  );
  return res.json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    payload: { contact },
  });
};

const updateStatus = async (req, res) => {
  const contact = await contactsService.update(
    req.params.contactId,
    req.body,
    req.user,
  );
  return res.json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    payload: { contact },
  });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
};
