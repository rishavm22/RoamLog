const express = require('express')
const routes = express.Router()

const tripDetails = require('../controllers/trip.controller')

routes.post('/', tripDetails.tripAdditionController)
routes.get('/', tripDetails.getTripDetailsController)
routes.get('/:id', tripDetails.getTripDetailsByIdController)
routes.delete('/:id', tripDetails.deleteTripDetailsByIdController)

module.exports = routes
