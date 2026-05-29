import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an exam title'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Please add the organization name'],
    },
    orgShort: {
      type: String,
      required: [true, 'Please add organization abbreviation (e.g., JSSC)'],
    },
    category: {
      type: String,
      required: [true, 'Please select exam category'],
      enum: ['Admit Card', 'Results', 'Answer Key', 'Syllabus', 'Exam Calendar', 'Previous Papers', 'Upcoming Exams'],
    },
    lastDate: {
      type: String, // String to support flexible formats like "18 May 2026" or "N/A"
      default: '',
    },
    posts: {
      type: String, // e.g. "863 Posts"
      default: '',
    },
    status: {
      type: String, // e.g. "Released", "Declared", "Announced"
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
