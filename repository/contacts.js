const Contact = require('../models/contact');

const listContacts = async ({ limit, skip, sortCriteria, select }, user) => {
  const { docs: contacts, ...rest } = await Contact.paginate(
    { owner: user.id },
    { limit, offset: skip, sort: sortCriteria, select },
  );

  return { contacts, ...rest };
};

const getContactById = async (contactId, user) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: user.id,
  }).populate({
    path: 'owner',
    select: 'email',
  });
  return result;
};

const removeContact = async (contactId, user) => {
  const result = await Contact.findOneAndRemove({
    _id: contactId,
    owner: user.id,
  });
  return result;
};

const addContact = async (body, user) => {
  const result = await Contact.create({ ...body, owner: user.id });
  return result;
};

const updateContact = async (contactId, body, user) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: user.id },
    { ...body },
    { new: true },
  );

  return result;
};

const updateStatus = async (contactId, body, user) => {
  const { favorite } = body;
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: user.id,
    },
    { favorite },
    { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
};
