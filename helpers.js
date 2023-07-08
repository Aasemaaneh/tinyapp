//1 .  to generate a random short URL ID
function generateRandomString() {
    const alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
      randomString += alphanumericChars[randomIndex];
    }
    return randomString;
}

//2.   to get user by email
function getUserByEmail(email, users) {
  for (const userId in users) {
      const user = users[userId];
      if (user.email === email) {
        return user;
      }
  }
  return undefined;
}
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
module.exports = {generateRandomString,
  getUserByEmail,
  urlsForUser
}


;