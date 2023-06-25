const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     res.send(JSON.stringify(books,null,4));
// });
public_users.get('/', (req, res) => {
    return Promise.resolve(books)
      .then((data) => res.send(JSON.stringify(data, null, 4)));
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = parseInt(req.params.isbn);
//     let book = books[isbn];
//     if (book) {
//         res.send(JSON.stringify(book,null,4));
//     } else {
//         res.send("Cannot find book with ISBN : " + isbn);
//     }
//  });
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
  
    if (book) {
      return Promise.resolve(book)
        .then((data) => res.send(JSON.stringify(data, null, 4)));
    } else {
      return Promise.reject({ message: 'Cannot find book with ISBN: ' + isbn })
        .catch((error) => res.send(error.message));
    }
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     let bookwithsameauthor = [];
//     for (let isbn in books){
//         if (books[isbn].author == author) {
//             bookwithsameauthor.push(books[isbn]);
//         }
//     }
//     if (bookwithsameauthor.length > 0) {
//         res.send(JSON.stringify(bookwithsameauthor,null,4));
//     } else {
//         res.send("Cannot find book with author : " + author);
//     }
// });
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let bookwithsameauthor = [];
    for (let isbn in books){
        if (books[isbn].author == author) {
            bookwithsameauthor.push(books[isbn]);
        }
    }
    if (bookwithsameauthor.length > 0) {
        return Promise.resolve(bookwithsameauthor)
          .then((data) => res.send(JSON.stringify(data, null, 4)));
    } else {
        return Promise.reject({ message: 'Cannot find book with author: ' + author })
          .catch((error) => res.send(error.message));
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookwithsametitle = [];
    for (let isbn in books){
        if (books[isbn].title == title) {
            bookwithsametitle.push(books[isbn]);
        }
    }
    if (bookwithsametitle.length > 0) {
        return Promise.resolve(bookwithsametitle)
          .then((data) => res.send(JSON.stringify(data, null, 4)));
    } else {
        return Promise.reject({ message: "Cannot find book with title : " + title })
          .catch((error) => res.send(error.message));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    let book = books[isbn];
    if (book) {
        res.send(JSON.stringify(book["reviews"],null,4));
    } else {
        res.send("Cannot find book with ISBN : " + isbn);
    }
});

module.exports.general = public_users;
