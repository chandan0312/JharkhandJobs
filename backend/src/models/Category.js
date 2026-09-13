// ---------------------------------------------------------------------------
// Category — departments shown in the "Top Job Categories" rail and used as
// the `category` facet on jobs (slug: ssc, upsc, banking, railway, …).
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

export default function defineCategory(sequelize) {
  return sequelize.define(
    'Category',
    {
      slug: {
        type: DataTypes.STRING(60),
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(80), allowNull: false },
      fullName: DataTypes.STRING(160),

      // Denormalised display counter ("512 jobs") shown on the category chip.
      // Not a live COUNT(*) — it reflects the department's overall vacancy
      // volume, not how many posts this portal currently holds.
      jobs: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

      // `icon` is a key the frontend resolves to a lucide-react component
      // in <BrandIcon/>; color/tint are the accent + background swatches.
      icon: DataTypes.STRING(40),
      color: DataTypes.STRING(20),
      tint: DataTypes.STRING(20),
    },
    { tableName: 'categories', timestamps: true }
  )
}
