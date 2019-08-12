const db = require('./db');
const Op = db.Sequelize.Op;
const { Book } = db.models;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.set('view engine', 'pug');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

// async IIFE
(async () => {
  await db.sequelize.sync({ force: true });
  try {
    await Book.create({
      title: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      year: 1997,
    })
    await Book.create({
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      year: 1998,
    })
    await Book.create({
      title: 'Harry Potter and the Prisoner of Azkaban',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      year: 1999,
    })
    await Book.create({
      title: 'Harry Potter and the Goblet of Fire',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      year: 2000,
    })
    await Book.create({
      title: 'Harry Potter and the Order of the Phoenix',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      year: 2003,
    })
    await Book.create({
      title: 'Harry Potter and the Half-Blood Prince',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      year: 2005,
    })
    await Book.create({
      title: 'Harry Potter and the Deathly Hallows',
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      year: 2007,
    })
    await Book.create({
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      genre: 'Non Fiction',
      year: 1998,
    })
    await Book.create({
      title: 'The Universe in a Nutshell',
      author: 'Stephen Hawking',
      genre: 'Non Fiction',
      year: 2001,
    })
    await Book.create({
      title: 'Frankenstein',
      author: 'Mary Shelley',
      genre: 'Horror',
      year: 1818,
    })
    await Book.create({
      title: 'The Martian',
      author: 'Andy Weir',
      genre: 'Science Fiction',
      year: 2014,
    })
    await Book.create({
      title: 'Ready Player One',
      author: 'Ernest Cline',
      genre: 'Science Fiction',
      year: 2011,
    })
    await Book.create({
      title: 'Armada',
      author: 'Ernest Cline',
      genre: 'Science Fiction',
      year: 2015,
    })
    await Book.create({
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Classic',
      year: 1813,
    })
    await Book.create({
      title: 'Emma',
      author: 'Jane Austen',
      genre: 'Classic',
      year: 1815,
    })
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();


app.get('/', (req,res) => {
  res.redirect('/books/page-1');
});

app.get('/books/page-:page', async (req,res) => {
  const allBooks = await Book.findAll();
  const numberOfBook = Math.ceil(allBooks.length/5);
  const books =  await Book.findAll({offset: parseInt(req.params.page)*5 -5, limit: 5});
  res.render('index', {data: books, numberOfBook: numberOfBook, title: "Books"});
});

app.post('/books/page-:page', (req,res) => {
  res.redirect('/books/search')
})

app.get('/books/new', (req,res) => {
  res.render('new-book', {title: "New Book"})
})

app.post('/books/new', async (req,res) => {
  if(req.body.title == ''){
    res.render('new-book', {isBlank: true, data: req.body})
  } else if(req.body.author==''){
    res.render('new-book', {isBlank: true})
  } else {
    await Book.create(req.body)
    res.redirect('/books/page-1')
  }
})

app.get('/book/:id', async (req,res,next) => {
  const book =  await Book.findByPk(req.params.id);
  if(book !== null){
    res.render('update-book', {data: book, title: "Books"})
  } else {
    const err = new Error('Server Error')
    next(err)
  }
})


app.post('/book/:id', async (req,res) => {
  const book =  await Book.findByPk(req.params.id);
  await book.update(req.body)
  res.redirect('/books/page-1')
})


app.post('/books/:id/delete', async (req,res)  => {
  const book =  await Book.findByPk(req.params.id);
  res.redirect('/books/page-1')
})

app.get('/books/search', async (req,res) => {
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
  const numberOfBook = Math.ceil(foundBooks.length/5)
  const books =  await Book.findAll({
    where: {
      [Op.or]:
        [
          {title: {[Op.substring]: req.body.search}},
          {author: {[Op.substring]: req.body.search}},
          {genre: {[Op.substring]: req.body.search}},
          {year: {[Op.substring]: req.body.search}}
        ]
    }
  },{offset: parseInt(req.params.page)*5 -5, limit: 5});

  res.render('index', {data: books, numberOfBook: numberOfBook, title: "Books"})
  console.log(req.body)
})

app.use((req,res,next) => {
  const err = new Error("Not Found");
  err.status =  404;
  next(err)
})

app.use((err,req,res,next) => {
  if (err.message == 'Server Error' ) {
    res.render('error', {title: "Page Not Found"})
  } else if (err.message == 'Not Found') {
    res.status(err.status)
    res.render('page_not_found', {title: "Page Not Found"})
  }
})

app.listen(3000)
