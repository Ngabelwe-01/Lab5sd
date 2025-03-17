//import express from 'express'
const express = require('express');

const app = express();
const port = 3000;


app.use(express.json());

let books = [];


let nextBookId = 1;
let nextDetailId = 1;

app.get('/whoami', (req, res) => {
  res.json({ studentNumber: '2586421' });
});


app.get('/books', (req, res) => {
  res.json(books);
});


app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});



app.post('/books', (req, res) => {
  const { title, details } = req.body;

  if (!title || !details || !Array.isArray(details)) {
    return res.status(400).json({ error: 'Missing required book details' });
  }

  const newBook = {
    id: String(nextBookId++),
    title,
    details: details.map(detail => ({
      ...detail,
      id: String(nextDetailId++)
    }))
  };

  books.push(newBook);
  res.status(201).json(newBook);
});


app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { title, details } = req.body;
  if (title) book.title = title;
  if (details) book.details = details.map(detail => ({
    ...detail,
    id: String(nextDetailId++)
  }));

  res.json(book);
});


app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === req.params.id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  res.status(204).end();
});


app.post('/books/:id/details', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { author, genre, publicationYear } = req.body;
  if (!author || !genre || !publicationYear) {
    return res.status(400).json({ error: 'Missing required detail fields' });
  }

  const newDetail = {
    id: String(nextDetailId++),
    author,
    genre,
    publicationYear
  };

  book.details.push(newDetail);
  res.status(201).json(newDetail);
});


app.delete('/books/:id/details/:detailId', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const detailIndex = book.details.findIndex(d => d.id === req.params.detailId);
  if (detailIndex === -1) {
    return res.status(404).json({ error: 'Detail not found' });
  }

  book.details.splice(detailIndex, 1);
  res.status(204).end();
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

