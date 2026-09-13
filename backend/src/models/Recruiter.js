// ---------------------------------------------------------------------------
// Recruiter — the follow-able organisations in the "Top Recruiters" rail.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

export default function defineRecruiter(sequelize) {
  return sequelize.define(
    'Recruiter',
    {
      id: {
        type: DataTypes.STRING(80),
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(160), allowNull: false },
      handle: DataTypes.STRING(80),
      icon: DataTypes.STRING(40),
      color: DataTypes.STRING(20),

      // Pre-formatted for display ("2.4M", "980K") — kept as text so the UI
      // renders it as-is, matching the seed data.
      followers: DataTypes.STRING(20),
    },
    { tableName: 'recruiters', timestamps: true }
  )
}
