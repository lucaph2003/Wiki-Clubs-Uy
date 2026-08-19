import { test, expect } from '@playwright/test';

test('grilla → portal → club → subrutas (§15)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Garra' })).toBeVisible();

  await page.getByRole('button', { name: 'Entrar a Club Atlético Peñarol' }).click();
  await expect(page).toHaveURL(/\/club\/penarol$/);
  await expect(page.getByRole('heading', { name: 'Club Atlético Peñarol' })).toBeVisible();

  await page.getByRole('link', { name: 'Identidad', exact: true }).click();
  await expect(page).toHaveURL(/\/club\/penarol\/identidad$/);
  await expect(page.getByRole('heading', { name: 'Línea de tiempo' })).toBeVisible();

  await page.getByRole('link', { name: 'Institución', exact: true }).click();
  await expect(page).toHaveURL(/\/club\/penarol\/institucion$/);
});

test('búsqueda de club se enfoca con la tecla "/"', async ({ page }) => {
  await page.goto('/');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('/');
  await expect(page.getByLabel('Buscar club')).toBeFocused();
});

test('clásico: split screen y voto en encuesta', async ({ page }) => {
  await page.goto('/clasico/clasico-uruguayo');
  await expect(page.getByRole('heading', { name: 'Clásico Uruguayo' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Peñarol' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Nacional' })).toBeVisible();

  await page.getByRole('button', { name: 'Peñarol', exact: true }).click();
  await expect(page.getByRole('button', { name: /Peñarol/, pressed: true })).toBeVisible();
});

test('ruta inexistente muestra el estado 404', async ({ page }) => {
  await page.goto('/no-existe');
  await expect(page.getByRole('heading', { name: 'Esto no existe' })).toBeVisible();
});
