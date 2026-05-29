import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '', // Store path to logo or CSS styling/initials description
    },
    industry: {
      type: String,
      required: [true, 'Please add industry type'],
    },
    jobCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    recentlyAdded: {
      type: Boolean,
      default: false,
    },
    companyColor: {
      type: String,
      default: '#1B8C0A',
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);
export default Company;
