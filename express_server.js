const express = require("express");
const app = express();
//const cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080

//Helperfunctions:
const urlsForUser = require("./urlsForUser");
const getUserByEmail = require("./getUserByEmail");
const generateRandomString = require("./generateRandomString");

// Middleware
app.set("view engine", "ejs"); //This tells the Express app to use EJS as its templating engine.ad
app.use(express.urlencoded({ extended: true })); //translate, or parse the body. This feature is part of Express.
//app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['secretKey'], // Replace with your own secret key(s)
    maxAge: 24 * 60 * 60 * 1000 // Cookie expiration time (24 hours in this example)
  }));

// Database 
//urls
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
//create user objects :
const users = {
    userRandomID: {
      id: "userRandomID",
      email: "user@example.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
    },
    user2RandomID: {
      id: "user2RandomID",
      email: "user2@example.com",
      password: bcrypt.hashSync("dishwasher-funk", 10),
    },
    aJ48lW: {
        id: "aJ48lW", //to match urls id
        email: "test@test.com",
        password: bcrypt.hashSync("TtT", 10),
      },
  };


//Routing on Server

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Sending Data to urls_index.ejs
app.get("/urls", (req, res) => {
    //const userId = req.cookies.user_id;
    const userId = req.session.user_id;
    if (!userId) {
      res.send("<html><body>Please <a href='/login'>login</a> or <a href='/register'>register</a> to access URLs.</body></html>");
      return;
    }

    const templateVars = {
        urls: urlsForUser(userId,urlDatabase),//urlDatabase,
        user: users[userId]
    };
    //console.log(templateVars);
    res.render("urls_index", templateVars);
});

//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
    //const userId = req.cookies.user_id;
    const userId = req.session.user_id;
    if(userId) {
      const templateVars = {
          user: users[userId]};
      res.render("urls_new",templateVars);
    } else {
        res.redirect('/login');
    }
});

app.get("/urls/:id", (req, res) => {
    //const userId = req.cookies.user_id;
    const userId = req.session.user_id;
    const id = req.params.id;    
    if (!userId) {
        res.status(401).send("<html><body>Please <a href='/login'>login</a> or <a href='/register'>register</a> to access this URL.</body></html>");
        return;
      }

      const userURLs = urlsForUser(userId,urlDatabase);
    if (!userURLs[id]) {
      res.status(403).send("<html><body>You don't have permission to access this URL.</body></html>");
      return;
      }
    const templateVars = { 
      id: id,
      longURL: userURLs[id].longURL,
      user: users[userId]
};
  res.render("urls_show", templateVars);
});


app.post("/urls/:id", (req, res) => {
  //const userId = req.cookies.user_id;
  const userId = req.session.user_id;
  const id = req.params.id;

  if (!userId) {
    res.status(401).send("<html><body>Please <a href='/login'>login</a> or <a href='/register'>register</a> to access this URL.</body></html>");
    return;
  }

  const userURLs = urlsForUser(userId,urlDatabase);
  if (!userURLs[id]) {
    res.status(403).send("<html><body>You don't have permission to access this URL or the URL does't exist.</body></html>");
    return;
  }
  const updatedURL = req.body.longURL;
  userURLs[id].longURL = updatedURL;
  res.redirect("/urls");
});

app.post("/urls/:id/post", (req, res) => {
    res.redirect(`/urls/${req.params.id}`);
});

app.post("/urls/:id/delete", (req, res) => {
    //const userId = req.cookies.user_id;
    const userId = req.session.user_id;
    const id = req.params.id;
  
    if (!userId) {
      res.status(401).send("<html><body>Please <a href='/login'>login</a> or <a href='/register'>register</a> to access this URL.</body></html>");
      return;
    }
  
    const userURLs = urlsForUser(userId,urlDatabase);
    if (!userURLs[id]) {
      res.status(403).send("<html><body>You don't have permission to delete this URL OR the URL doesn't exist.</body></html>");
      return;
    }

    delete urlDatabase[id];
    res.redirect("/urls");
});

//Add a POST Route to Receive the Form Submission
app.post("/urls", (req, res) => {
    //const userId = req.cookies.user_id;
    const userId = req.session.user_id;
    if (!userId) {
      res.status(401).send("<html><body>Please <a href='/login'>login</a> or <a href='/register'>register</a> to shorten URLs.</body></html>");
      return;
    }
    const longURL = req.body.longURL;
    const id = generateRandomString();
    urlDatabase[id] = {
        longURL: longURL,
        userID: userId,
    };
    //Redirect After Form Submission
    res.redirect(`/urls`);
    //res.send("Ok"); 
});

app.get("/u/:id", (req, res) => {
    const id = req.params.id;
    if (urlDatabase.hasOwnProperty(id)) {
        const longURL = urlDatabase[id].longURL;
        res.redirect(longURL);
      } else {
        res.status(404).send("<html><body>The requested shortened URL does not exist.</body></html>");
      }
});
  

// GET login page
app.get("/login", (req, res) => {
    //const userId = req.cookies.user_id;
    const userId = req.session.user_id;
    if (userId) {
        res.redirect('/urls');
        return;
      } else {
        const templateVars = { 
          user: null};
        res.render("login", templateVars);
      }
});
//The Login Route
app.post("/login", (req, res) => {
    //const userName = req.body.username;
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send("Email and password cannot be empty");
        return;
    }

    const existingUser = getUserByEmail(email, users);
    if (!existingUser) {
      res.status(403).send("Email is not registered");
      return;
    } else if (!bcrypt.compareSync(password, existingUser.password)) {
       res.status(403).send("Password is incorrect");
       return;
    }else {
    //res.cookie("user_id", existingUser.id);
    req.session.user_id = existingUser.id;
    }
    res.redirect("/urls");
});

//The Logout Route
app.post("/logout", (req, res) => {
    //res.clearCookie('user_id');
    req.session = null;
    res.redirect("/login");
});


// register endnote rendering:
app.get("/register", (req, res) => {
    //const userId = req.cookies.user_id;
    const userId = req.session.user_id;
    if (userId) {
        res.redirect('/urls');
        return;
    }
    const templateVars = {
      user: null,
    }
    res.render("register", templateVars);
  });
  
  //Create a Registration Handler
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    //
    if (!email || !password) {
        res.status(400).send("Email and password cannot be empty");
        return;
      }
    //
    const existingUser = getUserByEmail(email, users);
    if (existingUser) {
      res.status(400).send("Email already registered");
      return;
    } else {
      const hashedPass = bcrypt.hashSync(password, 10);
      const newuser = {
      id: generateRandomString(),
      email,
      password: hashedPass,
    };
    users[newuser.id] = newuser;
    console.log(users);
    //res.cookie("user_id", newuser.id); The user should login after registeration!
    }
    
    //res.redirect("/login");
    res.status(200).send("<html><body>Registered Successfully! Please <a href='/login'>login</a>.</body></html>");
});
// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

