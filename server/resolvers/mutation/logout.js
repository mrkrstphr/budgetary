module.exports = async function logout(root, args, context) {
  return new Promise((resolve, reject) => {
    context.request.session.destroy((err) => {
      if (err) reject(err);
      else {
        context.response.clearCookie('sid', { path: '/' });
        resolve();
      }
    });
  });
};
