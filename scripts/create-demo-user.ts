/**
 * Create Demo User Script
 * Creates a demo user in the profiles table with hashed password
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const DEMO_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const DEMO_SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(DEMO_SUPABASE_URL, DEMO_SUPABASE_KEY);

async function createDemoUser() {
  console.log('🚀 Creating demo user...\n');

  const demoUser = {
    username: 'demo',
    email: 'demo@example.com',
    password: 'DemoPassword123',
    role: 'admin'
  };

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(demoUser.password, 10);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', demoUser.email)
      .single();

    if (existingUser) {
      console.log('⚠️  User already exists. Updating password...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ password_hash: passwordHash, role: demoUser.role })
        .eq('email', demoUser.email);

      if (updateError) throw updateError;
      
      console.log('✅ User updated successfully!');
    } else {
      console.log('Creating new user...');
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          username: demoUser.username,
          email: demoUser.email,
          password_hash: passwordHash,
          role: demoUser.role
        });

      if (insertError) throw insertError;
      
      console.log('✅ User created successfully!');
    }

    console.log('\n📋 Demo User Credentials:');
    console.log('   Email:', demoUser.email);
    console.log('   Password:', demoUser.password);
    console.log('   Role:', demoUser.role);
    console.log('\n🎉 Demo user setup completed!\n');

  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    process.exit(1);
  }
}

createDemoUser();
