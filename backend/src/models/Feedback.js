// ---------------------------------------------------------------------------
// Feedback — user feedback and suggestions stored in MySQL.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

export const FEEDBACK_TYPES = ['suggestion', 'feedback', 'bug_report', 'feature_request', 'other']
export const FEEDBACK_STATUSES = ['new', 'reviewed', 'resolved']

export default function defineFeedback(sequelize) {
  return sequelize.define(
    'Feedback',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { notEmpty: { msg: 'Name is required' } },
      },
      email: {
        type: DataTypes.STRING(190),
        allowNull: false,
        validate: {
          isEmail: { msg: 'A valid email address is required' },
        },
      },
      type: {
        type: DataTypes.ENUM(...FEEDBACK_TYPES),
        allowNull: false,
        defaultValue: 'suggestion',
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: 'Subject is required' } },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'Message is required' } },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5,
        validate: { min: 1, max: 5 },
      },
      status: {
        type: DataTypes.ENUM(...FEEDBACK_STATUSES),
        allowNull: false,
        defaultValue: 'new',
      },
    },
    {
      tableName: 'feedbacks',
      timestamps: true,
      indexes: [
        { fields: ['type'] },
        { fields: ['status'] },
        { fields: ['createdAt'] },
      ],
    }
  )
}
