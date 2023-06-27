const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //This tells the Express app to use EJS as its templating engine.ad
app.use(express.urlencoded({ extended: true })); //translate, or parse the body. This feature is part of Express.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//Sending Data to urls_index.ejs
app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});
//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const updatedURL = req.body.longURL;
  urlDatabase[id] = updatedURL;
  res.redirect("/urls");
});
app.post("/urls/:id/post", (req, res) => {
    res.redirect(`/urls/${req.params.id}`);
  });

//Routing on Server
app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  });

//Add a POST Route to Receive the Form Submission
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  //Redirect After Form Submission
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  console.log(shortURL);
  //urlDatabase[generateRandomString()] = req.body.longURL;
  //console.log(Object.keys(urlDatabase)[Object.keys(urlDatabase).length-1]);
  res.redirect(`/urls/${shortURL}`);
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)

});


app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id];
    console.log(longURL);
    res.redirect(longURL);
});

//Generate a Random Short URL ID
function generateRandomString() {
  const alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
    randomString += alphanumericChars[randomIndex];
  }
  return randomString;
}