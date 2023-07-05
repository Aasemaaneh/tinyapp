//3. urls for each user
function urlsForUser(userId, urlDatabase) {
    const userURLs = {};
    for (const id in urlDatabase) {
      if (urlDatabase[id].userID === userId) {
        userURLs[id] = urlDatabase[id];
      }
    }
    return userURLs;
  }

  module.exports = urlsForUser;