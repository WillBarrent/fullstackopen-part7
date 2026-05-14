const { test, expect, beforeEach, describe } = require("@playwright/test");
const { createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "test",
        name: "test",
        password: "123456",
      },
    });
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "test2",
        name: "test2",
        password: "123456",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const textboxes = await page.getByRole("textbox").all();

    await expect(page.getByText("log in to application")).toBeVisible();
    await expect(textboxes[0]).toBeVisible();
    await expect(textboxes[1]).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("login", () => {
    beforeEach(async ({ page, request }) => {
      await page.goto("http://localhost:5173/login");
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("test");
      await page.getByLabel("password").fill("123456");
      await page.getByRole("button", { name: "login" }).click();

      await page.waitForURL("http://localhost:5173/");
      await expect(page.url()).toBe("http://localhost:5173/");
      await expect(
        page.getByText("You have successfully logged in!"),
      ).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("test");
      await page.getByLabel("password").fill("123");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.url()).toBe("http://localhost:5173/login");
      await expect(
        page.getByText("Invalid password or username"),
      ).toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await page.goto("http://localhost:5173/login");
      await page.getByLabel("username").fill("test");
      await page.getByLabel("password").fill("123456");
      await page.getByRole("button", { name: "login" }).click();

      await page.waitForURL("http://localhost:5173/");
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("link", { name: "new blog" }).click();
      await page.waitForURL("http://localhost:5173/create");

      await page.getByLabel("title").fill("Playwright is awesome");
      await page.getByLabel("author").fill("Playwright");
      await page.getByLabel("url").fill("playwright.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.waitForURL("http://localhost:5173/");
      await expect(page.url()).toBe("http://localhost:5173/");

      await expect(page.getByText("Playwright is awesome")).toBeVisible();
    });

    describe("and 1 blog is added", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("link", { name: "new blog" }).click();
        await page.waitForURL("http://localhost:5173/create");

        await page.getByLabel("title").fill("Playwright is awesome");
        await page.getByLabel("author").fill("Playwright");
        await page.getByLabel("url").fill("playwright.com");
        await page.getByRole("button", { name: "create" }).click();

        await page.waitForURL("http://localhost:5173/");
      });

      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("link", { name: "Playwright is awesome" }).click();
        await expect(page.getByTestId("likes")).toContainText("0");
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByTestId("likes")).toContainText("1");
      });

      //   By the user who created it
      test("a blog can de deleted", async ({ page }) => {
        await page.getByRole("link", { name: "Playwright is awesome" }).click();
        await page.getByRole("button", { name: "remove" }).click();
        await page.waitForURL("http://localhost:5173/");
        await expect(page.url()).toBe("http://localhost:5173/");
        await expect(
          page.getByRole("link", { name: "Playwright is awesome" }),
        ).not.toBeVisible();
      });

      test("a blog cannot be deleted by random user", async ({ page }) => {
        await page.getByRole("button", { name: "logout" }).click();
        await page.getByLabel("username").fill("test2");
        await page.getByLabel("password").fill("123456");
        await page.getByRole("button", { name: "login" }).click();
        await page.getByRole("button", { name: "show" }).click();
        await expect(
          page.getByRole("button", { name: "remove" }),
        ).toBeVisible();
      });
    });

    describe("and several blogs are added", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "How to create new project");
        await createBlog(page, "Why it doesn't work?");
        await createBlog(page, "If you want to be productive");
      });

      test.only("they are arranged in the order according to the likes", async ({
        page,
      }) => {
        const allLikeButtons = await page
          .getByRole("button", { name: "like" })
          .all();

        const likes = [2, 1, 3];

        for (let i = 0; i < likes[0]; i++) await allLikeButtons[0].click();
        for (let i = 0; i < likes[1]; i++) await allLikeButtons[1].click();
        for (let i = 0; i < likes[2]; i++) await allLikeButtons[2].click();

        await page.getByRole("button", { name: "like" }).first().click();
        await page.getByRole("button", { name: "like" }).first().click();
        await page.getByRole("button", { name: "like" }).first().click();

        const allLikes = await page.getByTestId("likes").all();
        await expect(allLikes[0]).toContainText("3");
        await expect(allLikes[1]).toContainText("2");
        await expect(allLikes[2]).toContainText("1");
      });
    });
  });
});
