var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoosePagination = require('mongoosePaginatiton');
var {addCreatedHook } = require('addCreatedHook')
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  username: {type: String, required: true},
  password: String,
  email: String,
  categoryName : String,
  categoryId : String,
  productName : String,
  productId : String,
  
}, {collection: 'user-data'});

addCreatedHook(userDataSchema)
userDataSchema.plugin(mongoosePagination);
var UserData = mongoose.model('UserData', userDataSchema);
userDataSchema.plugin(mongoosePagination);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  const{page, limit} = req.query;

  UserData.find()
  const options ={
    ...(page ? {
      page,
      limit : limit || 10,

    } : {
      pagination: false,
    }),
  }
  //const cases = await this.UserData.paginate(query,options);
      .then(function(doc) {
        res.render('index', {items: doc}, parseInt(page || 0, 10), parseInt(limit, 10));
      });
});

router.post('/insert', function(req, res, next) {
  var item = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    productId: req.body.productId,
    productName: req.body.productName,
    categoryId: req.body.categoryId,
    categoryName: req.body.categoryName
  };

  var data = new UserData(item);
  data.save();

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.username = req.body.username;
    doc.password = req.body.password;
    doc.email = req.body.email;
    doc.productId = req.body.productId;
    doc.productName = req.body.productName;
    doc.categoryId = req.body.categoryId;
    doc.categoryName = req.body.categoryName;
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;
