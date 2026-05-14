import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

import { BrowserRouter as Router } from "react-router-dom";

const blog = {
  author: "Will",
  id: "0",
  likes: 21,
  title: "Hi Hello",
  url: "example3.com",
  user: {
    username: "Test",
    name: "Test",
    id: "0",
  },
};

describe("unauthenticated user", () => {
  test("can see blog information, but cant click any button", () => {
    const { container } = render(
      <Router>
        <Blog blog={blog} />
      </Router>,
    );

    const title = container.querySelector(".title");
    const url = container.querySelector(".url");
    const likes = container.querySelector(".likes");
    const username = container.querySelector(".createdBy");

    expect(title).toBeVisible();
    expect(url).toBeVisible();
    expect(likes).toBeVisible();
    expect(username).toBeVisible();

    const button = container.querySelector("button");
    expect(button).toBe(null);
  });
});

describe("authenticated user", () => {
  const authUser = {
    id: 0,
    name: "root",
    username: "root",
  };

  const originalUser = {
    username: "Test",
    name: "Test",
    id: "0",
  };

  test("can like but cant delete other's blogs", async () => {
    const mockHandler = vi.fn();

    const { container } = render(
      <Router>
        <Blog blog={blog} handleLike={mockHandler} user={authUser} />
      </Router>,
    );

    const likeButton = container.querySelector(".like");

    const user = userEvent.setup();
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);

    const removeButton = container.querySelector(".remove");
    expect(removeButton).toBe(null);
  });

  test("can remove his own blogs", async () => {
    const { container } = render(
      <Router>
        <Blog blog={blog} user={originalUser} />
      </Router>,
    );

    const removeButton = container.querySelector(".remove");
    screen.debug(removeButton)
    expect(removeButton).toBeVisible();
  });
});

test("component displays title and author", () => {
  const { container } = render(<Blog blog={blog} />);

  const mainContent = container.querySelector(".blog");
  const hiddenContent = container.querySelector(".hiddenContent");

  expect(mainContent).toBeVisible();
  expect(hiddenContent).not.toBeVisible();
});

test("clicking show displays hidden content (url, username, likes)", async () => {
  const { container } = render(<Blog blog={blog} />);

  const mainContent = container.querySelector(".blog");
  const hiddenContent = container.querySelector(".hiddenContent");

  expect(mainContent).toBeVisible();
  expect(hiddenContent).not.toBeVisible();

  const user = userEvent.setup();
  const button = container.querySelector(".visibilityBtn");
  await user.click(button);

  expect(mainContent).toBeVisible();
  expect(hiddenContent).toBeVisible();
});

test("like button works as expected", async () => {
  const mockHandler = vi.fn();

  const { container } = render(<Blog blog={blog} handleLike={mockHandler} />);

  const likeButton = container.querySelector(".like");

  const user = userEvent.setup();
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
