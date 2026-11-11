# Day 33 Debugging Journal

Verified HTTP statuses and client-side error handling for the Next.js shopping mall order API.

## Verified observations

- GET /api/orders displayed the order list.
- Order ID 0 returned HTTP 400 with an invalid-input message.
- Order ID 1 returned HTTP 200 with order details.
- Order ID abc returned HTTP 400 with an invalid-input message.
- Order ID 999 returned HTTP 404 with a missing-order message.
- Each status was observed in Chrome DevTools Network.

## Context

- On Day 32, moving the API to root app/api/orders/route.ts fixed a route-path 404 caused by using src/app.
- An earlier HTTP 500 response was deliberately returned for testing; it did not establish an actual unexpected server exception.
- A previous Turbopack issue was worked around by running npm run dev -- --webpack.

## Lessons

- 400: Invalid request input, such as a nonnumeric or nonpositive order ID.
- 404: A well-formed ID that does not match an existing order.
- 200: Successful lookup.
- 500: Unexpected internal server error; do not assume an unverified cause.
- fetch does not reject merely because an HTTP response is 400 or 404. Inspect response.ok.
- React should distinguish loading, success, and error states, with a retry path.

## Issue and reproduction

(Add your notes here.)

## Observed response and status

(Add your notes here.)

## Cause hypothesis and evidence

(Add your notes here.)

## Fix and verification

(Add your notes here.)

## Lessons and prevention

(Add your notes here.)