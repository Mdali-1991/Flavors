/* ============================================================
   Automated unit tests for the order pricing and form rules.

   Run with Node.js 18+ (no packages needed):
       node --test

   These cover the two defects raised in tutor feedback:
     • booking form accepted empty / invalid input
     • collection discount and delivery rules were not applied
   ============================================================ */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { calculateOrderTotals, formatPounds } = require("../js/order-rules.js");
const {
    validateBooking, validateOrderDetails, isValidUkPhone, isValidUkPostcode,
    toLocalDateString
} = require("../js/form-rules.js");
const { MENU_FALLBACK } = require("../js/menu-fallback.js");

/* Fixed "now" for date/time tests: Wednesday 21 Oct 2026, 2:00pm local */
const NOW = new Date(2026, 9, 21, 14, 0);

function validBooking(overrides) {
    return Object.assign({
        name: "Jane Smith",
        phone: "07700 900123",
        date: "2026-10-24",
        time: "19:30",
        guests: "2",
        notes: ""
    }, overrides);
}

/* ── ORDER PRICING ── */

test("collection £21.90 gets 10% off → £19.71 (tutor's test case)", function () {
    const t = calculateOrderTotals([{ price: 10.95, qty: 2 }], "collection");
    assert.equal(t.subtotal, 2190);
    assert.equal(t.discount, 219);
    assert.equal(t.deliveryCharge, 0);
    assert.equal(t.total, 1971);
    assert.equal(formatPounds(t.total), "£19.71");
});

test("collection exactly £20.00 gets no discount (offer is OVER £20)", function () {
    const t = calculateOrderTotals([{ price: 10.00, qty: 2 }], "collection");
    assert.equal(t.discount, 0);
    assert.equal(t.total, 2000);
});

test("collection £20.01 gets the discount", function () {
    const t = calculateOrderTotals([{ price: 20.01, qty: 1 }], "collection");
    assert.equal(t.discount, 200);
    assert.equal(t.total, 1801);
});

test("collection under £20 is allowed with no discount", function () {
    const t = calculateOrderTotals([{ price: 5.95, qty: 1 }], "collection");
    assert.equal(t.canCheckout, true);
    assert.equal(t.total, 595);
});

test("delivery £21.90 is free and gets no collection discount", function () {
    const t = calculateOrderTotals([{ price: 10.95, qty: 2 }], "delivery");
    assert.equal(t.discount, 0);
    assert.equal(t.deliveryCharge, 0);
    assert.equal(t.total, 2190);
});

test("delivery exactly £20.00 is free", function () {
    const t = calculateOrderTotals([{ price: 10.00, qty: 2 }], "delivery");
    assert.equal(t.deliveryCharge, 0);
    assert.equal(t.total, 2000);
});

test("delivery £10.95 adds the £2 small-order charge → £12.95", function () {
    const t = calculateOrderTotals([{ price: 10.95, qty: 1 }], "delivery");
    assert.equal(t.deliveryCharge, 200);
    assert.equal(t.total, 1295);
    assert.equal(t.canCheckout, true);
});

test("delivery exactly £10.00 is allowed with £2 charge", function () {
    const t = calculateOrderTotals([{ price: 5.00, qty: 2 }], "delivery");
    assert.equal(t.canCheckout, true);
    assert.equal(t.total, 1200);
});

test("delivery £5.95 is below the £10 minimum and is blocked", function () {
    const t = calculateOrderTotals([{ price: 5.95, qty: 1 }], "delivery");
    assert.equal(t.canCheckout, false);
    assert.match(t.notes.join(" "), /minimum spend of £10\.00/);
});

test("empty cart cannot check out", function () {
    const t = calculateOrderTotals([], "delivery");
    assert.equal(t.canCheckout, false);
    assert.equal(t.total, 0);
});

test("pence maths avoids floating-point errors (3 × £1.95 = £5.85)", function () {
    const t = calculateOrderTotals([{ price: 1.95, qty: 3 }], "collection");
    assert.equal(t.subtotal, 585);
});

/* ── BOOKING VALIDATION ── */

test("empty booking form is rejected on every required field", function () {
    const errors = validateBooking({ name: "", phone: "", date: "", time: "", guests: "", notes: "" }, NOW);
    assert.deepEqual(Object.keys(errors).sort(), ["date", "guests", "name", "phone", "time"]);
});

