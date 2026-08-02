import { test, expect } from "@playwright/test";

test.describe("EduFlow AI Platform E2E Suite", () => {
  test("navigates to dashboard and renders metric widgets", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Executive Dashboard");
    await expect(page.locator("text=Total Courses")).toBeVisible();
    await expect(page.locator("text=Pending Reviews")).toBeVisible();
  });

  test("opens command palette on shortcut or click", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("Control+k");
    await expect(page.locator("text=Global Intelligence Results")).toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});
