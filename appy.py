from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ── Conexión a PostgreSQL ────────────────────────────────────────────────────
def get_conn():
    return psycopg2.connect(
        host     = os.getenv('PG_HOST',     'localhost'),
        port     = os.getenv('PG_PORT',     '5432'),
        dbname   = os.getenv('PG_DB',       'divertilandia'),
        user     = os.getenv('PG_USER',     'postgres'),
        password = os.getenv('PG_PASSWORD', '')
    )

# ── Archivos estáticos ───────────────────────────────────────────────────────
@app.route('/')
def home():
    return send_from_directory(os.getcwd(), 'index.html')

@app.route('/<path:filename>')
def files(filename):
    return send_from_directory(os.getcwd(), filename)

# ── GET /api/clientes ────────────────────────────────────────────────────────
@app.get('/api/clientes')
def get_clientes():
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT id, cliente, contacto FROM contratos ORDER BY id')
    rows = cur.fetchall()
    cur.close(); conn.close()
    return jsonify([dict(r) for r in rows])

# ── GET /api/contrato/<id> ───────────────────────────────────────────────────
@app.get('/api/contrato/<int:id>')
def get_contrato(id):
    conn = get_conn()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        'SELECT *, nombre_local AS local FROM contratos WHERE id = %s', (id,)
    )
    row = cur.fetchone()
    cur.close(); conn.close()
    if row is None:
        return jsonify({'error': 'No encontrado'}), 404
    return jsonify(dict(row))

# ── Inicio ───────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('Servidor corriendo en http://localhost:3000')
    print('Lista de clientes: http://localhost:3000/api/clientes')
    app.run(debug=True, port=3000)
