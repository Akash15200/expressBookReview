const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let authorBooks = [];
  for (let isbn in books) {
      if (books[isbn].author === author) {
          authorBooks.push({"isbn": isbn, "title": books[isbn].title, "reviews": books[isbn].reviews});
      }
  }
  res.send(JSON.stringify({"booksbyauthor": authorBooks}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let titleBooks = [];
  for (let isbn in books) {
      if (books[isbn].title === title) {
          titleBooks.push({"isbn": isbn, "author": books[isbn].author, "reviews": books[isbn].reviews});
      }
  }
  res.send(JSON.stringify({"booksbytitle": titleBooks}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10 
// Add the code for getting the list of books available in the shop (using Promise)
public_users.get('/async-get-books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11
// Add the code for getting the book details based on ISBN (using Promise)
public_users.get('/async-get-books/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({message: "Error fetching book details"});
  }
});

// Task 12
// Add the code for getting the book details based on Author (using Promise)
public_users.get('/async-get-books/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({message: "Error fetching book details by author"});
  }
});

// Task 13
// Add the code for getting the book details based on Title (using Promise)
public_users.get('/async-get-books/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({message: "Error fetching book details by title"});
  }
});

module.exports.general = public_users;
