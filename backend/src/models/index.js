// ---------------------------------------------------------------------------
// Model registry + database bootstrap.
// ---------------------------------------------------------------------------

import { sequelize, ensureDatabase } from '../config/db.js'
import defineJob, { JOB_KINDS } from './Job.js'
import defineCategory from './Category.js'
import defineRecruiter from './Recruiter.js'
import defineCourse from './Course.js'
import defineNowPlaying, { NOW_PLAYING_ID } from './NowPlaying.js'
import defineUser, { USER_ROLES } from './User.js'
import defineFeedback, { FEEDBACK_TYPES, FEEDBACK_STATUSES } from './Feedback.js'
import definePageView from './PageView.js'

export const Job = defineJob(sequelize)
export const Category = defineCategory(sequelize)
export const Recruiter = defineRecruiter(sequelize)
export const Course = defineCourse(sequelize)
export const NowPlaying = defineNowPlaying(sequelize)
export const User = defineUser(sequelize)
export const Feedback = defineFeedback(sequelize)
export const PageView = definePageView(sequelize)

export { JOB_KINDS, USER_ROLES, FEEDBACK_TYPES, FEEDBACK_STATUSES, NOW_PLAYING_ID, sequelize }

export const models = { Job, Category, Recruiter, Course, NowPlaying, User, Feedback, PageView }

/**
 * Create the database if needed, verify the connection, and create/patch tables.
 *
 * @param {object}  [options]
 * @param {boolean} [options.sync=true]  Run `sequelize.sync()`.
 * @param {boolean} [options.alter=false] Let Sequelize ALTER existing tables to
 *   match the models. Handy in development; prefer real migrations in production.
 */
export async function initDb({ sync = true, alter = true } = {}) {
  await ensureDatabase()
  await sequelize.authenticate()
  if (sync) await sequelize.sync({ alter })
  return sequelize
}

export default models
