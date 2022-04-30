// const { Conflict } = require('http-errors');
const { HTTP_STATUS_CODE } = require('../../libs/constans');
const authServise = require('../../servises/auth');

const registration = async (req, res) => {
  const user = await authServise.create(req.body);
  return res.status(HTTP_STATUS_CODE.CREATED).json({
    status: 'success',
    code: HTTP_STATUS_CODE.CREATED,
    date: { ...user },
  });
};

const login = async (req, res) => {
  const token = await authServise.login(req.body);
  return res.status(HTTP_STATUS_CODE.OK).json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    date: { token },
  });
};
const logout = async (req, res) => {
  await authServise.logout(req.user.id);
  return res.status(HTTP_STATUS_CODE.NO_CONTENT).json();
};

const getCurrent = async (req, res) => {
  const { id, email, subscription } = req.user;
  res.json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    date: { user: { id, email, subscription } },
  });
};

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
};
