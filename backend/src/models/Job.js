// ---------------------------------------------------------------------------
// Job — the core dataset. Field names are what the frontend/API see;
// `field` overrides map to the actual Hostinger MySQL column names.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

/** `kind` drives which category page a post appears on. */
export const JOB_KINDS = ['job', 'admit-card', 'result', 'answer-key', 'syllabus']

export default function defineJob(sequelize) {
  return sequelize.define(
    'Job',
    {
      id: {
        type: DataTypes.STRING(120),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'title is required' } },
      },
      // 'org' maps to 'company' in Hostinger DB
      org: {
        type: DataTypes.STRING(200),
        field: 'company',
        allowNull: false,
        defaultValue: 'Jharkhand Govt',
      },
      // 'orgShort' maps to 'company_initial' in Hostinger DB
      orgShort: {
        type: DataTypes.STRING(60),
        field: 'company_initial',
      },
      category: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 'jssc',
      },
      // 'kind' maps to 'type' in Hostinger DB
      kind: {
        type: DataTypes.STRING(40),
        field: 'type',
        allowNull: false,
        defaultValue: 'job',
      },
      // 'tagline' maps to 'description' in Hostinger DB
      tagline: {
        type: DataTypes.STRING(500),
        field: 'description',
      },
      // 'shortInfo' maps to 'overview' in Hostinger DB
      shortInfo: {
        type: DataTypes.TEXT,
        field: 'overview',
      },
      // 'detailedDescription' maps to 'full_description' in Hostinger DB
      detailedDescription: {
        type: DataTypes.TEXT('long'),
        field: 'full_description',
      },
      // 'applyUrl' maps to 'apply_link' in Hostinger DB
      applyUrl: {
        type: DataTypes.STRING(1000),
        field: 'apply_link',
      },
      // 'notificationPdfUrl' maps to 'pdf_url' in Hostinger DB
      notificationPdfUrl: {
        type: DataTypes.STRING(1000),
        field: 'pdf_url',
      },
      // 'officialWebsiteUrl' maps to 'official_website' in Hostinger DB
      officialWebsiteUrl: {
        type: DataTypes.STRING(1000),
        field: 'official_website',
      },
      // 'eligibility' maps to 'qualification' in Hostinger DB
      eligibility: {
        type: DataTypes.TEXT,
        field: 'qualification',
      },
      // 'eligibilityShort' maps to 'experience' in Hostinger DB
      eligibilityShort: {
        type: DataTypes.STRING(80),
        field: 'experience',
      },
      // 'postedAt' maps to 'badge_text' in Hostinger DB
      postedAt: {
        type: DataTypes.STRING(60),
        field: 'badge_text',
      },
      // 'postedOn' maps to 'posted_date' in Hostinger DB
      postedOn: {
        type: DataTypes.STRING(60),
        field: 'posted_date',
      },

      views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      vacancies: DataTypes.INTEGER,

      // Featured posts feed the home-page hero carousel
      featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

      // inTicker posts feed the moving header marquee ticker
      inTicker: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

      // --- JSON (display-only) ---
      logo: DataTypes.JSON,           // { icon, color }
      importantDates: DataTypes.JSON, // [{ label, value }]
      fee: DataTypes.JSON,            // [{ label, value }]
      ageLimit: DataTypes.JSON,       // { min, max, note }
      posts: DataTypes.JSON,          // [{ name, total, eligibility }]
      links: DataTypes.JSON,          // [{ label, href, primary? }]

      // Pay scale / salary — display string
      salary: DataTypes.STRING(500),

      // Location field
      location: DataTypes.STRING(200),
    },
    {
      tableName: 'jobs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { fields: ['category'] },
        { fields: ['type'] },
        { fields: ['featured'] },
        { fields: ['created_at'] },
      ],
    }
  )
}
