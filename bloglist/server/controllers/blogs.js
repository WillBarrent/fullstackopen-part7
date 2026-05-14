const blogRouter = require("express").Router();
const { request } = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    id: 1,
    name: 1,
    username: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  let data = request.body;

  const user = await User.findById(request.user.id);

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  if (!data.title || !data.url) {
    return response.status(400).json({ error: "title or url not defined" });
  }

  if (!Object.keys(data).includes("likes")) {
    data = {
      ...data,
      likes: 0,
    };
  }

  const blog = new Blog({ ...data, user: user._id });
  const result = await blog.save();
  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  response.status(201).json(result);
});

blogRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "blog doesn't exist" });
  }

  const user = await User.findById(request.user.id);

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  const { title, author, url, likes } = request.body;

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const result = await blog.save();

  response.status(200).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  if (!request.token) {
    return response.status(400).json({ error: "token is missing" });
  }

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(204).end();
  }

  const user = await User.findById(request.user.id);

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: "not allowed to delete" });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
