import { Category, Job, sequelize } from '../src/models/index.js'

async function run() {
  try {
    await Category.destroy({ where: {}, truncate: true })
    const cats = [
      { slug: 'jssc', name: 'JSSC', fullName: 'Jharkhand Staff Selection Commission', jobs: 240, icon: 'scale', color: '#09324A', tint: '#e0f2fe' },
      { slug: 'jpsc', name: 'JPSC', fullName: 'Jharkhand Public Service Commission', jobs: 180, icon: 'landmark', color: '#1B6F81', tint: '#e6f6ef' },
      { slug: 'other', name: 'Other', fullName: 'Central Govt & Other Exam Recruitment', jobs: 512, icon: 'graduation', color: '#475569', tint: '#f1f5f9' },
      { slug: 'private', name: 'Private', fullName: 'Jharkhand Corporate & Private Jobs', jobs: 350, icon: 'briefcase', color: '#0f766e', tint: '#ccfbf1' },
      { slug: 'rojgar-mela', name: 'Rojgar Mela', fullName: 'District Rojgar Mela & Recruitment Camps', jobs: 120, icon: 'users', color: '#b45309', tint: '#fef3c7' },
    ]
    await Category.bulkCreate(cats)
    console.log('Categories updated successfully via Sequelize.')

    const [results, metadata] = await sequelize.query(
      "UPDATE jobs SET category = 'other' WHERE category NOT IN ('jssc', 'jpsc', 'private', 'rojgar-mela')"
    )
    console.log('Jobs updated:', metadata)

    const current = await Category.findAll({ attributes: ['slug', 'name', 'fullName'] })
    console.log('Current DB Categories:', current.map(c => c.toJSON()))
  } catch (err) {
    console.error('Error updating categories:', err)
  } finally {
    process.exit(0)
  }
}

run()
