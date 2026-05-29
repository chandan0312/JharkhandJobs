import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    companyInitial: {
      type: String,
      default: '',
    },
    companyColor: {
      type: String,
      default: '#1B8C0A',
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify job type'],
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
    },
    salary: {
      min: {
        type: Number,
        required: [true, 'Please add minimum salary'],
      },
      max: {
        type: Number,
        required: [true, 'Please add maximum salary'],
      },
      currency: {
        type: String,
        default: '₹',
      },
      period: {
        type: String,
        default: 'LPA', // LPA or per month
      }
    },
    experience: {
      type: String,
      required: [true, 'Please specify experience requirement'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Private Jobs', 'Govt Jobs'],
    },
    industry: {
      type: String,
      required: [true, 'Please specify industry'],
    },
    description: {
      type: String,
      required: [true, 'Please add job description'],
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for seeded items
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to auto-generate company initial if blank
jobSchema.pre('save', function() {
  if (!this.companyInitial && this.company) {
    this.companyInitial = this.company.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  }
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
