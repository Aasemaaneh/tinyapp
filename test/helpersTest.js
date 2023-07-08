const { assert } = require('chai');
const {undefined, getUserByEmail, urlsForUser} = require("../helpers");


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

  it('should return Null for a non-existent email', function() {
    const user = getUserByEmail("nonexistent@example.com", testUsers);
    assert.isUndefined(user);
  });
});



const urlDatabase = {
  "abc123": { longURL: "https://example.com", userID: "userRandomID" },
  "def456": { longURL: "https://google.com", userID: "user2RandomID" },
  "ghi789": { longURL: "https://facebook.com", userID: "userRandomID" },
  "jkl012": { longURL: "https://twitter.com", userID: "userRandomID" },
  "mno345": { longURL: "https://instagram.com", userID: "user2RandomID" }
};

describe('urlsForUser', function() {
  it('should return an object with URLs for a given user ID', function() {
    const userId = "userRandomID";
    const expectedURLs = {
      "abc123": { longURL: "https://example.com", userID: "userRandomID" },
      "ghi789": { longURL: "https://facebook.com", userID: "userRandomID" },
      "jkl012": { longURL: "https://twitter.com", userID: "userRandomID" }
    };
    const userURLs = urlsForUser(userId, urlDatabase);
    assert.deepEqual(userURLs, expectedURLs);
  });

  it('should return an empty object for a user with no URLs', function() {
    const userId = "user3RandomID";
    const userURLs = urlsForUser(userId, urlDatabase);
    assert.deepEqual(userURLs, {});
  });

  it('should return an empty object if the URL database is empty', function() {
    const userId = "userRandomID";
    const emptyDatabase = {};
    const userURLs = urlsForUser(userId, emptyDatabase);
    assert.deepEqual(userURLs, {});
  });

  it('should return an empty object if the user ID is not found in the URL database', function() {
    const userId = "nonexistentID";
    const userURLs = urlsForUser(userId, urlDatabase);
    assert.deepEqual(userURLs, {});
  });
});

