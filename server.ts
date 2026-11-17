import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { NIGERIAN_STATES } from './src/data/states.ts';
import type {
  AvailabilityStatus,
  BrandContactConfig,
  ContactStatus,
  ContactSubmission,
  DepotRecord,
  DepotType,
  DistributorApplication,
  ProductEnquiry,
  ApplicationStatus,
} from './src/types/api.ts';

dotenv.config();

interface LabanDatabase {
  config: BrandContactConfig;
  depots: DepotRecord[];
  distributors: DistributorApplication[];
  contacts: ContactSubmission[];
  productEnquiries: ProductEnquiry[];
}

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'LABAN-ADMIN-2026';
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'laban-store.json');

const CONFIRMED_HUB_SEEDS: Record<
  string,
  { depotName: string; address: string; phone: string; operatingHours: string; availabilityStatus: AvailabilityStatus }
> = {
  Lagos: {
    depotName: 'Lagos Flagship Hub (Ikeja)',
    address: 'Configurable Hub Address — Plot 14, Industrial Commercial Avenue, Ikeja, Lagos',
    phone: process.env.LABAN_PHONE || '+234 800 522 2600',
    operatingHours: 'Mon–Sat, 08:00–18:00',
    availabilityStatus: 'Operational',
  },
  'FCT (Abuja)': {
    depotName: 'Abuja Central Distribution Depot',
    address: 'Configurable Hub Address — Idu Industrial Layout, FCT Abuja',
    phone: process.env.LABAN_PHONE || '+234 800 522 2600',
    operatingHours: 'Mon–Sat, 08:00–17:30',
    availabilityStatus: 'Operational',
  },
  Rivers: {
    depotName: 'Port Harcourt Regional Depot',
    address: 'Configurable Hub Address — Trans-Amadi Industrial Layout, Port Harcourt, Rivers',
    phone: process.env.LABAN_PHONE || '+234 800 522 2600',
    operatingHours: 'Mon–Sat, 08:00–17:30',
    availabilityStatus: 'Operational',
  },
  Kano: {
    depotName: 'Kano Northern Distribution Hub',
    address: 'Configurable Hub Address — Sharada Industrial Estate, Kano',
    phone: process.env.LABAN_PHONE || '+234 800 522 2600',
    operatingHours: 'Mon–Sat, 08:00–17:00',
    availabilityStatus: 'Operational',
  },
  Enugu: {
    depotName: 'Enugu South-East Depot',
    address: 'Configurable Hub Address — Emene Industrial Corridor, Enugu',
    phone: process.env.LABAN_PHONE || '+234 800 522 2600',
    operatingHours: 'Mon–Sat, 08:00–17:00',
    availabilityStatus: 'Operational',
  },
  Oyo: {
    depotName: 'Ibadan Regional Depot',
    address: 'Configurable Hub Address — Oluyole Industrial Estate, Ibadan, Oyo',
    phone: process.env.LABAN_PHONE || '+234 800 522 2600',
    operatingHours: 'Mon–Sat, 08:00–17:30',
    availabilityStatus: 'Operational',
  },
};

