const Response = (err, message) => {
  try {
    if (err) {
      return { success: false, message: message };
    }
    return { success: true, data: message };
  } catch (error) {
    return { success: false, message: message };
  }
};

module.exports = Response;
