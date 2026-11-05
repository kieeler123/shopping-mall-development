# Day 31 — Questions & Answers
> Existing Project Review and Server / Client Boundaries

**Date:** 2026-11-05  |  **Planned study time:** 120 min  |  **Score:** 94/100 (PASS)

## 1. What distinguishes a Route Handler from a Client Component?
Correct answer B: Route Handlers process HTTP requests; Client Components handle interactions. Submitted B, 20/20.

## 2. Why not read localStorage on the server?
The browser localStorage API does not exist in the server environment.

## 3. Does "use client" mean browser-only execution?
No. Client Components may be pre-rendered on the server.

## 4. Why use useSyncExternalStore?
To subscribe to external stores with server and client snapshots.

## 5. Why snapshot order items?
To preserve names and prices as they were when the order was placed.

## 6. Does the storage event fire in the writing document?
No. A custom event can notify listeners in the same document.

## 7. Are customer and admin orders connected?
Not in the inspected code. The admin API files are also missing.

## 8. What is the order completion page limitation?
The last array element is not necessarily the order just completed.

**Tip / 팁 / コツ:** Identify where code runs and where data is stored before making changes.