test("valid booking passes", function () {
    assert.deepEqual(validateBooking(validBooking(), NOW), {});
});

test("whitespace-only name is rejected", function () {
    assert.ok(validateBooking(validBooking({ name: "   " }), NOW).name);
});

test("name with digits is rejected", function () {
    assert.ok(validateBooking(validBooking({ name: "J4ne" }), NOW).name);
});

test("invalid phone numbers are rejected", function () {
    ["12345", "abcdefghijk", "0770090", "077009001234", "+1 202 555 0100"].forEach(function (p) {
        assert.ok(validateBooking(validBooking({ phone: p }), NOW).phone, p + " should fail");
    });
});

test("UK mobile, landline and +44 formats are accepted", function () {
    ["07700 900123", "07700900123", "020 3883 9233", "+44 7700 900123", "(020) 3883-9233"].forEach(function (p) {
        assert.equal(isValidUkPhone(p), true, p + " should pass");
    });
});

test("past date is rejected", function () {
    assert.match(validateBooking(validBooking({ date: "2026-10-20" }), NOW).date, /passed/);
});

test("date more than 90 days ahead is rejected", function () {
    assert.ok(validateBooking(validBooking({ date: "2027-01-20" }), NOW).date);
});

test("impossible date (30 February) is rejected", function () {
    assert.ok(validateBooking(validBooking({ date: "2027-02-30" }), NOW).date);
});

test("time before opening (16:00) is rejected", function () {
    assert.match(validateBooking(validBooking({ time: "16:00" }), NOW).time, /4:30pm/);
});

test("time after last booking (22:45) is rejected", function () {
    assert.ok(validateBooking(validBooking({ time: "22:45" }), NOW).time);
});

test("opening (16:30) and last booking (22:30) boundaries are accepted", function () {
    assert.equal(validateBooking(validBooking({ time: "16:30" }), NOW).time, undefined);
    assert.equal(validateBooking(validBooking({ time: "22:30" }), NOW).time, undefined);
});

test("same-day booking needs 30 minutes' notice", function () {
    const at1800 = new Date(2026, 9, 21, 18, 0);
    assert.ok(validateBooking(validBooking({ date: "2026-10-21", time: "18:15" }), at1800).time);
    assert.equal(validateBooking(validBooking({ date: "2026-10-21", time: "18:30" }), at1800).time, undefined);
});

test("guests must be chosen", function () {
    assert.ok(validateBooking(validBooking({ guests: "" }), NOW).guests);
    assert.equal(validateBooking(validBooking({ guests: "8+" }), NOW).guests, undefined);
});

test("special requests over 200 characters are rejected", function () {
    assert.ok(validateBooking(validBooking({ notes: "x".repeat(201) }), NOW).notes);
});

test("toLocalDateString uses local date, not UTC", function () {
    assert.equal(toLocalDateString(new Date(2026, 9, 22, 0, 30)), "2026-10-22");
});

/* ── ORDER DETAILS VALIDATION ── */

test("delivery order needs address, postcode and 3-mile confirmation", function () {
    const errors = validateOrderDetails({
        name: "Jane Smith", phone: "07700 900123", email: "jane@example.com",
        orderType: "delivery", address: "", postcode: "", withinArea: false
    });
    assert.deepEqual(Object.keys(errors).sort(), ["address", "postcode", "withinArea"]);
});

test("collection order does not need an address", function () {
    assert.deepEqual(validateOrderDetails({
        name: "Jane Smith", phone: "07700 900123", email: "jane@example.com",
        orderType: "collection"
    }), {});
});

test("invalid email and postcode are rejected", function () {
    const errors = validateOrderDetails({
        name: "Jane Smith", phone: "07700 900123", email: "jane@",
        orderType: "delivery", address: "12 Example Street", postcode: "12345", withinArea: true
    });
    assert.ok(errors.email);
    assert.ok(errors.postcode);
    assert.equal(isValidUkPostcode("E16 2JJ"), true);
});

/* ── DATA ── */

test("MENU_FALLBACK matches assets/data/menu.json", function () {
    const json = JSON.parse(fs.readFileSync(
        path.join(__dirname, "..", "assets", "data", "menu.json"), "utf8"
    ));
    assert.deepEqual(MENU_FALLBACK, json);
});
