const express  = require('express');
const multer   = require('multer');
const cors     = require('cors');
const path     = require('path');

const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } }); // 200MB limit

// ── CORS — only allow your site ──────────────────────────────
// Change this to your actual domain in production
const ALLOWED_ORIGINS = [
  'https://nebuxmc.com',
  'https://www.nebuxmc.com',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed'));
  }
}));

app.use(express.json());

const { registerBrarchiveRoutes }    = require('./brarchive');
const { registerSoundConverterRoutes } = require('./soundconverter');
const { registerUnicodeRoutes }      = require('./unicode');
const { registerAnimatedMenuRoutes } = require('./animatedmenu');
const { registerOggConvertRoutes }   = require('./ogg-convert');
const { registerContactRoutes }      = require('./contact');

// ── Health check — UptimeRobot pings this to keep server awake
app.get('/ping', (req, res) => res.json({ status: 'ok', time: Date.now() }));

// ── BRARCHIVE ROUTES ──────────────────────────────────────────
registerBrarchiveRoutes(app, upload);

// ── UNICODE ENCRYPTOR ROUTES ──────────────────────────────────
registerUnicodeRoutes(app, upload);

// ── ANIMATED MENU ROUTES ─────────────────────────────────────
registerAnimatedMenuRoutes(app, upload);

// ── SOUND CONVERTER ROUTES ───────────────────────────────────
registerSoundConverterRoutes(app, upload);

// ── OGG CONVERTER ROUTES ─────────────────────────────────────
registerOggConvertRoutes(app, upload);

// ── CONTACT FORM ROUTE ───────────────────────────────────────
// Allow contact form from any origin (it's a public form)
app.options('/api/contact', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});
registerContactRoutes(app);

// ── START ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NeBuxMC API running on port ${PORT}`));
