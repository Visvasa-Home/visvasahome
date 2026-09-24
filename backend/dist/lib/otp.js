"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
/**
 * OTP Generation & Verification — Shared Lib
 * Backed by Redis. Mock/console in development when no SMS provider is configured.
 */
const node_crypto_1 = __importDefault(require("node:crypto"));
const redis_js_1 = require("./redis.js");
const errors_js_1 = require("./errors.js");
const logger_js_1 = require("./logger.js");
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH ?? '6', 10);
const SMS_PROVIDER = process.env.SMS_PROVIDER; // 'msg91' | 'twilio' | undefined=mock
// ─── Generate ─────────────────────────────────────────────────────────────────
function generateOtp() {
    // Cryptographically random 6-digit OTP
    const max = 10 ** OTP_LENGTH;
    const raw = node_crypto_1.default.randomInt(0, max);
    return raw.toString().padStart(OTP_LENGTH, '0');
}
// ─── Send ─────────────────────────────────────────────────────────────────────
async function sendOtp(phone) {
    const otp = generateOtp();
    await (0, redis_js_1.setOtp)(phone, otp);
    if (!SMS_PROVIDER) {
        // DEV MODE — log to console
        logger_js_1.logger.info({ phone, otp }, '[OTP] DEV — OTP generated (not sent via SMS)');
        return;
    }
    if (SMS_PROVIDER === 'msg91') {
        await sendViaMSG91(phone, otp);
        return;
    }
    if (SMS_PROVIDER === 'twilio') {
        await sendViaTwilio(phone, otp);
        return;
    }
    logger_js_1.logger.warn({ SMS_PROVIDER }, '[OTP] Unknown SMS provider — OTP not sent');
}
// ─── Verify ───────────────────────────────────────────────────────────────────
async function verifyOtp(phone, inputOtp) {
    const storedOtp = await (0, redis_js_1.getOtp)(phone);
    if (!storedOtp)
        throw errors_js_1.Errors.unauthorized('OTP expired or not found');
    // Constant-time comparison to prevent timing attacks
    const match = node_crypto_1.default.timingSafeEqual(Buffer.from(storedOtp, 'utf8'), Buffer.from(inputOtp.trim(), 'utf8'));
    if (!match)
        throw errors_js_1.Errors.unauthorized('Invalid OTP');
    // Single-use: delete after successful verify
    await (0, redis_js_1.deleteOtp)(phone);
}
// ─── SMS Providers ────────────────────────────────────────────────────────────
async function sendViaMSG91(phone, otp) {
    const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
    const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
    const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID ?? 'VSHOME';
    const res = await fetch('https://api.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authkey: MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
            template_id: MSG91_TEMPLATE_ID,
            mobile: `91${phone}`,
            authkey: MSG91_AUTH_KEY,
            otp,
            sender: MSG91_SENDER_ID,
        }),
    });
    if (!res.ok) {
        logger_js_1.logger.error({ status: res.status }, '[OTP] MSG91 send failed');
        throw errors_js_1.Errors.internal('OTP delivery failed');
    }
    logger_js_1.logger.info({ phone }, '[OTP] Sent via MSG91');
}
async function sendViaTwilio(phone, otp) {
    const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_FROM = process.env.TWILIO_FROM_NUMBER;
    const encoded = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64');
    const body = new URLSearchParams({
        To: `+91${phone}`,
        From: TWILIO_FROM,
        Body: `Your VisvasaHome OTP is ${otp}. Valid for 5 minutes. Do not share.`,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${encoded}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });
    if (!res.ok) {
        logger_js_1.logger.error({ status: res.status }, '[OTP] Twilio send failed');
        throw errors_js_1.Errors.internal('OTP delivery failed');
    }
    logger_js_1.logger.info({ phone }, '[OTP] Sent via Twilio');
}
//# sourceMappingURL=otp.js.map