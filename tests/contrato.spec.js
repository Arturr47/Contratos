const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', filename), 'utf8'));
}

// Helper: carga el contrato interceptando data.json con el archivo dado
// Aborta /api/clientes para forzar el fallback a data.json
async function abrirContrato(page, jsonFile) {
  const data = loadJSON(jsonFile);
  await page.route('**/api/clientes', route => route.abort());
  await page.route('**/data.json', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify(data),
  }));
  await page.goto('/index.html');
  await page.waitForFunction(() => document.getElementById('cliente').value !== '');
}

// ─── ESCENARIO 1: Paquete completo con local ──────────────────────────────────
test('Escenario 1 — Local 2, 100 personas, pizza, domingo', async ({ page }) => {
  await abrirContrato(page, 'data.json');

  // Datos del cliente
  await expect(page.locator('#cliente')).toHaveValue('María López');
  await expect(page.locator('#contacto')).toHaveValue('6429876543');

  // Caja del paquete visible
  await expect(page.locator('.paquete-box')).toBeVisible();
  await expect(page.locator('#paquete_nombre')).toContainText('Local 2');
  await expect(page.locator('#paquete_nombre')).toContainText('100 Personas');
  await expect(page.locator('#paquete_nombre')).toContainText('#2 Pizza');

  // Precio correcto para domingo (vie_dom)
  await expect(page.locator('#precio_paquete')).toHaveText('16280.00');

  // Gran total = precio paquete (sin extras con precio)
  await expect(page.locator('#gran_total')).toHaveText('16280.00');

  // El local incluye salvavidas (Local 2)
  await expect(page.locator('#lista_local')).toContainText('1 Salvavidas');

  // Globos: incluido en paquete
  await expect(page.locator('#globos_detalle')).toHaveText('Incluido en paquete');

  // Feria: oculta (false en JSON)
  await expect(page.locator('#fila_feria')).not.toBeVisible();

  // Fecha del evento
  await expect(page.locator('#dia_evento')).toHaveValue('30');
  await expect(page.locator('#mes_evento')).toHaveValue('Marzo');

  await page.screenshot({ path: 'tests/screenshots/escenario1_paquete_local2.png', fullPage: true });
});

// ─── ESCENARIO 2: Solo inflables y feria, sin local ───────────────────────────
test('Escenario 2 — Solo inflables y feria, sin paquete', async ({ page }) => {
  await abrirContrato(page, 'data2.json');

  // Caja del paquete oculta
  await expect(page.locator('.paquete-box')).not.toBeVisible();

  // Datos del cliente
  await expect(page.locator('#cliente')).toHaveValue('Juan Pérez García');

  // Inflables visibles con detalle
  await expect(page.locator('#fila_inflables')).toBeVisible();
  await expect(page.locator('#inflables_detalle')).toContainText('Brincolín');
  await expect(page.locator('#inflables_detalle')).toContainText('Castillo');

  // Feria visible con checkmark
  await expect(page.locator('#fila_feria')).toBeVisible();
  await expect(page.locator('#feria_detalle')).toHaveText('✓');

  // Globos y otros: ocultos
  await expect(page.locator('#fila_globos')).not.toBeVisible();
  await expect(page.locator('#fila_otros')).not.toBeVisible();

  // Gran total inicia en 0 (sin precio base)
  await expect(page.locator('#gran_total')).toHaveText('0.00');

  await page.screenshot({ path: 'tests/screenshots/escenario2_solo_inflables.png', fullPage: true });
});

// ─── ESCENARIO 3: Local 1, 50 personas, hamburguesa, viernes ─────────────────
test('Escenario 3 — Local 1, 50 personas, hamburguesa, viernes', async ({ page }) => {
  await abrirContrato(page, 'data3.json');

  // Paquete visible
  await expect(page.locator('.paquete-box')).toBeVisible();
  await expect(page.locator('#paquete_nombre')).toContainText('Local 1');
  await expect(page.locator('#paquete_nombre')).toContainText('50 Personas');
  await expect(page.locator('#paquete_nombre')).toContainText('#3 Hamburguesa');

  // Precio viernes (vie_dom) = 11700
  await expect(page.locator('#precio_paquete')).toHaveText('11700.00');

  // Local 1 incluye arco (no salvavidas)
  await expect(page.locator('#lista_local')).toContainText('1 Arco');
  await expect(page.locator('#lista_local')).not.toContainText('Salvavidas');

  // Paquete 50 personas incluye pastel 1/4
  await expect(page.locator('#lista_paquete')).toContainText('Pastel 1/4 plancha');

  // Globos: sin paquete base de precio diferente, pero hay paquete → "Incluido en paquete"
  await expect(page.locator('#fila_globos')).toBeVisible();
  await expect(page.locator('#globos_detalle')).toHaveText('Incluido en paquete');

  // Inflables e feria: ocultos
  await expect(page.locator('#fila_inflables')).not.toBeVisible();
  await expect(page.locator('#fila_feria')).not.toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/escenario3_local1_hamburguesa.png', fullPage: true });
});

// ─── ESCENARIO 4: Solo local 1, sin paquete de comida ────────────────────────
test('Escenario 4 — Solo Local 1 sin paquete de comida', async ({ page }) => {
  await abrirContrato(page, 'data4.json');

  await expect(page.locator('.paquete-box')).toBeVisible();
  await expect(page.locator('#paquete_nombre')).toContainText('Local 1');
  await expect(page.locator('#paquete_nombre')).toContainText('Solo Renta del Local');

  // Precio fijo Local 1 = 5000
  await expect(page.locator('#precio_paquete')).toHaveText('5000.00');

  // Columna de paquete oculta
  await expect(page.locator('.paquete-col:last-child')).not.toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/escenario4_solo_local1.png', fullPage: true });
});

