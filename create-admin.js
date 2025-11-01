// Quick script to create an admin user for testing
// Run with: node create-admin.js

const axios = require('axios');

const API_URL = 'http://localhost:5001/api/auth';

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...\n');

    const response = await axios.post(`${API_URL}/create-admin`, {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
    });

    console.log('✅ SUCCESS! Admin user created!\n');
    console.log('📧 Email:', 'admin@test.com');
    console.log('🔑 Password:', 'admin123');
    console.log('\n🎉 You can now login at http://localhost:3000/login');
    console.log('📊 Access admin dashboard at http://localhost:3000/admin/dashboard\n');
    
    console.log('Token:', response.data.data.token);
  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.data.message);
      
      if (error.response.data.message.includes('already exists')) {
        console.log('\n💡 User already exists! Try logging in with:');
        console.log('📧 Email: admin@test.com');
        console.log('🔑 Password: admin123');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend!');
      console.log('💡 Make sure your backend is running on port 5001');
      console.log('   Run: cd backend && npm start');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

createAdmin();
