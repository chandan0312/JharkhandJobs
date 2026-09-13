// ---------------------------------------------------------------------------
// Course — the "Most Popular" learning cards on the home page.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

export default function defineCourse(sequelize) {
  return sequelize.define(
    'Course',
    {
      id: {
        type: DataTypes.STRING(120),
        primaryKey: true,
      },
      title: { type: DataTypes.STRING(240), allowNull: false },
      author: DataTypes.STRING(120),
      tag: DataTypes.STRING(60),

      // Display duration ("18:42"), not a numeric length.
      duration: DataTypes.STRING(20),

      // Two-stop card gradient: ['#4338ca', '#6d70f0'].
      gradient: DataTypes.JSON,
    },
    { tableName: 'popular_courses', timestamps: true }
  )
}
