import mongoose from "mongoose";

interface Post {
  title: string;
  description: string;
}
const postSchema = new mongoose.Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
