import { db } from '@/db'
import { users } from '@/db/schema'

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    const result = await db.select().from(users).limit(1)
    console.log('✅ Database connection successful')
    console.log('Users table accessible:', result.length >= 0)
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

export async function createTestUser() {
  try {
    const testUser = await db
      .insert(users)
      .values({
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin'
      })
      .returning()

    console.log('✅ Test user created:', testUser[0])
    return testUser[0]
  } catch (error) {
    console.error('❌ Failed to create test user:', error)
    return null
  }
}
