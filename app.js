const db = require('./db');
const Op = db.Sequelize.Op;
const { Book } = db.models;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.set('view engine', 'pug');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

// Home page
app.get('/', (req,res) => {
  res.redirect('/books');
});

// Render collection of book
app.get('/books', async (req,res) => {
  const books = await Book.findAll();
  res.render('index', {data: books, title: "Books"});
});

// Search book
app.post('/books', async (req,res) => {
  const foundBooks = await Book.findAll({
    where: {
      [Op.or]:
        [
          {title: {[Op.substring]: req.body.search}},
          {author: {[Op.substring]: req.body.search}},
          {genre: {[Op.substring]: req.body.search}},
          {year: {[Op.substring]: req.body.search}}
        ]
    }
  });
  res.render('index', {data: foundBooks, title: "Books"});
});

// Create new book
app.get('/books/new', (req,res) => {
  res.render('new-book', {title: "New Book"});
});

app.post('/books/new', async (req,res) => {
  if(req.body.title == ''){
    res.render('new-book', {isBlank: true, data: req.body});
  } else if(req.body.author==''){
    res.render('new-book', {isBlank: true});
  } else {
    await Book.create(req.body);
    res.redirect('/books');
  };
});

// Update book
app.get('/book/:id', async (req,res,next) => {
  const book =  await Book.findByPk(req.params.id);
  if(book !== null){
    res.render('update-book', {data: book, title: "Books"});
  } else {
    const err = new Error('Server Error');
    next(err);
  };
});


app.post('/book/:id', async (req,res) => {
  const book =  await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books');
});

// Delete book
app.post('/books/:id/delete', async (req,res)  => {
  const book =  await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
});

// Page not Found
app.use((req,res,next) => {
  const err = new Error("Not Found");
  err.status =  404;
  next(err);
});

// Global error handler
app.use((err,req,res,next) => {
  if (err.message == 'Server Error' ) {
    res.render('error', {title: "Page Not Found"});
  } else if (err.message == 'Not Found') {
    res.status(err.status);
    res.render('page_not_found', {title: "Page Not Found"});
  }
});


app.listen(3000);
