/* ============================================================
   Flavours Pan Asian Food – order-rules.js

   Pure pricing rules for the order form. No DOM access, so the
   same functions run in the browser and in the automated tests
   (tests/rules.test.js).

   Advertised rules (hero badges, Order section info cards,
   footer "Policies"):
     • Collection: 10% off orders over £20
     • Delivery:   free on orders of £20 or more (within 3 miles)
                   £2 charge on orders below £20
                   minimum spend £10 for delivery

   All maths is done in whole pence to avoid floating-point
   rounding errors (e.g. 21.90 * 0.9 = 19.709999…).
   ============================================================ */

/* global module */
/* exported ORDER_RULES, toPence, formatPounds, calculateOrderTotals */
"use strict";

const ORDER_RULES = Object.freeze({
    COLLECTION_DISCOUNT_THRESHOLD_PENCE: 2000, /* discount applies OVER £20 */
    COLLECTION_DISCOUNT_RATE: 0.10,
    FREE_DELIVERY_THRESHOLD_PENCE: 2000,       /* free at £20 or more */
    SMALL_ORDER_DELIVERY_CHARGE_PENCE: 200,    /* £2 below £20 */
    DELIVERY_MINIMUM_PENCE: 1000               /* £10 minimum for delivery */
});

/* Convert a pound amount (e.g. 10.95) to whole pence (1095). */
function toPence(pounds) {
    return Math.round(Number(pounds) * 100);
}

/* Format whole pence as a pound string, e.g. 1971 → "£19.71". */
function formatPounds(pence) {
    const sign = pence < 0 ? "-" : "";
    return sign + "£" + (Math.abs(pence) / 100).toFixed(2);
}

/* Calculate the order breakdown.
   items     : [{ price: number (pounds), qty: number }]
   orderType : "delivery" | "collection"
   Returns   : {
     subtotal, discount, deliveryCharge, total  (all in pence),
     canCheckout : boolean,
     notes       : [string]  — user-facing explanations
   } */
function calculateOrderTotals(items, orderType) {
    const rules = ORDER_RULES;
    const subtotal = (items || []).reduce(function (sum, item) {
        return sum + toPence(item.price) * (item.qty || 0);
    }, 0);

    let discount = 0;
    let deliveryCharge = 0;
    let canCheckout = subtotal > 0;
    const notes = [];

    if (subtotal === 0) {
        return {
            subtotal: 0, discount: 0, deliveryCharge: 0, total: 0,
            canCheckout: false, notes: []
        };
    }

    if (orderType === "collection") {
        if (subtotal > rules.COLLECTION_DISCOUNT_THRESHOLD_PENCE) {
            discount = Math.round(subtotal * rules.COLLECTION_DISCOUNT_RATE);
            notes.push("10% collection discount applied.");
        } else {
            notes.push(
                "Spend over " + formatPounds(rules.COLLECTION_DISCOUNT_THRESHOLD_PENCE)
                + " to get 10% off collection."
            );
        }
    } else {
        if (subtotal < rules.DELIVERY_MINIMUM_PENCE) {
            canCheckout = false;
            notes.push(
                "Delivery needs a minimum spend of "
                + formatPounds(rules.DELIVERY_MINIMUM_PENCE)
                + ". Add " + formatPounds(rules.DELIVERY_MINIMUM_PENCE - subtotal)
                + " more, or choose collection."
            );
        } else if (subtotal < rules.FREE_DELIVERY_THRESHOLD_PENCE) {
            deliveryCharge = rules.SMALL_ORDER_DELIVERY_CHARGE_PENCE;
            notes.push(
                formatPounds(deliveryCharge) + " delivery charge on orders under "
                + formatPounds(rules.FREE_DELIVERY_THRESHOLD_PENCE)
                + ". Add " + formatPounds(rules.FREE_DELIVERY_THRESHOLD_PENCE - subtotal)
                + " more for free delivery."
            );
        } else {
            notes.push("Free delivery within 3 miles.");
        }
    }

    return {
        subtotal: subtotal,
        discount: discount,
        deliveryCharge: deliveryCharge,
        total: subtotal - discount + deliveryCharge,
        canCheckout: canCheckout,
        notes: notes
    };
}

/* Allow the automated tests to load this file in Node.js. */
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        ORDER_RULES: ORDER_RULES,
        toPence: toPence,
        formatPounds: formatPounds,
        calculateOrderTotals: calculateOrderTotals
    };
}
