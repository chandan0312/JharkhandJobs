// ---------------------------------------------------------------------------
// NowPlaying — single-row table backing the decorative "Now Playing" widget.
// ---------------------------------------------------------------------------
// A singleton: `id` is pinned to 1 so upserts always overwrite the same row.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

/** The only primary key this table ever holds. */
export const NOW_PLAYING_ID = 1

export default function defineNowPlaying(sequelize) {
  return sequelize.define(
    'NowPlaying',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: NOW_PLAYING_ID,
      },
      title: DataTypes.STRING(200),
      artist: DataTypes.STRING(160),

      // Display timestamps ("15:30" / "45:20").
      elapsed: DataTypes.STRING(20),
      total: DataTypes.STRING(20),

      progress: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // percent
      cover: DataTypes.JSON, // two-stop gradient
    },
    { tableName: 'now_playing', timestamps: true }
  )
}
