const mongoose = require('mongoose');

module.exports = {
  isEmpty: function(data) {
    return (
      data === undefined ||
      data === null ||
      (typeof data === 'object' && Object.keys(data).length === 0) ||
      (typeof data === 'string' && data.trim().length === 0)
    );
  },
  isObjectId: function(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
};
