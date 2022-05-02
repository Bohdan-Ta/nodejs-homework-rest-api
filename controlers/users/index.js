const { HTTP_STATUS_CODE } = require('../../libs/constans');
const LocalStorage = require('../../servises/avatar/local-storage');
const AvatarServise = require('../../servises/avatar');

const avatar = async (req, res, next) => {
  const avatarServise = new AvatarServise(LocalStorage, req.file, req.user);
  const urlOfAvatar = await avatarServise.update();
  res.json({
    status: 'success',
    code: HTTP_STATUS_CODE.OK,
    payload: { avatar: urlOfAvatar },
  });
};

module.exports = { avatar };
