# Day 31–40 — Next.js + TypeScript Practical Project Roadmap

Extend the existing Next.js + TypeScript order-management project rather than starting a new one.

> **Learning sequence: core theory → one multiple-choice question → project work → one coding challenge → checks and notes**

## Daily Routine (120 minutes)

| Activity | Time |
|---|---:|
| Core theory | 20 min |
| One multiple-choice question | 5 min |
| Project implementation | 65 min |
| One coding challenge | 20 min |
| TypeScript/ESLint checks and notes | 10 min |

## Day 31–40

| Day | Topic | Core theory | One multiple-choice question | Project task | One final coding challenge | Completion target |
|---|---|---|---|---|---|---|
| **Day 31** | Existing project audit; Client vs Server | App Router, Server/Client Components, Route Handlers | How do Route Handlers differ from Client Components? | Map the existing file structure and order data flow; clarify responsibilities | Place client-only logic in the correct component | Explain the data flow file by file |
| **Day 32** | Route Handlers and GET API | route.ts, GET(), Response.json() | What does a GET Route Handler do? | Inspect /api/orders and improve its JSON response | Write a GET handler returning orders | Call the endpoint and inspect its response |
| **Day 33** | HTTP status codes and errors | Request/Response, response.ok, 200/400/404/500 | Which status code fits each failure? | Improve API success/error responses and UI error handling | Fix a request function using response.ok and try/catch | Show a stable error UI on failure |
| **Day 34** | Dynamic routes and PATCH | Dynamic segments, URL params, PATCH, validation | How is the ID in /api/orders/123 handled? | Connect the status-update API to updateOrderStatus | Implement core PATCH update logic | Keep server and UI status consistent |
| **Day 35** | POST and order creation | POST, JSON body, form state, server validation | How does a request body reach the server? | Connect the order creation form to POST API | Validate input and implement a create function | Show new orders in the list |
| **Day 36** | DELETE and order removal | DELETE, record identification, error handling | What should the UI do if deletion fails? | Connect delete button, confirmation, API, and list update | Update the list only after a successful delete | Delete only the selected order; show failures |
| **Day 37** | Database and persistence | Tables, primary keys, CRUD, persistence | How is in-memory data different from a database? | Inspect current storage and connect a DB if needed | Write a lookup or update data-access function | Retain orders after server restart |
| **Day 38** | Search, filtering, sorting | filter, sort, query params, client/server filtering | How should orders be filtered by status? | Add order search, status filter, and newest-first sort | Write a filter-and-sort function | Find target orders quickly |
| **Day 39** | Debugging and tests | Static analysis vs behavioral tests; basic test structure | Which bugs can TS, ESLint, and tests detect? | Verify CRUD and failure cases | Repair a buggy order-management function | Validate key features and failure paths |
| **Day 40** | Integration and refactoring | Separation of concerns, duplication, maintainability | What belongs in a component vs a custom hook? | Review features, clean up structure, write README | Extract duplicate logic into a hook or function | Demo the feature and explain data flow |

Tip: Inspect and improve existing features instead of rebuilding them. Adjust the daily pace to actual project complexity.

## Assessment

- One multiple-choice question: 20 points
- Project implementation and verification: 50 points
- One coding challenge: 30 points
- Suggested pass mark: 80/100; working functionality matters most.

## Day 40 Definition of Done

- Fetch orders from the server
- Create, update, and delete orders
- Search, filter, and sort
- Persistent storage
- Loading / Error / Empty / Success states
- Type checks, lint checks, and functional verification
- Explain data flow and document the project in README

**Tip:** Write longer code answers in VS Code before submitting.

## Notes

Set up TypeScript/ESLint checks on Day 30 and use them daily. Reuse existing API and database implementations.
