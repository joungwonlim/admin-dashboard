import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  jsonb,
  date,
  smallint,
  boolean,
  primaryKey
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================================
// ENUMS
// ============================================================================

export const roleEnum = pgEnum('role', ['admin', 'manager', 'viewer'])
export const handEnum = pgEnum('hand', ['right', 'left'])
export const backhandEnum = pgEnum('backhand', ['two-handed', 'one-handed', 'unknown'])
export const surfaceEnum = pgEnum('surface', ['hard', 'clay', 'grass', 'carpet'])
export const formatEnum = pgEnum('match_format', ['singles', 'doubles', 'mixed_doubles'])
export const matchStatusEnum = pgEnum('match_status', ['scheduled', 'live', 'completed', 'retired', 'walkover'])
export const teamTypeEnum = pgEnum('team_type', ['doubles', 'mixed_doubles'])

// ============================================================================
// CORE USER MANAGEMENT
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  image: text('image'),
  role: roleEnum('role').notNull().default('viewer'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by')
})

// NextAuth.js tables
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id').notNull(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires').notNull()
  },
  vt => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] })
  })
)

// ============================================================================
// AUDIT & HISTORY
// ============================================================================

export const auditHistory = pgTable('audit_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  tableName: text('table_name').notNull(),
  recordId: uuid('record_id').notNull(),
  changedBy: uuid('changed_by').notNull(),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
  changeType: text('change_type').notNull(), // insert|update|delete
  diff: jsonb('diff').$type<Record<string, unknown>>()
})

// ============================================================================
// TENNIS SYSTEM - PLAYERS
// ============================================================================

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  ranking: integer('ranking').default(0),
  stats: jsonb('stats').$type<{
    totalMatches: number
    wins: number
    losses: number
    winRate: number
    singlesRecord?: { wins: number; losses: number }
    doublesRecord?: { wins: number; losses: number }
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by')
})

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  players: many(players),
  createdBy: one(users, {
    fields: [users.createdBy],
    references: [users.id]
  })
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  })
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))

export const playersRelations = relations(players, ({ one }) => ({
  user: one(users, {
    fields: [players.userId],
    references: [users.id]
  }),
  createdBy: one(users, {
    fields: [players.createdBy],
    references: [users.id]
  })
}))
