const express = require('express');
const router = express.Router();
const { createTicket, getTickets, replyToTicket, editReply, deleteReply } = require('./support.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { ticketSchema } = require('./support.validation');

router.route('/')
  .post(protect, validate(ticketSchema), createTicket)
  .get(protect, getTickets);

router.route('/:id/reply')
  .put(protect, replyToTicket);

router.route('/:id/reply/:replyId')
  .put(protect, editReply)
  .delete(protect, deleteReply);

module.exports = router;
