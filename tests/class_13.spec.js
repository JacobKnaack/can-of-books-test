require('dotenv').config();
const { test, expect } = require('@playwright/test');
const REACT_APP_URL = process.env.REACT_APP_TEST_URL || 'http://localhost:3000';

test.describe('Update: As a user, I want to update book details on my list, so that I can change the book status, or update the book details as I learn more about it.', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REACT_APP_URL);

    let formElements = await page.locator('form').count();
    expect(formElements).toEqual(0);

    await page.locator('.btn-secondary').first().click();
  });

  test('Add a form in the front end to let the user edit an existing book\'s details in a modal.', async ({ page }) => {
    let formElements = await page.locator('form').count();
    expect(formElements).toEqual(1);
  });

  test('When the form is submitted, send the new data to the server, and update the page according to the response.', async ({ page }) => {
    page.on('dialog', async dialog => {
      await dialog.accept();
    }); // accept prompt pop-up.
    const tag = Math.floor(Math.random() * 1000);
    let title = `Update Test: New Title - ${tag}`;
    let description = `Update Test: New Description - ${tag}`;

    let initialCount = await page.locator(`.carousel-item`).count();

    await page.locator(`input[id='title']`).fill(title);
    await page.locator(`input[id='description']`).fill(description);
    await page.locator(`button[type='submit']`).click();

    await page.waitForTimeout(2000);
    let updatedCount = await page.locator(`.carousel-item`).count();

    await expect(page.getByText(title)).toBeAttached();
    await expect(page.getByText(description)).toBeAttached();
    await page.screenshot({ path: 'screenshot.png' });
    expect(initialCount).toEqual(updatedCount);
  });
});