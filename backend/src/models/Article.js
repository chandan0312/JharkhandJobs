// ---------------------------------------------------------------------------
// Article — Career guides, preparation strategies, application walkthroughs,
// admit card downloads, results analysis, and documentation checklists.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

export const ARTICLE_CATEGORIES = [
  'job-guide',
  'how-to-apply',
  'how-to-download',
  'strategy',
  'syllabus',
  'result',
  'documentation',
  'general',
]

export const ARTICLE_CATEGORY_LABELS = {
  'job-guide': 'Job & Recruitment Guide',
  'how-to-apply': 'How to Apply (Step-by-Step)',
  'how-to-download': 'How to Download (Admit Card / Marks)',
  strategy: 'Exam Strategy & Preparation',
  syllabus: 'Syllabus & Pattern Breakdown',
  result: 'Results & Cut-off Analysis',
  documentation: 'Document Verification & Checklist',
  general: 'Career Tips & News',
}

export const ARTICLE_STATUSES = ['published', 'draft']

export default function defineArticle(sequelize) {
  return sequelize.define(
    'Article',
    {
      id: {
        type: DataTypes.STRING(140),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(350),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(360),
        allowNull: false,
        unique: true,
      },
      category: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 'general',
      },
      excerpt: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.TEXT('long'),
      },
      coverImage: {
        type: DataTypes.STRING(1000),
      },
      author: {
        type: DataTypes.STRING(120),
        defaultValue: 'Job Alert X Editorial Team',
      },
      authorRole: {
        type: DataTypes.STRING(120),
        defaultValue: 'Govt Career & Exam Specialist',
      },
      readTime: {
        type: DataTypes.STRING(50),
        defaultValue: '5 min read',
      },
      tags: {
        type: DataTypes.JSON, // ['SSC', 'How To Apply', 'CGL']
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'published',
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      metaTitle: {
        type: DataTypes.STRING(350),
      },
      metaDescription: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'articles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { fields: ['slug'], unique: true },
        { fields: ['category'] },
        { fields: ['status'] },
        { fields: ['featured'] },
      ],
    }
  )
}
