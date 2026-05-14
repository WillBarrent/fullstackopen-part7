import { render, screen } from "@testing-library/react";
import NewBlogForm from "./NewBlogForm";
import userEvent from "@testing-library/user-event";

test("form calls the event handler it received as props with the right details", async () => {
  const user = userEvent.setup();

  const handleBlogAddition = vi.fn();
  const setTitle = vi.fn();
  const setAuthor = vi.fn();
  const setUrl = vi.fn();

  render(
    <NewBlogForm
      handleBlogAddition={handleBlogAddition}
      setTitle={setTitle}
      setAuthor={setAuthor}
      setUrl={setUrl}
    />,
  );

  const title = screen.getByLabelText("title");
  const author = screen.getByLabelText("author");
  const url = screen.getByLabelText("url");

  const createButton = screen.getByText("create");

  await user.type(title, "New React updates");
  await user.type(author, "Developer");
  await user.type(url, "react.com");

  await user.click(createButton);

  expect(handleBlogAddition.mock.calls).toHaveLength(1);
  expect(handleBlogAddition.mock.calls[0][0].title).toBe("New React updates");
  expect(handleBlogAddition.mock.calls[0][0].author).toBe("Developer");
  expect(handleBlogAddition.mock.calls[0][0].url).toBe("react.com");
});
