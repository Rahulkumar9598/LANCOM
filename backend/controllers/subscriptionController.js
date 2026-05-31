import crypto from 'crypto';
import Department from '../models/Department.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import UsedNonce from '../models/UsedNonce.js';
import TimeLog from '../models/TimeLog.js';
import ActivationHistory from '../models/ActivationHistory.js';

const ALGO = 'aes-256-cbc';

function getKey() {
  // Pad/truncate to exactly 32 bytes
  return Buffer.from((process.env.LICENSE_ENCRYPTION_KEY || '').padEnd(32, '0').slice(0, 32));
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const [ivHex, encHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}

function sign(payload) {
  return crypto
    .createHmac('sha256', process.env.LICENSE_SECRET || 'secret')
    .update(JSON.stringify(payload))
    .digest('hex');
}

// ─── CONTACT INFO (public) ────────────────────────────────────────────────────

export const getContactInfo = async (req, res) => {
  try {
    const superadmin = await Department.findOne({ role: 'superadmin' })
      .select('email phone headName')
      .lean();
    res.json({
      success: true,
      contact: {
        name: superadmin?.headName || 'Administrator',
        email: superadmin?.email || '',
        phone: superadmin?.phone || '',
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── PLANS ───────────────────────────────────────────────────────────────────

export const getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ months: 1 });
    res.json({ success: true, plans });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ months: 1 });
    res.json({ success: true, plans });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { name, months, price, description, features } = req.body;
    if (!name || !months || !price)
      return res.status(400).json({ success: false, message: 'name, months and price are required' });
    const plan = await SubscriptionPlan.create({ name, months, price, description, features });
    res.json({ success: true, plan });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, plan });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    await SubscriptionPlan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Plan deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── GENERATE ACTIVATION FILE ────────────────────────────────────────────────

