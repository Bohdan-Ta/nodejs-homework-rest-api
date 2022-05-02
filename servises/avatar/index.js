const Jimp = require('jimp');

class AvatarServise {
  constructor(Storage, file, user) {
    this.storage = new Storage(file, user);
    this.pathFile = file.path;
    this.user = user;
  }

  async update() {
    await this.transform(this.pathFile);
    const urlOfAvatar = await this.storage.save();
    return urlOfAvatar;
  }

  async transform(pathFile) {
    const picture = await Jimp.read(pathFile);
    await picture
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_CENTER,
      )
      .writeAsync(pathFile);
  }
}

module.exports = AvatarServise;
