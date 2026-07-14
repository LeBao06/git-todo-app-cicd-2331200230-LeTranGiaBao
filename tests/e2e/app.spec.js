const { test, expect, _electron: electron } = require('@playwright/test');

test('End-to-end user workflow', async () => {
    // Launch the Electron app
    const electronApp = await electron.launch({ args: ['.'] });
    const window = await electronApp.firstWindow();

    const taskText = 'My new E2E test task';

    // --- Task 1: Add a new todo item ---
    await window.locator('#todo-input').fill(taskText);
    await window.locator('#add-todo-btn').click();

    // --- Task 2: Verify the todo item was added ---
    const todoItem = window.locator('.todo-item', { hasText: taskText });
    await expect(todoItem).toBeVisible();
    await expect(todoItem).toContainText(taskText);

    // --- Task 3: Mark the todo item as complete ---
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await checkbox.click();
    await expect(todoItem).toHaveClass(/completed/);

    // --- Task 4: Delete the todo item ---
    const deleteButton = todoItem.locator('.delete-btn');
    await deleteButton.click();
    await expect(todoItem).not.toBeVisible();

    // Close the app
    await electronApp.close();
});