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

export const playerTennisProfile = pgTable('player_tennis_profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  playerId: uuid('player_id').notNull().unique(),
  handedness: handEnum('handedness'),
  backhandStyle: backhandEnum('backhand_style').default('unknown'),
  heightCm: integer('height_cm'),
  weightKg: integer('weight_kg'),
  birthdate: date('birthdate'),
  birthplaceCity: text('birthplace_city'),
  birthplaceCountry: text('birthplace_country'),
  residenceCity: text('residence_city'),
  residenceCountry: text('residence_country'),
  nationality: text('nationality'),
  turnedProYear: smallint('turned_pro_year'),
  coachNames: text('coach_names').array(),
  preferredSurface: surfaceEnum('preferred_surface'),
  racketBrand: text('racket_brand'),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by')
})

export const playerTennisProfileHistory = pgTable('player_tennis_profile_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').notNull(),
  changedBy: uuid('changed_by'),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
  changeType: text('change_type').notNull(), // insert|update|delete
  snapshot: jsonb('snapshot').$type<Record<string, unknown>>().notNull()
})

// ============================================================================
// TENNIS SYSTEM - TEAMS (for doubles)
// ============================================================================

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamType: teamTypeEnum('team_type').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by')
})

export const teamMembers = pgTable(
  'team_members',
  {
    teamId: uuid('team_id').notNull(),
    playerId: uuid('player_id').notNull(),
    role: text('role').default('member'),
    startAt: timestamp('start_at').notNull().defaultNow(),
    endAt: timestamp('end_at')
  },
  t => ({
    pk: primaryKey({ columns: [t.teamId, t.playerId, t.startAt] })
  })
)

// ============================================================================
// TENNIS SYSTEM - EVENTS & MATCHES
// ============================================================================

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  locationCity: text('location_city'),
  locationCountry: text('location_country'),
  surface: surfaceEnum('surface'),
  indoor: boolean('indoor').default(false),
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by')
})

export const matches = pgTable('matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull(),
  format: formatEnum('format').notNull(),
  round: text('round'),
  bestOfSets: smallint('best_of_sets').notNull().default(3),
  status: matchStatusEnum('status').notNull().default('scheduled'),
  startTime: timestamp('start_time'),
  completedAt: timestamp('completed_at'),
  winnerSide: smallint('winner_side'), // 1 or 2
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by')
})

export const matchCompetitors = pgTable(
  'match_competitors',
  {
    matchId: uuid('match_id').notNull(),
    side: smallint('side').notNull(), // 1 or 2
    playerId: uuid('player_id'), // for singles
    teamId: uuid('team_id') // for doubles
  },
  t => ({
    pk: primaryKey({ columns: [t.matchId, t.side] })
  })
)

export const matchSets = pgTable(
  'match_sets',
  {
    matchId: uuid('match_id').notNull(),
    setNumber: smallint('set_number').notNull(),
    side1Games: smallint('side1_games').notNull(),
    side2Games: smallint('side2_games').notNull(),
    side1TiebreakPoints: smallint('side1_tiebreak_points'),
    side2TiebreakPoints: smallint('side2_tiebreak_points')
  },
  t => ({
    pk: primaryKey({ columns: [t.matchId, t.setNumber] })
  })
)

export const matchHistory = pgTable('match_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  matchId: uuid('match_id').notNull(),
  changedBy: uuid('changed_by'),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
  diff: jsonb('diff').$type<Record<string, unknown>>()
})

// ============================================================================
// RELATIONS
// ============================================================================

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

export const playersRelations = relations(players, ({ one, many }) => ({
  user: one(users, {
    fields: [players.userId],
    references: [users.id]
  }),
  profile: one(playerTennisProfile, {
    fields: [players.id],
    references: [playerTennisProfile.playerId]
  }),
  teamMemberships: many(teamMembers),
  createdBy: one(users, {
    fields: [players.createdBy],
    references: [users.id]
  })
}))

export const playerTennisProfileRelations = relations(playerTennisProfile, ({ one, many }) => ({
  player: one(players, {
    fields: [playerTennisProfile.playerId],
    references: [players.id]
  }),
  history: many(playerTennisProfileHistory),
  createdBy: one(users, {
    fields: [playerTennisProfile.createdBy],
    references: [users.id]
  })
}))

export const teamsRelations = relations(teams, ({ many, one }) => ({
  members: many(teamMembers),
  createdBy: one(users, {
    fields: [teams.createdBy],
    references: [users.id]
  })
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id]
  }),
  player: one(players, {
    fields: [teamMembers.playerId],
    references: [players.id]
  })
}))

export const eventsRelations = relations(events, ({ many, one }) => ({
  matches: many(matches),
  createdBy: one(users, {
    fields: [events.createdBy],
    references: [users.id]
  })
}))

export const matchesRelations = relations(matches, ({ one, many }) => ({
  event: one(events, {
    fields: [matches.eventId],
    references: [events.id]
  }),
  competitors: many(matchCompetitors),
  sets: many(matchSets),
  history: many(matchHistory),
  createdBy: one(users, {
    fields: [matches.createdBy],
    references: [users.id]
  })
}))

export const matchCompetitorsRelations = relations(matchCompetitors, ({ one }) => ({
  match: one(matches, {
    fields: [matchCompetitors.matchId],
    references: [matches.id]
  }),
  player: one(players, {
    fields: [matchCompetitors.playerId],
    references: [players.id]
  }),
  team: one(teams, {
    fields: [matchCompetitors.teamId],
    references: [teams.id]
  })
}))

export const matchSetsRelations = relations(matchSets, ({ one }) => ({
  match: one(matches, {
    fields: [matchSets.matchId],
    references: [matches.id]
  })
}))
