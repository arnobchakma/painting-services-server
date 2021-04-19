const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ht5q.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
    const paintingCollection = client.db('homePainting').collection('orders');
   const adminCollection = client.db('homePainting').collection('admin');
   const reviewCollection = client.db('homePainting').collection('reviews');
   const serviceCollection = client.db('homePainting').collection('services');

   app.get('/clientOrders', (req, res) => {
    paintingCollection.find({}).toArray((err, documents) => {
       res.send(documents);
    });
 });
 app.post('/myOrders', (req, res) => {
    const email = req.body.checkMail;
    paintingCollection.find({ email: email }).toArray((err, admin) => {
       res.send(admin);
    });
 });

 app.post('/orderService', (req, res) => {
    const order = req.body;
    paintingCollection
       .insertOne(order)
       .then(result => res.send(result.insertedCount > 0));
 });

 app.get('/allAdmins', (req, res) => {
    adminCollection.find({}).toArray((err, documents) => {
       res.send(documents);
    });
 });
 app.post('/addAAdmin', (req, res) => {
    const data = req.body;
    adminCollection
       .insertOne(data)
       .then(result => res.send(result.insertedCount > 0));
 });
 app.delete('/deleteAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection
       .findOneAndDelete({ email: email })
       .then(result => res.send(result.ok > 0));
 });

 app.post('/addServices', (req, res) => {
    const data = req.body;
    console.log(data)
    serviceCollection
       .insertOne(data)
       .then(result => res.send(result.insertedCount > 0));
 });
 app.get('/allServices', (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
       res.send(documents);
    });
 });
 app.delete('/deleteService', (req, res) => {
    const id = req.body.id;
    serviceCollection
       .findOneAndDelete({ _id: ObjectID(id) })
       .then(result => res.send(result.ok > 0));
 });

 app.get('/loadReviews', (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
       res.send(documents);
    });
 });
 app.post('/addReviews', (req, res) => {
    const review = req.body.data;
    reviewCollection
       .insertOne(review)
       .then(result => res.send(result.insertedCount > 0));
 });

 app.delete('/deleteAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection
       .findOneAndDelete({ email: email })
       .then(result => res.send(result.ok > 0));
 });

 app.post('/checkMail', (req, res) => {
    const email = req.body.checkMail;
    adminCollection.find({ email: email }).toArray((err, admin) => {
       if (admin.length > 0) {
          res.send(admin);
       }
    });
 });

 app.patch('/updateOrder', (req, res) => {
    const { id, newStatus } = req.body;
    paintingCollection.findOneAndUpdate(
       { _id: id },
       { $set: { status: newStatus } },
       { upsert: true }
    );
    });
});
  
  app.get('/', (req, res) => {
     res.send('painting services!');
  });

app.listen(port)