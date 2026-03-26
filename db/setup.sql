-- ============================================================
--  Divertilandia — Base de datos
--  Correr: bash db/crear_db.sh
-- ============================================================

DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS contratos CASCADE;

CREATE TABLE contratos (
  id                SERIAL PRIMARY KEY,
  dia               VARCHAR(2),
  mes               VARCHAR(20),
  ano               VARCHAR(4),
  cliente           VARCHAR(100) NOT NULL,
  contacto          VARCHAR(20),
  cantidad          NUMERIC(10,2),
  cantidad_letras   VARCHAR(200),
  restante          NUMERIC(10,2),
  restante_letras   VARCHAR(200),
  dia_evento        VARCHAR(2),
  mes_evento        VARCHAR(20),
  ano_evento        VARCHAR(4),
  hora              VARCHAR(10),
  dia_semana        VARCHAR(15),
  nombre_local      VARCHAR(20),
  personas          INTEGER,
  paquete           VARCHAR(30),
  alberca           BOOLEAN DEFAULT TRUE,
  inflables         TEXT[],
  feria             BOOLEAN DEFAULT FALSE,
  globos            BOOLEAN DEFAULT FALSE,
  otros             BOOLEAN DEFAULT FALSE,
  creado_en         TIMESTAMP DEFAULT NOW()
);

-- ============================================================
--  10 clientes de ejemplo
-- ============================================================
INSERT INTO contratos
  (dia, mes, ano, cliente, contacto, cantidad, cantidad_letras, restante, restante_letras,
   dia_evento, mes_evento, ano_evento, hora, dia_semana,
   nombre_local, personas, paquete, alberca, inflables, feria, globos, otros)
VALUES
('23', 'Marzo',  '26', 'María López',      '6421234567', 8000.00,  'Ocho mil pesos',                   8280.00, 'Ocho mil doscientos ochenta pesos',
 '30', 'Marzo',  '26', '16:00', 'domingo',   'Local 2', 100, 'pizza',        TRUE,  '{}',                         FALSE, FALSE, FALSE),

('24', 'Marzo',  '26', 'Carlos Ramírez',   '6427654321', 5000.00,  'Cinco mil pesos',                  6700.00, 'Seis mil setecientos pesos',
 '05', 'Abril',  '26', '15:00', 'viernes',   'Local 1',  50, 'hamburguesa',  TRUE,  '{}',                         FALSE, FALSE, FALSE),

('25', 'Marzo',  '26', 'Ana Torres',       '6429988776', 4700.00,  'Cuatro mil setecientos pesos',     6700.00, 'Seis mil setecientos pesos',
 '13', 'Abril',  '26', '14:00', 'lunes',     'Local 2',  50, 'hotdogs',      FALSE, '{}',                         FALSE, FALSE, FALSE),

('18', 'Marzo',  '26', 'Roberto Sánchez',  '6429001122', 2500.00,  'Dos mil quinientos pesos',         2500.00, 'Dos mil quinientos pesos',
 '15', 'Abril',  '26', '15:00', 'lunes',     'Local 1',  NULL, 'solo_local', TRUE,  '{}',                         FALSE, FALSE, FALSE),

('19', 'Marzo',  '26', 'Sofía Méndez',     '6423344556', 6000.00,  'Seis mil pesos',                   5980.00, 'Cinco mil novecientos ochenta pesos',
 '22', 'Abril',  '26', '16:00', 'miércoles', 'Local 2', 100, 'hotdogs',      FALSE, ARRAY['Brincolín'],           FALSE, FALSE, FALSE),

('20', 'Marzo',  '26', 'Luis Herrera',     '6425566778', 7000.00,  'Siete mil pesos',                  8100.00, 'Ocho mil cien pesos',
 '18', 'Abril',  '26', '13:00', 'sábado',    'Local 1', 100, 'pizza',        TRUE,  ARRAY['Brincolín','Tobogán'], TRUE,  FALSE, FALSE),

('21', 'Marzo',  '26', 'Verónica Ríos',    '6428899001', 1500.00,  'Mil quinientos pesos',             1500.00, 'Mil quinientos pesos',
 '25', 'Abril',  '26', '17:00', 'sábado',    NULL,      NULL, NULL,          TRUE,  ARRAY['Tobogán'],             TRUE,  FALSE, FALSE),

('22', 'Marzo',  '26', 'Fernando Castro',  '6421122334', 8000.00,  'Ocho mil pesos',                   8280.00, 'Ocho mil doscientos ochenta pesos',
 '03', 'Mayo',   '26', '15:00', 'domingo',   'Local 2', 100, 'hamburguesa',  TRUE,  '{}',                         FALSE, TRUE,  FALSE),

('23', 'Marzo',  '26', 'Patricia Vega',    '6426677889', 4000.00,  'Cuatro mil pesos',                 6300.00, 'Seis mil trescientos pesos',
 '09', 'Abril',  '26', '14:00', 'jueves',    'Local 1',  50, 'hotdogs',      TRUE,  '{}',                         FALSE, FALSE, FALSE),

('24', 'Marzo',  '26', 'Alejandro Mora',   '6424455667', 5000.00,  'Cinco mil pesos',                  7880.00, 'Siete mil ochocientos ochenta pesos',
 '10', 'Abril',  '26', '16:00', 'viernes',   'Local 2',  50, 'pizza',        TRUE,  '{}',                         FALSE, FALSE, TRUE);
