// ---------------------------------------------------------------------------
// User — accounts for both regular users and admin write routes.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

const BCRYPT_ROUNDS = 10

export const USER_ROLES = ['admin', 'editor', 'user']

export default function defineUser(sequelize) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.STRING(120),
        primaryKey: true,
        defaultValue: () => `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      },
      email: {
        type: DataTypes.STRING(190),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('email', String(value || '').trim().toLowerCase())
        },
        validate: {
          isEmail: { msg: 'A valid email address is required' },
        },
      },
      name: DataTypes.STRING(120),
      role: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'user',
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Google OAuth fields
      googleId: {
        type: DataTypes.STRING(100),
        field: 'google_id',
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(500),
        field: 'profile_image',
        allowNull: true,
      },
      plainPassword: {
        type: DataTypes.VIRTUAL,
        set(val) {
          this.setDataValue('plainPassword', val)
        },
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        async beforeValidate(user) {
          const plain = user.get('plainPassword') || user.get('password')
          // Only hash if it's not already a bcrypt hash (starts with $2)
          if (plain && !String(plain).startsWith('$2')) {
            const hash = await bcrypt.hash(plain, BCRYPT_ROUNDS)
            user.setDataValue('password', hash)
          }
        },
      },
    }
  )

  /** Constant-time comparison of a candidate password against the stored hash. */
  User.prototype.verifyPassword = function verifyPassword(candidate) {
    const hash = this.getDataValue('password')
    if (!candidate || !hash) return Promise.resolve(false)
    return bcrypt.compare(candidate, hash)
  }

  /** Expose passwordHash property for backward compatibility with auth routes */
  Object.defineProperty(User.prototype, 'passwordHash', {
    get() {
      return this.getDataValue('password')
    },
    set(val) {
      this.setDataValue('password', val)
    },
  })

  /** Belt-and-braces: password can never leak through res.json(user). */
  User.prototype.toJSON = function toJSON() {
    const values = { ...this.get({ plain: true }) }
    delete values.password
    delete values.plainPassword
    return values
  }

  return User
}
