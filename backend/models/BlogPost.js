import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Please add an excerpt'],
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      default: 'Career Guide',
    },
    author: {
      type: String,
      default: 'Jharkhand Jobs Team',
    },
    coverImage: {
      type: String,
      default: '', // Store image path or default mock
    },
    tags: [
      {
        type: String,
      },
    ],
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogPostSchema.pre('save', function() {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
