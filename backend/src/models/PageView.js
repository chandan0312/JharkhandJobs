// ---------------------------------------------------------------------------
// PageView — records every page visit for the analytics dashboard.
// ---------------------------------------------------------------------------
// IPs are stored as a short SHA-256 digest (first 16 hex chars) so that
// unique-visitor counts work without ever persisting a raw IP address.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

export default function definePageView(sequelize) {
  return sequelize.define(
    'PageView',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      // The URL path that was visited, e.g. "/", "/job/ssc-cgl-2024"
      path: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '/',
      },

      // HTTP Referer header value (truncated to 500 chars)
      referrer: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      // Parsed device category
      device: {
        type: DataTypes.ENUM('mobile', 'tablet', 'desktop'),
        allowNull: false,
        defaultValue: 'desktop',
      },

      // Parsed browser name
      browser: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'Other',
      },

      // Parsed operating system
      os: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'Other',
      },

      // ISO country name (from geoip-lite lookup, may be null for local IPs)
      country: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },

      // City name (from geoip-lite)
      city: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },

      // Privacy-safe hashed IP (first 16 chars of SHA-256 hex digest)
      ipHash: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },

      // Client-generated session ID (stored in localStorage, persists per browser)
      sessionId: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
    },
    {
      tableName: 'page_views',
      timestamps: true,
      updatedAt: false, // We only need createdAt for time-series analytics
      indexes: [
        { fields: ['createdAt'] },
        { fields: ['path'] },
        { fields: ['ipHash'] },
        { fields: ['device'] },
        { fields: ['country'] },
      ],
    }
  )
}
