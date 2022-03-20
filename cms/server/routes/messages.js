const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

var express = require('express');
var router = express.Router();
module.exports = router; 

  router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("messages");
  
    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender
    });
  
    message.save()
      .then(createdMessage => {
        res.status(201).json({
          smessage: 'Message added successfully', ///////////////////////////////////////////////////////////////// Remember this is smessage
          message: createdMessage
        });
      })
      .catch(error => {
         res.status(500).json({
            smessage: 'An error occurred',
            error: error
          });
      });
  });
  router.put('/:id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
      .then(message => {
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = req.body.sender;
  
        Message.updateOne({ id: req.params.id }, message)
          .then(result => {
            res.status(204).json({
              smessage: 'Message updated successfully'
            })
          })
          .catch(error => {
             res.status(500).json({
             smessage: 'An error occurred',
             error: error
           });
          });
      })
      .catch(error => {
        res.status(500).json({
          smessage: 'Message not found.',
          error: { message: 'Message not found'}
        });
      });
  });


  router.delete("/:id", (req, res, next) => {
    Message.findOne({ id: req.params.id })
      .then(message => {
        Message.deleteOne({ id: req.params.id })
          .then(result => {
            res.status(204).json({
              smessage: "Message deleted successfully"
            });
          })
          .catch(error => {
             res.status(500).json({
             smessage: 'An error occurred',
             error: error
           });
          })
      })
      .catch(error => {
        res.status(500).json({
          smessage: 'Message not found.',
          error: { message: 'Message not found'}
        });
      });
  });


  router.get('/', (req, res, next) => {
    Message.find().then(messages => {
        res.status(200).json({
          smessage: 'Messages fetched successfully',
          messages: messages
        });
      })
      .catch(error => {
         res.status(500).json({
            smessage: 'An error occurred',
            error: error
          });
      });
    });