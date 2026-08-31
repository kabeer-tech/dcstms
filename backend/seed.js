import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding');
    
    // Check if department exists
    const existing = await Department.findOne({ code: 'CS' });
    if (existing) {
      console.log('Department already exists:', existing);
      process.exit();
    }
    
    const dept = await Department.create({
      name: 'Computer Science',
      code: 'CS'
    });
    console.log('Department created:', dept);
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
