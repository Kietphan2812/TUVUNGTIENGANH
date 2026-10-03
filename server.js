const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Cấu hình kết nối Neon PostgreSQL
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Tự động kiểm tra và khởi tạo bảng nếu chưa có
  (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id SERIAL PRIMARY KEY,
          score INT NOT NULL,
          total INT NOT NULL,
          percentage INT NOT NULL,
          time_spent VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Đã kết nối Neon PostgreSQL thành công và sẵn sàng bảng quiz_results!');
    } catch (err) {
      console.error('❌ Lỗi kết nối Neon PostgreSQL:', err.message);
    }
  })();
} else {
  console.warn('⚠️ Chưa cấu hình biến môi trường DATABASE_URL');
}

// API Health Check
app.get('/api/health', async (req, res) => {
  if (!pool) {
    return res.json({ status: 'ok', database: 'not_configured' });
  }
  try {
    const dbRes = await pool.query('SELECT NOW() as current_time');
    res.json({ status: 'ok', database: 'connected', time: dbRes.rows[0].current_time });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// API lưu kết quả thi vào Neon SQL
app.post('/api/results', async (req, res) => {
  const { score, total, percentage, time_spent } = req.body;

  if (score === undefined || total === undefined) {
    return res.status(400).json({ success: false, message: 'Thiếu dữ liệu điểm số' });
  }

  if (!pool) {
    return res.status(500).json({ success: false, message: 'Cơ sở dữ liệu chưa được cấu hình' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO quiz_results (score, total, percentage, time_spent)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at;`,
      [parseInt(score), parseInt(total), parseInt(percentage) || 0, time_spent || '']
    );

    res.json({
      success: true,
      message: 'Đã lưu điểm vào Neon PostgreSQL thành công!',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Lỗi khi lưu kết quả:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// API lấy danh sách kết quả gần đây
app.get('/api/results', async (req, res) => {
  if (!pool) {
    return res.status(500).json({ success: false, message: 'Cơ sở dữ liệu chưa được cấu hình' });
  }
  try {
    const result = await pool.query(
      'SELECT id, score, total, percentage, time_spent, created_at FROM quiz_results ORDER BY id DESC LIMIT 20;'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