// ─── ESCENARIO 6: Campos del formulario correctamente llenados ───────────────
test('Escenario 6 — Campos básicos del formulario', async ({ page }) => {
  await abrirContrato(page, 'data.json');

  // Fecha del contrato
  await expect(page.locator('#dia')).toHaveValue('17');
  await expect(page.locator('#mes')).toHaveValue('Marzo');
  await expect(page.locator('#ano')).toHaveValue('26');

  // Datos del cliente
  await expect(page.locator('#cliente')).toHaveValue('María López');
  await expect(page.locator('#contacto')).toHaveValue('6429876543');

  // Cantidades de pago
  await expect(page.locator('#cantidad')).toHaveValue('16280');
  await expect(page.locator('#restante')).toHaveValue('8000');

  // Fecha del evento
  await expect(page.locator('#dia_evento')).toHaveValue('30');
  await expect(page.locator('#mes_evento')).toHaveValue('Marzo');
  await expect(page.locator('#hora')).toHaveValue('6:00');

  await page.screenshot({ path: 'tests/screenshots/escenario6_campos_formulario.png', fullPage: true });
});

// ─── ESCENARIO 7: Gran total suma correctamente con extras ────────────────────
test('Escenario 7 — Gran total con extras ingresados', async ({ page }) => {
  await abrirContrato(page, 'data.json');

  // Precio base: 16280
  await expect(page.locator('#precio_paquete')).toHaveText('16280.00');

  // Ingresar precio de inflables (visible en data.json) y globos
  await page.locator('#precio_inflables').fill('1500', { force: true });
  await page.locator('#precio_globos').fill('800', { force: true });

  // Gran total = 16280 + 1500 + 800 = 18580
  await expect(page.locator('#gran_total')).toHaveText('18580.00');

  await page.screenshot({ path: 'tests/screenshots/escenario7_gran_total_extras.png', fullPage: true });
});

// ─── ESCENARIO 8: Local 1, 100 personas, hotdogs, lunes (precio lun-jue) ──────
test('Escenario 8 — Local 1, 100 personas, hotdogs, lunes', async ({ page }) => {
  await abrirContrato(page, 'data6.json');

  await expect(page.locator('#paquete_nombre')).toContainText('Local 1');
  await expect(page.locator('#paquete_nombre')).toContainText('100 Personas');
  await expect(page.locator('#paquete_nombre')).toContainText('#1 Hot Dogs');

  // Precio lunes-jueves = 11900
  await expect(page.locator('#precio_paquete')).toHaveText('11900.00');

  // Paquete 100 personas incluye pastel 1/2 plancha
  await expect(page.locator('#lista_paquete')).toContainText('Pastel 1/2 plancha');
  await expect(page.locator('#lista_paquete')).toContainText('100 Platillos');

  // Todos los extras ocultos
  await expect(page.locator('#fila_inflables')).not.toBeVisible();
  await expect(page.locator('#fila_feria')).not.toBeVisible();
  await expect(page.locator('#fila_globos')).not.toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/escenario8_local1_hotdogs_lunes.png', fullPage: true });
});

// ─── ESCENARIO 9: Múltiples extras — inflables, feria y otros ────────────────
test('Escenario 9 — Local 2, 50p, pizza, sábado, con múltiples extras', async ({ page }) => {
  await abrirContrato(page, 'data7.json');

  // Precio sábado (vie_dom) Local 2, 50p, pizza = 12880
  await expect(page.locator('#precio_paquete')).toHaveText('12880.00');

  // Inflables visibles
  await expect(page.locator('#fila_inflables')).toBeVisible();
  await expect(page.locator('#inflables_detalle')).toContainText('Brincolín');

  // Feria visible con checkmark
  await expect(page.locator('#fila_feria')).toBeVisible();
  await expect(page.locator('#feria_detalle')).toHaveText('✓');

  // Otros visible
  await expect(page.locator('#fila_otros')).toBeVisible();

  // Globos: oculto (false en JSON)
  await expect(page.locator('#fila_globos')).not.toBeVisible();

  // Nota legal visible
  await expect(page.locator('.nota')).toBeVisible();
  await expect(page.locator('.nota')).toContainText('NOTA:');

  // Firmas visibles
  await expect(page.locator('.firmas')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/escenario9_multiples_extras.png', fullPage: true });
});

// ─── ESCENARIO 5: Local 2 sin alberca, 100 personas, hotdogs, miércoles ──────
test('Escenario 5 — Local 2 sin alberca, hotdogs, miércoles', async ({ page }) => {
  await abrirContrato(page, 'data5.json');

  await expect(page.locator('#paquete_nombre')).toContainText('Local 2');
  await expect(page.locator('#paquete_nombre')).toContainText('Sin Alberca');

  // Precio: 13680 - 1700 = 11980 (lun-jue)
  await expect(page.locator('#precio_paquete')).toHaveText('11980.00');

  // Salvavidas NO debe aparecer en la lista del local
  await expect(page.locator('#lista_local')).not.toContainText('Salvavidas');

  await page.screenshot({ path: 'tests/screenshots/escenario5_local2_sin_alberca.png', fullPage: true });
});
