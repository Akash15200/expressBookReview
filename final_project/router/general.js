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
public_users.get('/async-get-books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Task 11
// Add the code for getting the book details based on ISBN (using Promise)
public_users.get('/async-get-books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.send(books[isbn]));
      });

      get_books_isbn.then(() => console.log("Promise for Task 11 resolved"));
});

// Task 12
// Add the code for getting the book details based on Author (using Promise)
public_users.get('/async-get-books/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
        let author = req.params.author;
        let authorBooks = [];
        for (let isbn in books) {
            if (books[isbn].author === author) {
                authorBooks.push({"isbn": isbn, "title": books[isbn].title, "reviews": books[isbn].reviews});
            }
        }
        resolve(res.send(JSON.stringify({"booksbyauthor": authorBooks}, null, 4)));
      });

      get_books_author.then(() => console.log("Promise for Task 12 resolved"));
});

// Task 13
// Add the code for getting the book details based on Title (using Promise)
public_users.get('/async-get-books/title/:title',function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
        let title = req.params.title;
        let titleBooks = [];
        for (let isbn in books) {
            if (books[isbn].title === title) {
                titleBooks.push({"isbn": isbn, "author": books[isbn].author, "reviews": books[isbn].reviews});
            }
        }
        resolve(res.send(JSON.stringify({"booksbytitle": titleBooks}, null, 4)));
      });

      get_books_title.then(() => console.log("Promise for Task 13 resolved"));
});

module.exports.general = public_users;
