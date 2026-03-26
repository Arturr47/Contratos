// ============================================================
//  Tests de integración — datos reales de la base de datos
//  Requiere: servidor corriendo (python3 appy.py)
// ============================================================
const { test, expect } = require('@playwright/test');

// Helper: abre el contrato cargando un cliente real de la BD por ID
async function cargarCliente(page, id) {
  await page.goto('/');
  await page.waitForSelector('#selector_id option:nth-child(2)', { state: 'attached' });
  await page.selectOption('#selector_id', String(id));
  await page.waitForFunction(
    (expectedId) => document.querySelector('#selector_id').value === String(expectedId),
    id
  );
  await page.waitForTimeout(300);
}

// ─── BD-1: API devuelve 10 clientes ──────────────────────────────────────────
test('BD-1 — API /api/clientes devuelve 10 clientes', async ({ request }) => {
  const res = await request.get('/api/clientes');
  expect(res.ok()).toBeTruthy();

  const clientes = await res.json();
  expect(clientes).toHaveLength(10);
  expect(clientes[0]).toHaveProperty('id');
  expect(clientes[0]).toHaveProperty('cliente');
  expect(clientes[0]).toHaveProperty('contacto');
});

// ─── BD-2: API devuelve datos correctos del cliente #1 ───────────────────────
test('BD-2 — API /api/contrato/1 devuelve María López con pizza', async ({ request }) => {
  const res = await request.get('/api/contrato/1');
  expect(res.ok()).toBeTruthy();

  const data = await res.json();
  expect(data.cliente).toBe('María López');
  expect(data.local).toBe('Local 2');
  expect(data.personas).toBe(100);
  expect(data.paquete).toBe('pizza');
  expect(data.dia_semana).toBe('domingo');
  expect(data.alberca).toBe(true);
});

// ─── BD-3: API devuelve error 404 para ID inexistente ────────────────────────
test('BD-3 — API /api/contrato/999 devuelve 404', async ({ request }) => {
  const res = await request.get('/api/contrato/999');
  expect(res.status()).toBe(404);
});

// ─── BD-4: Contrato carga cliente #1 desde BD correctamente ─────────────────
test('BD-4 — Contrato muestra datos reales del cliente #1 (María López)', async ({ page }) => {
  await cargarCliente(page, 1);

  await expect(page.locator('#cliente')).toHaveValue('María López');
  await expect(page.locator('#paquete_nombre')).toContainText('Local 2');
  await expect(page.locator('#paquete_nombre')).toContainText('100 Personas');
  await expect(page.locator('#paquete_nombre')).toContainText('#2 Pizza');
  await expect(page.locator('#precio_paquete')).toHaveText('16280.00');

  await page.screenshot({ path: 'tests/screenshots/bd4_maria_lopez.png', fullPage: true });
});

// ─── BD-5: Contrato carga cliente #3 (sin alberca) correctamente ─────────────
test('BD-5 — Contrato muestra cliente #3 (Ana Torres, Local 2 sin alberca)', async ({ page }) => {
  await cargarCliente(page, 3);

  await expect(page.locator('#cliente')).toHaveValue('Ana Torres');
  await expect(page.locator('#paquete_nombre')).toContainText('Local 2');
  await expect(page.locator('#paquete_nombre')).toContainText('Sin Alberca');

  // Precio: 11400 - 1700 = 9700 (lun-jue)
  await expect(page.locator('#precio_paquete')).toHaveText('9700.00');

  // Sin salvavidas
  await expect(page.locator('#lista_local')).not.toContainText('Salvavidas');

  await page.screenshot({ path: 'tests/screenshots/bd5_ana_torres.png', fullPage: true });
});

// ─── BD-6: Contrato carga cliente #7 (solo extras, sin local) ────────────────
test('BD-6 — Contrato muestra cliente #7 (Verónica Ríos, sin local)', async ({ page }) => {
  await cargarCliente(page, 7);

  await expect(page.locator('#cliente')).toHaveValue('Verónica Ríos');

  // Sin paquete → caja oculta
  await expect(page.locator('.paquete-box')).not.toBeVisible();

  // Inflables y feria visibles
  await expect(page.locator('#fila_inflables')).toBeVisible();
  await expect(page.locator('#inflables_detalle')).toContainText('Tobogán');
  await expect(page.locator('#fila_feria')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/bd6_veronica_rios.png', fullPage: true });
});

// ─── BD-7: Selector tiene 10 opciones cargadas ───────────────────────────────
test('BD-7 — Selector de clientes carga 10 opciones', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('#selector_id option:nth-child(2)', { state: 'attached' });

  const opciones = await page.locator('#selector_id option').count();
  // 10 clientes + 1 opción vacía inicial
  expect(opciones).toBe(11);
});
