import { config } from 'dotenv'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Load environment variables
config({ path: '.env.local' })

export async function seedUsers() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@test.com')).limit(1)

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists')
      return existingAdmin[0]
    }

    // Create admin user
    const adminUser = await db
      .insert(users)
      .values({
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin'
      })
      .returning()

    console.log('✅ Admin user created:', adminUser[0])

    // Create manager user
    const managerUser = await db
      .insert(users)
      .values({
        name: 'Manager User',
        email: 'manager@test.com',
        role: 'manager'
      })
      .returning()

    console.log('✅ Manager user created:', managerUser[0])

    // Create viewer user
    const viewerUser = await db
      .insert(users)
      .values({
        name: 'Viewer User',
        email: 'viewer@test.com',
        role: 'viewer'
      })
      .returning()

    console.log('✅ Viewer user created:', viewerUser[0])

    return { adminUser: adminUser[0], managerUser: managerUser[0], viewerUser: viewerUser[0] }
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    throw error
  }
}

// Run seed function if called directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('🌱 Seeding completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('🚨 Seeding failed:', error)
      process.exit(1)
    })
}
