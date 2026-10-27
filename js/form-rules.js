/* ============================================================
   Flavours Pan Asian Food – form-rules.js

   Pure validation rules for the table-booking form and the
   order form. No DOM access, so the same functions run in the
   browser and in the automated tests (tests/rules.test.js).

   Each validate* function returns an object of field errors,
   e.g. { phone: "Enter a valid UK phone number…" }.
   An empty object means the form is valid.
   ============================================================ */

/* global module */
/* exported TEST_CARD_NUMBERS, validateTestCard, BOOKING_RULES, isValidName, isValidUkPhone, isValidEmail,
   isValidUkPostcode, toLocalDateString, validateBooking, validateOrderDetails */
/* jshint strict: global */
"use strict";

const BOOKING_RULES = Object.freeze({
    OPENING_TIME: "16:30",        /* restaurant opens 4:30pm, 7 days */
    LAST_BOOKING_TIME: "22:30",   /* closes 11pm; last table 10:30pm */
    MIN_NOTICE_MINUTES: 30,       /* same-day bookings need 30 mins notice */
    MAX_DAYS_AHEAD: 90,           /* bookings taken up to 90 days ahead */
    GUEST_OPTIONS: ["1", "2", "3", "4", "5", "6", "7", "8+"],
    NOTES_MAX_LENGTH: 200
});

/* Letters (including accented), spaces, apostrophes, hyphens, full stops;
   2–60 characters. */
function isValidName(value) {
    const name = String(value || "").trim();
    return name.length >= 2 &&
        name.length <= 60 &&
        /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' .-]*$/.test(name);
}

/* UK phone numbers: 0 or +44 followed by 9–10 digits.
   Spaces, hyphens and brackets are ignored.
   Valid: 07700 900123, 020 3883 9233, +44 7700 900123 */
function isValidUkPhone(value) {
    const digits = String(value || "").replace(/[\s()-]/g, "");
    return /^(?:0|\+44)[1-9]\d{8,9}$/.test(digits);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim());
}

/* Standard UK postcode format check, e.g. E16 2JJ, SW1A 1AA. */
function isValidUkPostcode(value) {
    return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(String(value || "").trim());
}

/* "YYYY-MM-DD" for a Date, using LOCAL time (not UTC).
   toISOString() uses UTC, which gives yesterday's date between
   midnight and 1am during British Summer Time. */
function toLocalDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
}

function timeToMinutes(hhmm) {
    const match = /^(\d{2}):(\d{2})$/.exec(String(hhmm || ""));
    if (!match) { return NaN; }
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h > 23 || m > 59) { return NaN; }
    return h * 60 + m;
}

/* Parse "YYYY-MM-DD" into a local Date at midnight, or null if invalid
   (also rejects impossible dates such as 2026-02-30). */
function parseLocalDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) { return null; }
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const d = parseInt(match[3], 10);
    const date = new Date(y, m, d);
    if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) {
        return null;
    }
    return date;
}

/* Validate the booking form.
   values : { name, phone, date, time, guests, notes }  (strings)
   now    : Date — injected so tests can fix "today" */
function validateBooking(values, now) {
    const errors = {};
    const rules = BOOKING_RULES;
    const current = now || new Date();
    const v = values || {};

    /* Name */
    if (!String(v.name || "").trim()) {
        errors.name = "Please enter your name.";
    } else if (!isValidName(v.name)) {
        errors.name = "Name must be 2–60 letters (spaces, hyphens and apostrophes allowed).";
    }

    /* Phone */
    if (!String(v.phone || "").trim()) {
        errors.phone = "Please enter a phone number so we can confirm your booking.";
    } else if (!isValidUkPhone(v.phone)) {
        errors.phone = "Enter a valid UK phone number, e.g. 07700 900123 or 020 3883 9233.";
    }

    /* Date */
    const today = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    const lastDate = new Date(today);
    lastDate.setDate(lastDate.getDate() + rules.MAX_DAYS_AHEAD);
    const bookingDate = parseLocalDate(v.date);

    if (!v.date) {
        errors.date = "Please choose a date.";
    } else if (!bookingDate) {
        errors.date = "Please enter a valid date.";
    } else if (bookingDate < today) {
        errors.date = "That date has passed. Please choose today or a future date.";
    } else if (bookingDate > lastDate) {
        errors.date = "We take bookings up to " + rules.MAX_DAYS_AHEAD + " days ahead.";
    }

    /* Time — must be within opening hours (last booking 10:30pm) */
    const minutes = timeToMinutes(v.time);
    const opens = timeToMinutes(rules.OPENING_TIME);
    const lastBooking = timeToMinutes(rules.LAST_BOOKING_TIME);

    if (!v.time) {
        errors.time = "Please choose a time.";
    } else if (isNaN(minutes)) {
        errors.time = "Please enter a valid time.";
    } else if (minutes < opens || minutes > lastBooking) {
        errors.time = "We're open 4:30pm–11pm. Please choose a time between 4:30pm and 10:30pm.";
    } else if (bookingDate && !errors.date &&
            bookingDate.getTime() === today.getTime()) {
        const nowMinutes = current.getHours() * 60 + current.getMinutes();
        if (minutes < nowMinutes + rules.MIN_NOTICE_MINUTES) {
            errors.time = "Same-day bookings need at least " +
                rules.MIN_NOTICE_MINUTES + " minutes' notice. Please choose a later time.";
        }
    }

    /* Guests */
    if (rules.GUEST_OPTIONS.indexOf(String(v.guests || "")) === -1) {
        errors.guests = "Please choose the number of guests.";
    }

    /* Special requests (optional) */
    if (String(v.notes || "").length > rules.NOTES_MAX_LENGTH) {
        errors.notes = "Please keep special requests under " +
            rules.NOTES_MAX_LENGTH + " characters.";
    }

    return errors;
}

