require("dotenv").config();
const { test, after, describe, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const jwt = require("jsonwebtoken");
const assert = require("node:assert");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const secret_key = process.env.SECRET;
const api = supertest(app);

describe("when there is inititially some blogs saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("lilpass", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();

    await Blog.deleteMany({});
    await Blog.insertMany(
      helper.initialBlogs.map((blog) => {
        return {
          ...blog,
          user: user._id,
        };
      }),
    );
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("make sure unique identifier is named id", async () => {
    const response = await api.get("/api/blogs");
    const keys = response.body.map((obj) => Object.keys(obj));

    let isCorrect = true;

    for (let i = 0; i < keys.length; i++) {
      const findId = keys[i].find((key) => key === "_id");

      if (findId) {
        isCorrect = false;
      }
    }

    assert.strictEqual(isCorrect, true);
  });

  describe("addition of a new blog", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Test2",
        author: "Luigi",
        url: "example2.com",
        likes: 6,
      };

      const user = await User.find({ username: "root" });

      const userForToken = {
        username: user[0].username,
        id: user[0]._id,
      };

      const token = jwt.sign(userForToken, secret_key);

      const result = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      const contents = response.body.map((r) => r.url);

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

      assert(contents.includes("example2.com"));
    });

    test("add blog and set likes to 0 if missing from request", async () => {
      const newBlog = {
        title: "Test3",
        author: "Mark",
        url: "example3.com",
      };

      const user = await User.find({ username: "root" });

      const userForToken = {
        username: user[0].username,
        id: user[0]._id,
      };

      const token = jwt.sign(userForToken, secret_key);

      const result = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      const contents = response.body.map((r) => r.url);

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

      assert.strictEqual(result.body.likes, 0);
    });

    test("400 status returned when url or title props are missing", async () => {
      const newBlog = {
        author: "Mark",
      };

      const user = await User.find({ username: "root" });

      const userForToken = {
        username: user[0].username,
        id: user[0]._id,
      };

      const token = jwt.sign(userForToken, secret_key);

      const result = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      assert.strictEqual(response.body.length, helper.initialBlogs.length);
      assert(Object.keys(result.body).includes("error"));
      assert.strictEqual(result.body.error, "title or url not defined");
    });

    test("401 when token is missing", async () => {
      const newBlog = {
        author: "Mark",
      };

      const result = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(result.body.error, "token invalid");
    })
  });

  describe("deletion of existing blog", () => {
    test("a blog can be deleted", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      const ids = blogsAtEnd.map((n) => n.id);
      assert(!ids.includes(blogToDelete.id));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });

  describe("update of existing blog", () => {
    test("a blog can be updated", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedBlog = {
        ...blogToUpdate,
        url: "blog.com",
      };

      const result = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.deepStrictEqual(blogsAtEnd[0], updatedBlog);

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("an id of a blog doesnt exist", async () => {
      const validNonExistingId = await helper.nonExistingId();

      await api.put(`/api/blogs/${validNonExistingId}`).expect(404);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("lilpass", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation of user succeeds with unique username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Will",
      name: "Will Barrent",
      password: "bbrnt",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation of user fails with not unique name", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Will Barrent",
      password: "111111",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    const isUnique = usersAtEnd
      .map((u) => u.username)
      .filter((u) => u == newUser.username);

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert.strictEqual(isUnique.length === 1, true);
    assert.strictEqual(result.body.error, "expected `username` to be unique");
  });

  test("creation of user fails with password length < 3", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Will",
      name: "Will Barrent",
      password: "42",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert.strictEqual(
      result.body.error,
      "Password length should be at least 3 character long",
    );
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
