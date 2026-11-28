
import { sequelize } from './backend/src/config/db.js';
import { Article } from './backend/src/models/index.js';

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const qi = sequelize.getQueryInterface();
    const desc = await qi.describeTable('articles');
    console.log('Columns in articles table:', Object.keys(desc));

    if (!desc.sourceUrl) {
      console.log('sourceUrl is missing, adding...');
      await qi.addColumn('articles', 'sourceUrl', {
        type: sequelize.Sequelize.DataTypes.STRING(1000),
        allowNull: true,
      });
      console.log('sourceUrl added.');
    } else {
      console.log('sourceUrl already exists.');
    }

    if (!desc.sourceType) {
      console.log('sourceType is missing, adding...');
      await qi.addColumn('articles', 'sourceType', {
        type: sequelize.Sequelize.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'original'
      });
      console.log('sourceType added.');
    }

    if (!desc.verifiedAt) {
      console.log('verifiedAt is missing, adding...');
      await qi.addColumn('articles', 'verifiedAt', {
        type: sequelize.Sequelize.DataTypes.DATE,
        allowNull: true,
      });
      console.log('verifiedAt added.');
    }

  } catch (error) {
    console.error('Unable to connect to the database or check table:', error);
  } finally {
    await sequelize.close();
  }
}

check();
