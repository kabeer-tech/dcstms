import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const adminEmail = 'kabiruushamaki773@gmail.com';
    const newPassword = 'admin123';

    // First, check if admin exists by email
    let user = await User.findOne({ email: adminEmail });
    
    if (user) {
      // Update existing admin
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(newPassword, salt);
      user.passwordHash = hash;
      user.role = 'admin';
      await user.save();
      console.log('✅ Admin password reset for:', adminEmail);
      console.log('📧 Email:', adminEmail);
      console.log('🔑 New password:', newPassword);
      process.exit();
    }

    // If no admin found, create one with a unique ID
    console.log('Admin not found. Creating new admin...');
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newPassword, salt);
    
    // Use timestamp to make unique ID
    const uniqueId = 'ADMIN' + Date.now().toString().slice(-6);
    
    await User.create({
      name: 'Admin',
      email: adminEmail,
      passwordHash: hash,
      role: 'admin',
      matricNoOrStaffId: uniqueId
    });
    console.log('✅ Admin created with email:', adminEmail);
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', newPassword);
    console.log('🆔 ID:', uniqueId);
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
