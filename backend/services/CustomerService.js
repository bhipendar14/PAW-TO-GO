const Customer = require('../models/Customer');
const User = require('../models/User');

/**
 * Service for managing Customer-related operations
 */
class CustomerService {
  /**
   * Create a customer profile for a user
   * @param {string} userId - The user ID from the User model
   * @param {Object} customerData - Customer profile data
   * @returns {Promise<Object>} The created customer
   */
  static async createCustomer(userId, customerData) {
    try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if the user already has a customer profile
      const existingCustomer = await Customer.findOne({ user: userId });
      if (existingCustomer) {
        throw new Error('Customer profile already exists for this user');
      }

      // Create the customer profile
      const customer = new Customer({
        user: userId,
        ...customerData
      });
      
      await customer.save();
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Get a customer profile by user ID
   * @param {string} userId - The user ID from the User model
   * @returns {Promise<Object>} The customer profile
   */
  static async getCustomerByUserId(userId) {
    try {
      const customer = await Customer.findOne({ user: userId }).populate('user', 'name email phone address');
      if (!customer) {
        throw new Error('Customer profile not found');
      }
      return customer;
    } catch (error) {
      console.error('Error getting customer:', error);
      throw error;
    }
  }

  /**
   * Update a customer profile
   * @param {string} userId - The user ID from the User model
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} The updated customer
   */
  static async updateCustomer(userId, updateData) {
    try {
      const customer = await Customer.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!customer) {
        throw new Error('Customer profile not found');
      }
      
      return customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  /**
   * Add a pet to a customer profile
   * @param {string} userId - The user ID from the User model
   * @param {Object} petData - The pet data to add
   * @returns {Promise<Object>} The updated customer
   */
  static async addPet(userId, petData) {
    try {
      const customer = await Customer.findOne({ user: userId });
      if (!customer) {
        throw new Error('Customer profile not found');
      }
      
      customer.pets.push(petData);
      await customer.save();
      
      return customer;
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  }

  /**
   * Increment total bookings and loyalty points
   * @param {string} userId - The user ID
   * @param {number} points - Loyalty points to add
   * @returns {Promise<Object>} Updated customer
   */
  static async addBookingAndPoints(userId, points = 10) {
    try {
      const customer = await Customer.findOneAndUpdate(
        { user: userId },
        { 
          $inc: { totalBookings: 1, loyaltyPoints: points },
          $set: { lastVisit: new Date() }
        },
        { new: true }
      );
      
      if (!customer) {
        throw new Error('Customer profile not found');
      }
      
      return customer;
    } catch (error) {
      console.error('Error updating customer stats:', error);
      throw error;
    }
  }
}

module.exports = CustomerService; 