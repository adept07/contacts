var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('mongodb://satya:satya@ds117868.mlab.com:17868/contacts_chekuri', ['contacts']);


// get all contacts
router.get('/contacts', function(request, response, next) {
  db.contacts.find(function(error, contacts) {
    if (error) {
      response.send(error);
    }
    response.send(contacts);
  });
});

// get single contact
router.get('/contact/:id', function(request, response, next) {
  db.contacts.findOne({
    _id: mongojs.ObjectId(request.params.id)
  }, function(error, contact) {
    if (error) {
      response.send(error);
    }
    response.send(contact);
  });
});

// save
router.post('/contact', function(request, response) {
  var contact = request.body;
  if (!contact.name) {
    response.status(400);
    response.json({
      "error": "bad data"
    });
  } else {
    db.contacts.save(contact, function(error, contact) {
      if (error) {
        response.send(error);
      }
      response.json(contact);
    });
  }
});

// delete
router.delete('/contact/:id', function(request, response, next) {
  db.contacts.remove({
    _id: mongojs.ObjectId(request.params.id)
  }, function(error, contact) {
    if (error) {
      response.send(error);
    }
    response.send(contact);
  });
});

// udpate
router.put('/contact/:id', function(request, response, next) {
  var updatedContact = request.body;
  delete updatedContact._id; //TODO mdb doesn't accept duplicate id in the request

  db.contacts.update({
    _id: mongojs.ObjectId(request.params.id)
  }, updatedContact, {}, function(error, contact) {
    if (error) {
      response.send(error);
    } else {
      response.send(updatedContact);
    }

  });
});

module.exports = router;