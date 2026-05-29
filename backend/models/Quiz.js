import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question text'],
  },
  options: [
    {
      type: String,
      required: [true, 'Please add option text'],
    }
  ],
  answer: {
    type: Number,
    required: [true, 'Please specify the correct option index (0-3)'],
  },
  explanation: {
    type: String,
    default: '',
  },
  didYouKnow: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  }
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a quiz title'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Please add a unique identifier key'],
      trim: true,
      unique: true,
    },
    icon: {
      type: String,
      default: 'HelpCircle',
    },
    color: {
      type: String,
      default: '#1B8C0A',
    },
    bgColor: {
      type: String,
      default: '#E8F5E3',
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 600, // 10 minutes in seconds
    },
    questions: [questionSchema]
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
