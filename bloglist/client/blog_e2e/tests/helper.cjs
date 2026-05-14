const createBlog = async (page, title) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByLabel("title").fill(title);
  await page.getByLabel("author").fill("Playwright");
  await page.getByLabel("url").fill("playwright.com");
  await page.getByRole("button", { name: "create" }).click();

  const div = await page.getByText(title).locator("..");
  const showButton = await div.getByRole("button", { name: "show" });
  await showButton.click();
};

module.exports = { createBlog };
