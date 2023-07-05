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

module.exports = getUserByEmail;