/* Validate the customer details on the order form.
   values : { name, phone, email, orderType, address, postcode, withinArea } */
function validateOrderDetails(values) {
    const errors = {};
    const v = values || {};

    if (!String(v.name || "").trim()) {
        errors.name = "Please enter your name.";
    } else if (!isValidName(v.name)) {
        errors.name = "Name must be 2–60 letters (spaces, hyphens and apostrophes allowed).";
    }

    if (!String(v.phone || "").trim()) {
        errors.phone = "Please enter your phone number.";
    } else if (!isValidUkPhone(v.phone)) {
        errors.phone = "Enter a valid UK phone number, e.g. 07700 900123.";
    }

    if (!String(v.email || "").trim()) {
        errors.email = "Please enter your email address.";
    } else if (!isValidEmail(v.email)) {
        errors.email = "Enter a valid email address, e.g. you@example.com.";
    }

    if (v.orderType === "delivery") {
        if (String(v.address || "").trim().length < 5) {
            errors.address = "Please enter your delivery address (house number and street).";
        }
        if (!String(v.postcode || "").trim()) {
            errors.postcode = "Please enter your postcode.";
        } else if (!isValidUkPostcode(v.postcode)) {
            errors.postcode = "Enter a valid UK postcode, e.g. E16 2JJ.";
        }
        if (!v.withinArea) {
            errors.withinArea = "Please confirm your address is within 3 miles of the restaurant (E16 2JJ), or choose collection.";
        }
    }

    return errors;
}

/* ── SIMULATED CARD PAYMENT ──
   The card form is a demonstration only. To make sure nobody types in a
   real card, only published payment-provider TEST numbers are accepted.
   Nothing entered is stored or sent anywhere. */
const TEST_CARD_NUMBERS = Object.freeze([
    "4242424242424242",   /* Visa (test) */
    "4000056655665556",   /* Visa debit (test) */
    "5555555555554444"    /* Mastercard (test) */
]);

/* Luhn checksum used by all real card numbers */
function passesLuhn(digits) {
    let sum = 0;
    for (let i = 0; i < digits.length; i += 1) {
        let d = parseInt(digits.charAt(digits.length - 1 - i), 10);
        if (i % 2 === 1) {
            d *= 2;
            if (d > 9) { d -= 9; }
        }
        sum += d;
    }
    return sum % 10 === 0;
}

/* Validate the simulated card form.
   values : { number, expiry ("MM/YY"), cvc }
   now    : Date — injected so tests can fix "today" */
function validateTestCard(values, now) {
    const errors = {};
    const v = values || {};
    const current = now || new Date();
    const digits = String(v.number || "").replace(/[\s-]/g, "");

    if (!digits) {
        errors.number = "Please enter the test card number 4242 4242 4242 4242.";
    } else if (!/^\d{16}$/.test(digits) || !passesLuhn(digits)) {
        errors.number = "Card number must be 16 digits. Use the test card 4242 4242 4242 4242.";
    } else if (TEST_CARD_NUMBERS.indexOf(digits) === -1) {
        errors.number = "Demo site: real cards are not accepted. Use the test card 4242 4242 4242 4242.";
    }

    const exp = /^(\d{2})\s*\/\s*(\d{2})$/.exec(String(v.expiry || "").trim());
    if (!v.expiry || !String(v.expiry).trim()) {
        errors.expiry = "Please enter an expiry date (MM/YY).";
    } else if (!exp || parseInt(exp[1], 10) < 1 || parseInt(exp[1], 10) > 12) {
        errors.expiry = "Enter the expiry as MM/YY, e.g. 12/30.";
    } else {
        const month = parseInt(exp[1], 10);
        const year = 2000 + parseInt(exp[2], 10);
        /* A card is valid until the end of its expiry month */
        if (new Date(year, month, 1) <= current) {
            errors.expiry = "That expiry date has passed. Use any future date, e.g. 12/30.";
        }
    }

    if (!/^\d{3}$/.test(String(v.cvc || "").trim())) {
        errors.cvc = "Enter a 3-digit security code, e.g. 123.";
    }

    return errors;
}

/* Allow the automated tests to load this file in Node.js. */
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        TEST_CARD_NUMBERS: TEST_CARD_NUMBERS,
        validateTestCard: validateTestCard,
        BOOKING_RULES: BOOKING_RULES,
        isValidName: isValidName,
        isValidUkPhone: isValidUkPhone,
        isValidEmail: isValidEmail,
        isValidUkPostcode: isValidUkPostcode,
        toLocalDateString: toLocalDateString,
        validateBooking: validateBooking,
        validateOrderDetails: validateOrderDetails
    };
}
