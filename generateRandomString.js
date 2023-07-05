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

module.exports = generateRandomString;