export const generateActivationFile = async (req, res) => {
  try {
    const { adminId, planId } = req.body;

    const admin = await Department.findById(adminId);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const issuedAt = new Date();
    // Start from current expiry if still active, else from now
    const baseDate = admin.serviceExpiresAt && new Date(admin.serviceExpiresAt) > issuedAt
      ? new Date(admin.serviceExpiresAt)
      : issuedAt;

    const expiresAt = new Date(baseDate);
    expiresAt.setMonth(expiresAt.getMonth() + plan.months);

    const nonce = crypto.randomUUID();

    const payload = {
      adminId: admin._id.toString(),
      adminEmail: admin.email,
      planId: plan._id.toString(),
      planName: plan.name,
      months: plan.months,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      nonce,
    };

    payload.hmac = sign(payload);

    const encrypted = encrypt(JSON.stringify(payload));
    const fileContent = Buffer.from(encrypted, 'utf8').toString('base64');

    // Save to history
    await ActivationHistory.create({
      adminId: admin._id,
      adminEmail: admin.email,
      adminDepartment: admin.department,
      generatedBy: req.department._id,
      type: 'plan',
      planName: plan.name,
      months: plan.months,
      issuedAt,
      expiresAt,
      nonce,
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${admin.department}_${plan.name.replace(/\s/g,'_')}.lca"`);
    res.send(fileContent);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── ACTIVATE LICENSE FILE ────────────────────────────────────────────────────

export const activateLicense = async (req, res) => {
  try {
    const { fileContent } = req.body;
    if (!fileContent) return res.status(400).json({ success: false, message: 'No file content provided' });

    // Decode base64 → decrypt → parse JSON
    let payload;
    try {
      const encrypted = Buffer.from(fileContent, 'base64').toString('utf8');
      const decrypted = decrypt(encrypted);
      payload = JSON.parse(decrypted);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid or corrupted activation file' });
    }

    // Verify HMAC
    const { hmac, ...rest } = payload;
    const expectedHmac = sign(rest);
    if (hmac !== expectedHmac)
      return res.status(400).json({ success: false, message: 'Activation file has been tampered' });

    // Check nonce not used before
    const nonceUsed = await UsedNonce.findOne({ nonce: payload.nonce });
    if (nonceUsed)
      return res.status(400).json({ success: false, message: 'Activation file already used' });

    // Check not expired at issuance level (file itself isn't too old — 90 day grace)
    const issuedAt = new Date(payload.issuedAt);
    const daysSinceIssued = (Date.now() - issuedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceIssued > 90)
      return res.status(400).json({ success: false, message: 'Activation file expired (issued more than 90 days ago)' });

    const admin = await Department.findById(payload.adminId);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin account not found' });

    // Save nonce so it can't be reused
    await UsedNonce.create({ nonce: payload.nonce, adminId: payload.adminId });

    // Mark history entry as used
    await ActivationHistory.findOneAndUpdate(
      { nonce: payload.nonce },
      { status: 'used', usedAt: new Date() }
    );

    // Activate
    admin.serviceExpiresAt = new Date(payload.expiresAt);
    admin.serviceDurationMonths = payload.months;
    admin.lastSeenAt = new Date();
    await admin.save();

    res.json({
      success: true,
      message: `Subscription activated! Valid until ${new Date(payload.expiresAt).toLocaleDateString()}`,
      expiresAt: payload.expiresAt,
      plan: payload.planName,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── SUBSCRIPTION STATUS ─────────────────────────────────────────────────────

export const getSubscriptionStatus = async (req, res) => {
  try {
    const admin = await Department.findById(req.department._id).select('serviceExpiresAt serviceDurationMonths department email');
    const now = new Date();
    const expiresAt = admin.serviceExpiresAt ? new Date(admin.serviceExpiresAt) : null;

    // null = no subscription date set = unrestricted (superadmin hasn't set one yet)
    const noExpiry = expiresAt === null;
    const isActive = noExpiry ? true : expiresAt > now;
    const daysLeft = expiresAt ? Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)) : null;

    res.json({
      success: true,
      isActive,
      noExpiry,
      expiresAt: admin.serviceExpiresAt,
      daysLeft: isActive && daysLeft ? Math.max(0, daysLeft) : 0,
      plan: admin.serviceDurationMonths ? `${admin.serviceDurationMonths} months` : null,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── ALL ADMINS SUBSCRIPTION (superadmin) ────────────────────────────────────

export const getAllAdminSubscriptions = async (req, res) => {
  try {
    const admins = await Department.find({ role: 'admin' })
      .select('department email serviceExpiresAt serviceDurationMonths status lastSeenAt')
      .sort({ department: 1 });

    const now = new Date();
    const result = admins.map(a => ({
      _id: a._id,
      department: a.department,
      email: a.email,
      status: a.status,
      serviceExpiresAt: a.serviceExpiresAt,
      isActive: a.serviceExpiresAt ? new Date(a.serviceExpiresAt) > now : false,
      daysLeft: a.serviceExpiresAt
        ? Math.max(0, Math.ceil((new Date(a.serviceExpiresAt) - now) / (1000 * 60 * 60 * 24)))
        : 0,
      serviceDurationMonths: a.serviceDurationMonths,
      lastSeenAt: a.lastSeenAt,
    }));

    res.json({ success: true, admins: result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── EMERGENCY EXTENSION ─────────────────────────────────────────────────────

export const emergencyExtend = async (req, res) => {
  try {
    const { adminId, value, unit } = req.body;
    if (!adminId || !value || !unit) {
      return res.status(400).json({ success: false, message: 'adminId, value and unit are required' });
    }

    const admin = await Department.findById(adminId);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const msMap = { minutes: 60 * 1000, hours: 60 * 60 * 1000, days: 24 * 60 * 60 * 1000 };
    const ms = msMap[unit];
    if (!ms) return res.status(400).json({ success: false, message: 'unit must be minutes, hours or days' });

    const now = new Date();
    const base = admin.serviceExpiresAt && new Date(admin.serviceExpiresAt) > now
      ? new Date(admin.serviceExpiresAt)
      : now;

    const expiresAt = new Date(base.getTime() + Number(value) * ms);
    const issuedAt = now;
    const nonce = crypto.randomUUID();
    const durationLabel = `${value} ${unit}`;

    // Build .lca payload
    const payload = {
      adminId: admin._id.toString(),
      adminEmail: admin.email,
      planId: 'emergency',
      planName: `Emergency (${durationLabel})`,
      months: null,
      emergencyDuration: durationLabel,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      nonce,
    };
    payload.hmac = sign(payload);
    const encrypted = encrypt(JSON.stringify(payload));
    const fileContent = Buffer.from(encrypted, 'utf8').toString('base64');

    // Directly extend in DB too
    admin.serviceExpiresAt = expiresAt;
    admin.lastSeenAt = now;
    await admin.save();

    // Save nonce as used (emergency directly activates — no upload needed)
    await UsedNonce.create({ nonce, adminId: admin._id.toString() });

    // Save to history
    await ActivationHistory.create({
      adminId: admin._id,
      adminEmail: admin.email,
      adminDepartment: admin.department,
      generatedBy: req.department._id,
      type: 'emergency',
      planName: `Emergency (${durationLabel})`,
      emergencyDuration: durationLabel,
      issuedAt,
      expiresAt,
      nonce,
      status: 'used',
      usedAt: now,
    });

    res.json({
      success: true,
      message: `Extended by ${durationLabel}. Expires: ${expiresAt.toLocaleString()}`,
      expiresAt,
      department: admin.department,
      fileContent,
      fileName: `${admin.department}_emergency_${durationLabel.replace(/\s/g,'_')}.lca`,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── HISTORY ─────────────────────────────────────────────────────────────────

export const getAdminHistory = async (req, res) => {
  try {
    const history = await ActivationHistory.find({ adminId: req.department._id })
      .sort({ issuedAt: -1 })
      .limit(20)
      .lean();
    res.json({ success: true, history });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getSuperadminHistory = async (req, res) => {
  try {
    const { adminId } = req.query;
    const filter = adminId ? { adminId } : {};
    const history = await ActivationHistory.find(filter)
      .sort({ issuedAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, history });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── HEARTBEAT (called on every auth'd request) ───────────────────────────────

export const recordHeartbeat = async (adminId) => {
  try {
    const now = new Date();
    const day = now.toISOString().split('T')[0];

    // Update lastSeenAt on department
    await Department.findByIdAndUpdate(adminId, { lastSeenAt: now });

    // Insert today's log (ignore duplicate — one per day)
    await TimeLog.create({ adminId, day, recordedAt: now }).catch(() => {});
  } catch (_) {}
};
