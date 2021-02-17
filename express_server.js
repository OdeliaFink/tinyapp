const express = require("express");
const PORT = 8080;
const app = express();
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

// const findUser = function() {
// const currentUser = username.find(userObj => userObj.email === email)
// return currentUser
// }

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
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
}

//GET request for the homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello Word!'};
  res.render("hello_world", templateVars);
});

//GET route to main urls page
app.get("/urls", (req, res) => {
  let username = req.cookies.username;
  const templateVars = { urls: urlDatabase, username: username };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); //prints random short url 
  const longURL = req.body.longURL; //prints out full site name
  urlDatabase[shortURL] = longURL; // url databse alone is short and long but urldb[shorturl] accesses long domain
  res.redirect(`/urls/${shortURL}`);

});

//to updated url via post route
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL; //updated/edited short url
  const longURL = req.body.longURL; // updated/edited long form url
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

//Add new URL to database
app.get("/urls/new", (req, res) => {
  let username = req.cookies.username;
  const templateVars = { urls: urlDatabase, username: username };
  res.render("urls_new",templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  let username = req.cookies.username;

  const templateVars = { shortURL: req.params.shortURL, longURL: longURL, username: username };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const username = req.cookies.username
  const templateVars = { username: username };
  res.render("register", templateVars)
});

//endpoint to handle registration data
app.post("/register", (req, res) => {
const id = generateRandomString();
const email = req.body.email;
const password = req.body.password;

const userObj = { id, email, password };
users[id] = userObj;
console.log(users[id])
res.cookie('user_id', id)
res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