function createInitialDatabase(): LabanDatabase {
  const now = new Date().toISOString();
  const defaultPhone = process.env.LABAN_PHONE || '+234 800 522 2600';
  const defaultWhatsapp = process.env.LABAN_WHATSAPP || '2348005222600';
  const defaultEmail = process.env.LABAN_EMAIL || 'hello@labandrink.com';
  const defaultAddress =
    process.env.LABAN_ADDRESS || 'Configurable Head Office — Plot 14, Industrial Commercial Avenue, Ikeja, Lagos, Nigeria';

  const depots: DepotRecord[] = NIGERIAN_STATES.map((item) => {
    const hub = CONFIRMED_HUB_SEEDS[item.name];
    if (hub) {
      return {
        id: `depot-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        state: item.name,
        region: item.region,
        depotName: hub.depotName,
        depotType: 'confirmed_depot',
        address: hub.address,
        phone: hub.phone,
        operatingHours: hub.operatingHours,
        availabilityStatus: hub.availabilityStatus,
        updatedAt: now,
      };
    }

    return {
      id: `coverage-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      state: item.name,
      region: item.region,
      depotName: `${item.name} Coverage & Partner Desk (${item.capital})`,
      depotType: 'coverage_location',
      address: `Wholesale dispatch & distributor onboarding active across ${item.capital} and ${item.name} State via regional hub.`,
      phone: defaultPhone,
      operatingHours: 'Mon–Sat, 08:00–17:00 (Central Dispatch Desk)',
      availabilityStatus: 'Coverage / Enquiry',
      updatedAt: now,
    };
  });

  return {
    config: {
      companyName: 'LABAN DRINK',
      slogan: 'Refreshment for Every Moment.',
      phone: defaultPhone,
      whatsapp: defaultWhatsapp,
      email: defaultEmail,
      officeAddress: defaultAddress,
      businessHours: 'Monday – Saturday, 08:00 – 18:00 WAT',
      socialLinks: {
        instagram: 'https://instagram.com/labandrink',
        facebook: 'https://facebook.com/labandrink',
        x: 'https://x.com/labandrink',
        linkedin: 'https://linkedin.com/company/labandrink',
      },
    },
    depots,
    distributors: [],
    contacts: [],
    productEnquiries: [],
  };
}

function readDb(): LabanDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initial = createInitialDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as LabanDatabase;
  } catch {
    const fallback = createInitialDatabase();
    fs.writeFileSync(DB_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function writeDb(db: LabanDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

const submissionWindow = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (submissionWindow.get(ip) || []).filter((ts) => now - ts < windowMs);
  if (recent.length >= 15) {
    submissionWindow.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionWindow.set(ip, recent);
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

function checkSpamSignals(body: Record<string, unknown>, ip: string): string | null {
  if (typeof body.company_website === 'string' && body.company_website.trim().length > 0) {
    return 'Automated submission rejected.';
  }
  if (typeof body._startedAt === 'number' && Date.now() - body._startedAt < 800) {
    return 'Please review the form details before submitting.';
  }
  if (isRateLimited(ip)) {
    return 'Too many enquiries submitted recently. Please wait a few minutes and try again.';
  }
  return null;
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const provided = req.header('x-admin-key');
  if (!provided || provided !== ADMIN_PASSKEY) {
    res.status(401).json({ error: 'Invalid or missing administrator passkey.' });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  readDb();

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/config', (_req, res) => {
    const db = readDb();
    res.json(db.config);
  });

  app.get('/api/depots', (req, res) => {
    const db = readDb();
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const state = typeof req.query.state === 'string' ? req.query.state.trim() : '';
    const typeFilter = typeof req.query.type === 'string' ? req.query.type.trim() : '';

    const filtered = db.depots.filter((depot) => {
      if (state && state !== 'All States' && depot.state !== state) {
        return false;
      }
      if (typeFilter === 'confirmed_depot' && depot.depotType !== 'confirmed_depot') {
        return false;
      }
      if (typeFilter === 'coverage_location' && depot.depotType !== 'coverage_location') {
        return false;
      }
      if (q) {
        const haystack = `${depot.state} ${depot.region} ${depot.depotName} ${depot.address} ${depot.phone}`.toLowerCase();
        if (!haystack.includes(q)) {
          return false;
        }
      }
      return true;
    });

    const confirmedCount = db.depots.filter((d) => d.depotType === 'confirmed_depot').length;
    const coverageStatesCount = new Set(db.depots.map((d) => d.state)).size;

    res.json({
      depots: filtered,
      stats: {
        totalRecords: db.depots.length,
        confirmedDepots: confirmedCount,
        statesCovered: coverageStatesCount,
      },
    });
  });

  app.post('/api/distributors', (req, res) => {
    const ip = req.ip || 'unknown';
    const body = (req.body || {}) as Record<string, unknown>;
    const spamError = checkSpamSignals(body, ip);
    if (spamError) {
      res.status(400).json({ error: spamError });
      return;
    }

    const fullName = String(body.fullName || '').trim();
    const businessName = String(body.businessName || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const state = String(body.state || '').trim();
    const businessLocation = String(body.businessLocation || '').trim();
    const message = String(body.message || '').trim();

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (businessName.length < 2) {
      res.status(400).json({ error: 'Please enter your business or trading name.' });
      return;
    }
    if (!isValidPhone(phone)) {
      res.status(400).json({ error: 'Please provide a valid Nigerian or international phone number.' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (!NIGERIAN_STATES.some((s) => s.name === state)) {
      res.status(400).json({ error: 'Please select a valid Nigerian state or FCT Abuja.' });
      return;
    }
    if (businessLocation.length < 3) {
      res.status(400).json({ error: 'Please provide your city, town, or market location.' });
      return;
    }
    if (message.length < 10) {
      res.status(400).json({ error: 'Please include a short note about your distribution capacity or enquiry.' });
      return;
    }

    const db = readDb();
    const entry: DistributorApplication = {
      id: `DIST-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      fullName,
      businessName,
      phone,
      email,
      state,
      businessLocation,
      message,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.distributors.unshift(entry);
    writeDb(db);

    res.status(201).json({
      referenceId: entry.id,
      message: 'Your distributor enquiry has been recorded. Our regional trade desk will reach out shortly.',
    });
  });

  app.post('/api/contact', (req, res) => {
    const ip = req.ip || 'unknown';
    const body = (req.body || {}) as Record<string, unknown>;
    const spamError = checkSpamSignals(body, ip);
    if (spamError) {
      res.status(400).json({ error: spamError });
      return;
    }

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (name.length < 2) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (phone && !isValidPhone(phone)) {
      res.status(400).json({ error: 'Please provide a valid phone number.' });
      return;
    }
    if (subject.length < 3) {
      res.status(400).json({ error: 'Please provide a subject for your message.' });
      return;
    }
    if (message.length < 10) {
      res.status(400).json({ error: 'Please enter a message of at least 10 characters.' });
      return;
    }

    const db = readDb();
    const entry: ContactSubmission = {
      id: `MSG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      name,
      email,
      phone,
      subject,
      message,
      status: 'Unread',
      createdAt: new Date().toISOString(),
    };

    db.contacts.unshift(entry);
    writeDb(db);

    res.status(201).json({
      referenceId: entry.id,
      message: 'Thank you for contacting LABAN DRINK. Your message has been received.',
    });
  });

  app.post('/api/product-enquiries', (req, res) => {
    const ip = req.ip || 'unknown';
    const body = (req.body || {}) as Record<string, unknown>;
    const spamError = checkSpamSignals(body, ip);
    if (spamError) {
      res.status(400).json({ error: spamError });
      return;
    }

    const productId = String(body.productId || '').trim();
    const productName = String(body.productName || '').trim();
    const bottleSize = String(body.bottleSize || '').trim();
    const enquiryType = String(body.enquiryType || 'Wholesale').trim() as ProductEnquiry['enquiryType'];
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const state = String(body.state || '').trim();
    const notes = String(body.notes || '').trim();

    if (!productId || !productName) {
      res.status(400).json({ error: 'Please select a LABAN product.' });
      return;
    }
    if (name.length < 2) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }
    if (!isValidPhone(phone)) {
      res.status(400).json({ error: 'Please enter a valid phone number.' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!NIGERIAN_STATES.some((s) => s.name === state)) {
      res.status(400).json({ error: 'Please select a Nigerian state.' });
      return;
    }

    const db = readDb();
    const entry: ProductEnquiry = {
      id: `PROD-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      productId,
      productName,
      bottleSize: bottleSize || 'Standard Case',
      enquiryType: ['Retail', 'Wholesale', 'Event Catering'].includes(enquiryType) ? enquiryType : 'Wholesale',
      name,
      phone,
      email,
      state,
      notes,
      createdAt: new Date().toISOString(),
    };

    db.productEnquiries.unshift(entry);
    writeDb(db);

    res.status(201).json({
      referenceId: entry.id,
      message: `Product enquiry for ${productName} submitted successfully.`,
    });
  });

  app.post('/api/admin/verify', (req, res) => {
    const passkey = typeof req.body?.passkey === 'string' ? req.body.passkey.trim() : '';
    if (!passkey || passkey !== ADMIN_PASSKEY) {
      res.status(401).json({ error: 'Incorrect administrator passkey.' });
      return;
    }
    res.json({ verified: true });
  });

  app.get('/api/admin/overview', requireAdmin, (_req, res) => {
    const db = readDb();
    res.json({
      config: db.config,
      depots: db.depots,
      distributors: db.distributors,
      contacts: db.contacts,
      productEnquiries: db.productEnquiries,
    });
  });

  app.patch('/api/admin/distributors/:id', requireAdmin, (req, res) => {
    const status = String(req.body?.status || '') as ApplicationStatus;
    if (!['New', 'Under Review', 'Approved', 'Declined'].includes(status)) {
      res.status(400).json({ error: 'Invalid distributor application status.' });
      return;
    }
    const db = readDb();
    const target = db.distributors.find((d) => d.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Distributor application not found.' });
      return;
    }
    target.status = status;
    writeDb(db);
    res.json(target);
  });

  app.patch('/api/admin/contacts/:id', requireAdmin, (req, res) => {
    const status = String(req.body?.status || '') as ContactStatus;
    if (!['Unread', 'Responded', 'Archived'].includes(status)) {
      res.status(400).json({ error: 'Invalid contact status.' });
      return;
    }
    const db = readDb();
    const target = db.contacts.find((c) => c.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Contact submission not found.' });
      return;
    }
    target.status = status;
    writeDb(db);
    res.json(target);
  });

  app.patch('/api/admin/config', requireAdmin, (req, res) => {
    const body = (req.body || {}) as Partial<BrandContactConfig>;
    const db = readDb();

    const phone = typeof body.phone === 'string' ? body.phone.trim() : db.config.phone;
    const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.replace(/[^\d]/g, '') : db.config.whatsapp;
    const email = typeof body.email === 'string' ? body.email.trim() : db.config.email;
    const officeAddress = typeof body.officeAddress === 'string' ? body.officeAddress.trim() : db.config.officeAddress;
    const businessHours = typeof body.businessHours === 'string' ? body.businessHours.trim() : db.config.businessHours;

    if (!isValidPhone(phone)) {
      res.status(400).json({ error: 'Invalid telephone number.' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Invalid business email address.' });
      return;
    }

    db.config = {
      ...db.config,
      phone,
      whatsapp: whatsapp || db.config.whatsapp,
      email,
      officeAddress: officeAddress || db.config.officeAddress,
      businessHours: businessHours || db.config.businessHours,
      socialLinks: {
        instagram: body.socialLinks?.instagram?.trim() || db.config.socialLinks.instagram,
        facebook: body.socialLinks?.facebook?.trim() || db.config.socialLinks.facebook,
        x: body.socialLinks?.x?.trim() || db.config.socialLinks.x,
        linkedin: body.socialLinks?.linkedin?.trim() || db.config.socialLinks.linkedin,
      },
    };

    writeDb(db);
    res.json(db.config);
  });

  app.post('/api/admin/depots', requireAdmin, (req, res) => {
    const body = (req.body || {}) as Record<string, unknown>;
    const stateName = String(body.state || '').trim();
    const stateMeta = NIGERIAN_STATES.find((s) => s.name === stateName);
    if (!stateMeta) {
      res.status(400).json({ error: 'Select a valid Nigerian state or FCT Abuja.' });
      return;
    }
    const depotName = String(body.depotName || '').trim();
    const address = String(body.address || '').trim();
    const phone = String(body.phone || '').trim();
    const operatingHours = String(body.operatingHours || '').trim();
    const depotType = (body.depotType === 'coverage_location' ? 'coverage_location' : 'confirmed_depot') as DepotType;
    const availabilityStatus = (
      ['Operational', 'Limited Stock', 'Coverage / Enquiry'].includes(String(body.availabilityStatus))
        ? String(body.availabilityStatus)
        : depotType === 'confirmed_depot'
          ? 'Operational'
          : 'Coverage / Enquiry'
    ) as AvailabilityStatus;

    if (depotName.length < 3 || address.length < 5 || !isValidPhone(phone) || operatingHours.length < 3) {
      res.status(400).json({ error: 'Please complete depot name, address, phone number, and operating hours.' });
      return;
    }

    const db = readDb();
    const created: DepotRecord = {
      id: `depot-${crypto.randomBytes(4).toString('hex')}`,
      state: stateMeta.name,
      region: stateMeta.region,
      depotName,
      depotType,
      address,
      phone,
      operatingHours,
      availabilityStatus,
      updatedAt: new Date().toISOString(),
    };

    db.depots.unshift(created);
    writeDb(db);
    res.status(201).json(created);
  });

  app.patch('/api/admin/depots/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const target = db.depots.find((d) => d.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Depot entry not found.' });
      return;
    }

    const body = (req.body || {}) as Record<string, unknown>;
    if (typeof body.state === 'string') {
      const stateMeta = NIGERIAN_STATES.find((s) => s.name === body.state);
      if (!stateMeta) {
        res.status(400).json({ error: 'Invalid Nigerian state.' });
        return;
      }
      target.state = stateMeta.name;
      target.region = stateMeta.region;
    }
    if (typeof body.depotName === 'string' && body.depotName.trim().length >= 3) {
      target.depotName = body.depotName.trim();
    }
    if (typeof body.address === 'string' && body.address.trim().length >= 5) {
      target.address = body.address.trim();
    }
    if (typeof body.phone === 'string') {
      if (!isValidPhone(body.phone)) {
        res.status(400).json({ error: 'Invalid depot phone number.' });
        return;
      }
      target.phone = body.phone.trim();
    }
    if (typeof body.operatingHours === 'string' && body.operatingHours.trim().length >= 3) {
      target.operatingHours = body.operatingHours.trim();
    }
    if (body.depotType === 'confirmed_depot' || body.depotType === 'coverage_location') {
      target.depotType = body.depotType;
    }
    if (
      body.availabilityStatus === 'Operational' ||
      body.availabilityStatus === 'Limited Stock' ||
      body.availabilityStatus === 'Coverage / Enquiry'
    ) {
      target.availabilityStatus = body.availabilityStatus;
    }

    target.updatedAt = new Date().toISOString();
    writeDb(db);
    res.json(target);
  });

  app.delete('/api/admin/depots/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const index = db.depots.findIndex((d) => d.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Depot entry not found.' });
      return;
    }
    const [removed] = db.depots.splice(index, 1);
    writeDb(db);
    res.json({ deleted: removed.id });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LABAN DRINK server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start LABAN DRINK server:', err);
  process.exit(1);
});
