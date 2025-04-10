const express = require('express');
const router = express.Router();
const CustomerService = require('../services/CustomerService');

// Create a customer profile
router.post('/', async (req, res) => {
  try {
    const { userId, ...customerData } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const customer = await CustomerService.createCustomer(userId, customerData);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error in customer creation route:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get customer profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const customer = await CustomerService.getCustomerByUserId(req.params.userId);
    res.json(customer);
  } catch (error) {
    console.error('Error in get customer route:', error);
    res.status(404).json({ error: error.message });
  }
});

// Update customer profile
router.put('/:userId', async (req, res) => {
  try {
    const updatedCustomer = await CustomerService.updateCustomer(
      req.params.userId,
      req.body
    );
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error in update customer route:', error);
    res.status(400).json({ error: error.message });
  }
});

// Add a pet to customer profile
router.post('/:userId/pets', async (req, res) => {
  try {
    const customer = await CustomerService.addPet(
      req.params.userId,
      req.body
    );
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error in add pet route:', error);
    res.status(400).json({ error: error.message });
  }
});

// Record a new booking and add loyalty points
router.post('/:userId/bookings', async (req, res) => {
  try {
    const { points } = req.body;
    const customer = await CustomerService.addBookingAndPoints(
      req.params.userId,
      points
    );
    res.json(customer);
  } catch (error) {
    console.error('Error in record booking route:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 