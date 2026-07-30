import type { RoadmapTrack } from "@/types";

const trackId = "backend";

export const backendTrack: RoadmapTrack = {
  id: trackId,
  name: "Backend Development",
  description:
    "From JavaScript fundamentals to a deployed, authenticated REST API — the path most people mean when they say 'backend dev'.",
  topics: [
    // ---------------------------------------------------------------- Tier 1
    {
      id: "javascript-fundamentals",
      trackId,
      tier: 1,
      name: "JavaScript Fundamentals",
      description: "Variables, functions, scope, and the quirks that trip everyone up once.",
      theory:
        "JavaScript is the language every backend topic here builds on, even once you're writing Node instead of browser code. Get comfortable with variables and scope (var vs let vs const), functions and closures, array and object methods, and how `this` behaves in different contexts.\n\nThe part most courses rush past is asynchronous code: callbacks, Promises, and async/await are the same idea shown three ways, and Node's entire model depends on you being fluent in it. Spend real time here — everything downstream assumes it.",
      difficulty: "Beginner",
      estimatedHours: 8,
      size: "large",
      xpReward: 150,
      prerequisites: [],
      skillIds: ["javascript"],
      resources: [
        { label: "MDN — JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", kind: "doc" },
        { label: "javascript.info — The Modern JavaScript Tutorial", url: "https://javascript.info/", kind: "doc" },
        { label: "Eloquent JavaScript (free online book)", url: "https://eloquentjavascript.net/", kind: "book" },
      ],
    },
    {
      id: "git-basics",
      trackId,
      tier: 1,
      name: "Git & Version Control",
      description: "Commits, branches, and the workflow every project on your roadmap will use.",
      theory:
        "Git tracks changes to your code over time so you can experiment, branch, and roll back without fear. Learn the core loop — add, commit, push, pull — then branching and merging, and how to write commit messages your future self will thank you for.\n\nGitHub is where you'll host every project you submit for review in this roadmap, so a clean repository with a real README is part of the skill, not an afterthought.",
      difficulty: "Beginner",
      estimatedHours: 4,
      size: "medium",
      xpReward: 75,
      prerequisites: [],
      skillIds: ["git", "github"],
      resources: [
        { label: "Git — Official Documentation", url: "https://git-scm.com/doc", kind: "doc" },
        { label: "GitHub Docs — Get started", url: "https://docs.github.com/en/get-started", kind: "doc" },
      ],
    },

    // ---------------------------------------------------------------- Tier 2
    {
      id: "node-basics",
      trackId,
      tier: 2,
      name: "Node.js Basics",
      description: "Running JavaScript outside the browser: the runtime, globals, and CLI scripts.",
      theory:
        "Node.js takes the JavaScript engine out of the browser and gives it access to the file system, network, and OS — which is what makes a backend possible. Learn the global objects (process, __dirname), how the CLI and npm scripts work, and how to structure a small Node project.\n\nThis topic is intentionally light on 'theory' and heavy on running things — the deeper mechanics (the event loop, streams) get their own topics next.",
      difficulty: "Beginner",
      estimatedHours: 6,
      size: "medium",
      xpReward: 75,
      prerequisites: ["javascript-fundamentals"],
      skillIds: ["node"],
      resources: [
        { label: "Node.js — Official Docs", url: "https://nodejs.org/en/docs", kind: "doc" },
        { label: "Node.js — Introduction to Node.js", url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs", kind: "doc" },
      ],
    },
    {
      id: "typescript-fundamentals",
      trackId,
      tier: 2,
      name: "TypeScript Fundamentals",
      description: "Static types on top of JavaScript — interfaces, generics, and safer refactors.",
      theory:
        "TypeScript adds a type layer that catches whole categories of bugs before you ever run the code. Start with basic types and interfaces, then function typing, unions, and generics.\n\nYou don't need TypeScript to build the projects ahead, but every Express and Node topic from here on assumes you can read typed code, since that's the standard in most real backend codebases today.",
      difficulty: "Beginner",
      estimatedHours: 6,
      size: "medium",
      xpReward: 75,
      prerequisites: ["javascript-fundamentals"],
      skillIds: ["typescript"],
      resources: [
        { label: "TypeScript — Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", kind: "doc" },
        { label: "TypeScript — TS for JS Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html", kind: "doc" },
      ],
    },

    // ---------------------------------------------------------------- Tier 3
    {
      id: "node-modules-npm",
      trackId,
      tier: 3,
      name: "Modules & npm",
      description: "CommonJS vs ESM, package.json, semver, and dependency management.",
      theory:
        "Every real Node project is a graph of small modules pulled in through npm. Learn the difference between CommonJS (require) and ES modules (import), what package.json and package-lock.json actually track, and how semantic versioning (^, ~, exact) affects what you install.\n\nThis is also where good habits start: separating dependencies from devDependencies, and understanding what `npm install` is doing before you run it blindly.",
      difficulty: "Beginner",
      estimatedHours: 3,
      size: "small",
      xpReward: 40,
      prerequisites: ["node-basics"],
      skillIds: ["node"],
      resources: [
        { label: "npm Docs — About package.json", url: "https://docs.npmjs.com/cli/v10/configuring-npm/package-json", kind: "doc" },
        { label: "Node.js — Modules: CommonJS vs ES Modules", url: "https://nodejs.org/api/esm.html", kind: "doc" },
      ],
    },
    {
      id: "filesystem-path",
      trackId,
      tier: 3,
      name: "File System & Path",
      description: "Reading, writing, and navigating files with fs and path.",
      theory:
        "The `fs` and `path` modules are how Node scripts touch the disk — reading config files, writing logs, or serving static assets. Learn the sync vs async vs promise-based fs APIs, and why blocking the event loop with a sync call in a server is usually a mistake.\n\n`path` handles the cross-platform quirks of file paths so your code doesn't break the moment someone runs it on Windows instead of your Mac.",
      difficulty: "Beginner",
      estimatedHours: 3,
      size: "small",
      xpReward: 40,
      prerequisites: ["node-basics"],
      skillIds: ["node"],
      resources: [
        { label: "Node.js — File system (fs)", url: "https://nodejs.org/api/fs.html", kind: "doc" },
        { label: "Node.js — Path", url: "https://nodejs.org/api/path.html", kind: "doc" },
      ],
    },

    // ---------------------------------------------------------------- Tier 4
    {
      id: "express-fundamentals",
      trackId,
      tier: 4,
      name: "Express Fundamentals",
      description: "The de-facto Node web framework: apps, requests, and responses.",
      theory:
        "Express wraps Node's raw `http` module in a much friendlier API for building web servers. Learn how to create an app instance, respond to requests, send JSON, and read the request/response objects.\n\nThis topic is the gateway to almost everything else in this track — routing, middleware, and authentication are all Express concepts built on this foundation.",
      difficulty: "Intermediate",
      estimatedHours: 5,
      size: "medium",
      xpReward: 75,
      prerequisites: ["node-modules-npm"],
      skillIds: ["express", "node"],
      resources: [
        { label: "Express — Getting Started", url: "https://expressjs.com/en/starter/installing.html", kind: "doc" },
        { label: "Express — Guide", url: "https://expressjs.com/en/guide/routing.html", kind: "doc" },
      ],
      relatedProjectHint: "Build a tiny 'hello API' with two or three JSON endpoints.",
    },
    {
      id: "event-loop",
      trackId,
      tier: 4,
      name: "The Event Loop",
      description: "Why Node is non-blocking, and what that actually means for your code.",
      theory:
        "The event loop is how a single-threaded runtime handles thousands of concurrent connections without spawning a thread per request. Learn the phases (timers, I/O callbacks, poll, check), and the difference between the call stack, the microtask queue (Promises), and the macrotask queue (setTimeout, I/O).\n\nUnderstanding this turns 'why is my code running in this order' from a mystery into something you can reason about directly from the source.",
      difficulty: "Intermediate",
      estimatedHours: 5,
      size: "medium",
      xpReward: 75,
      prerequisites: ["node-modules-npm"],
      skillIds: ["node"],
      resources: [
        { label: "Node.js — The Event Loop", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", kind: "doc" },
      ],
    },
    {
      id: "mongodb-basics",
      trackId,
      tier: 4,
      name: "MongoDB & Mongoose",
      description: "Document databases, schemas, and CRUD from Node.",
      theory:
        "MongoDB stores JSON-like documents instead of rows in tables, which maps naturally onto JavaScript objects. Learn collections and documents, basic CRUD operations, and how Mongoose adds schemas, validation, and a friendlier query API on top of the raw driver.\n\nIndexes and query performance are worth a first look here too — 'it works' and 'it works at scale' are different bars.",
      difficulty: "Intermediate",
      estimatedHours: 6,
      size: "medium",
      xpReward: 75,
      prerequisites: ["node-modules-npm"],
      skillIds: ["mongodb"],
      resources: [
        { label: "MongoDB — Documentation", url: "https://www.mongodb.com/docs/manual/", kind: "doc" },
        { label: "Mongoose — Guide", url: "https://mongoosejs.com/docs/guide.html", kind: "doc" },
      ],
    },
    {
      id: "sql-postgres-basics",
      trackId,
      tier: 4,
      name: "SQL & PostgreSQL",
      description: "Relational tables, joins, and querying Postgres from Node.",
      theory:
        "SQL databases model data as related tables instead of standalone documents, and PostgreSQL is the most common open-source choice for a real production backend. Learn table design, primary/foreign keys, and the core SQL verbs (SELECT, JOIN, WHERE, GROUP BY).\n\nThis branch is optional alongside MongoDB — many backends only need one — but knowing when a relational model fits better than a document store is a genuinely useful judgment call.",
      difficulty: "Intermediate",
      estimatedHours: 6,
      size: "medium",
      xpReward: 75,
      prerequisites: ["node-modules-npm"],
      skillIds: ["sql", "postgresql"],
      resources: [
        { label: "PostgreSQL — Documentation", url: "https://www.postgresql.org/docs/", kind: "doc" },
        { label: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", kind: "doc" },
      ],
    },

    // ---------------------------------------------------------------- Tier 5
    {
      id: "streams-buffers",
      trackId,
      tier: 5,
      name: "Streams & Buffers",
      description: "Handling data in chunks instead of loading it all into memory.",
      theory:
        "Streams let Node process data — file uploads, large responses, video — piece by piece instead of holding the whole thing in memory at once. Learn readable, writable, and duplex streams, backpressure, and piping streams together.\n\nBuffers are the raw binary data streams move around; understanding them explains a lot of otherwise-confusing behavior around encodings and file uploads.",
      difficulty: "Intermediate",
      estimatedHours: 5,
      size: "medium",
      xpReward: 75,
      prerequisites: ["event-loop"],
      skillIds: ["node"],
      resources: [
        { label: "Node.js — Stream", url: "https://nodejs.org/api/stream.html", kind: "doc" },
        { label: "Node.js — Buffer", url: "https://nodejs.org/api/buffer.html", kind: "doc" },
      ],
    },
    {
      id: "routing",
      trackId,
      tier: 5,
      name: "Routing",
      description: "Organizing endpoints by resource, method, and route parameters.",
      theory:
        "Routing is how a request's URL and method get matched to the code that should handle it. Learn route parameters (`/users/:id`), query strings, the Router class for splitting routes across files, and REST-ish conventions for naming endpoints by resource.\n\nA well-organized route layer is the difference between an API that scales to fifty endpoints cleanly and one that becomes an unreadable single file.",
      difficulty: "Intermediate",
      estimatedHours: 3,
      size: "small",
      xpReward: 40,
      prerequisites: ["express-fundamentals"],
      skillIds: ["express"],
      resources: [
        { label: "Express — Routing Guide", url: "https://expressjs.com/en/guide/routing.html", kind: "doc" },
      ],
    },

    // ---------------------------------------------------------------- Tier 6
    {
      id: "middleware",
      trackId,
      tier: 6,
      name: "Middleware",
      description: "Functions that run before your route handlers: logging, parsing, auth checks.",
      theory:
        "Middleware functions sit in the request/response pipeline and can inspect, modify, or short-circuit a request before it reaches your route handler. Learn built-in middleware (json parsing, static files), third-party middleware (cors, morgan), and how to write your own.\n\nOrder matters — middleware runs top to bottom, which is exactly why authentication checks and error handlers go where they do.",
      difficulty: "Intermediate",
      estimatedHours: 3,
      size: "small",
      xpReward: 40,
      prerequisites: ["routing"],
      skillIds: ["express"],
      resources: [
        { label: "Express — Using Middleware", url: "https://expressjs.com/en/guide/using-middleware.html", kind: "doc" },
      ],
    },
    {
      id: "rest-api-design",
      trackId,
      tier: 6,
      name: "REST API Design",
      description: "Resource modeling, status codes, versioning, and consistent responses.",
      theory:
        "Good REST design is mostly about consistency: predictable resource URLs, the right HTTP status code for the situation, and response shapes that don't change format from one endpoint to the next. Learn resource naming, pagination, filtering, and how to design error responses that are actually useful to whoever's consuming your API.\n\nThis topic is where the roadmap starts treating your endpoints as a product, not just 'code that responds to requests'.",
      difficulty: "Advanced",
      estimatedHours: 8,
      size: "large",
      xpReward: 150,
      prerequisites: ["routing", "mongodb-basics"],
      skillIds: ["express", "mongodb"],
      resources: [
        { label: "MDN — HTTP response status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", kind: "doc" },
      ],
      relatedProjectHint: "Build a CRUD REST API for a resource of your choice (e.g. a blog or task list) with MongoDB.",
    },

    // ---------------------------------------------------------------- Tier 7
    {
      id: "error-handling",
      trackId,
      tier: 7,
      name: "Error Handling",
      description: "Centralized error middleware, async error catching, and useful error responses.",
      theory:
        "Unhandled errors in an async route can crash a server or silently hang a request — Express needs explicit patterns to catch them. Learn Express's error-handling middleware signature, wrapping async route handlers, and returning structured error responses instead of raw stack traces.\n\nA backend that fails loudly and predictably is far easier to operate than one that fails silently.",
      difficulty: "Intermediate",
      estimatedHours: 2,
      size: "small",
      xpReward: 40,
      prerequisites: ["middleware"],
      skillIds: ["express", "node"],
      resources: [
        { label: "Express — Error Handling", url: "https://expressjs.com/en/guide/error-handling.html", kind: "doc" },
      ],
    },
    {
      id: "authentication-jwt",
      trackId,
      tier: 7,
      name: "Authentication & JWT",
      description: "Password hashing, login flows, and stateless auth with JSON Web Tokens.",
      theory:
        "Authentication proves who's making a request; JWTs are a common way to do that without keeping session state on the server. Learn password hashing (bcrypt), issuing and verifying signed tokens, and protecting routes with an auth middleware.\n\nAlso worth understanding early: access vs refresh tokens, and why storing a JWT in the wrong place (like localStorage, for a browser client) can undermine the security it's supposed to provide.",
      difficulty: "Advanced",
      estimatedHours: 6,
      size: "medium",
      xpReward: 75,
      prerequisites: ["middleware"],
      skillIds: ["jwt", "express"],
      resources: [
        { label: "jwt.io — Introduction to JSON Web Tokens", url: "https://jwt.io/introduction", kind: "doc" },
        { label: "OWASP — Authentication Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html", kind: "doc" },
      ],
      relatedProjectHint: "Add signup/login with hashed passwords and JWT-protected routes to your REST API project.",
    },
    {
      id: "docker-basics",
      trackId,
      tier: 7,
      name: "Docker Basics",
      description: "Containerizing your API so it runs the same everywhere.",
      theory:
        "Docker packages your app and everything it needs to run into a single container image, so 'it works on my machine' stops being a problem. Learn Dockerfiles, images vs containers, and docker-compose for running your API alongside a database locally.\n\nThis is also usually a team's first step toward real deployment — most hosting platforms expect a container these days.",
      difficulty: "Advanced",
      estimatedHours: 5,
      size: "medium",
      xpReward: 75,
      prerequisites: ["rest-api-design"],
      skillIds: ["docker"],
      resources: [
        { label: "Docker — Get Started", url: "https://docs.docker.com/get-started/", kind: "doc" },
        { label: "Docker — Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile/", kind: "doc" },
      ],
    },
    {
      id: "redis-caching",
      trackId,
      tier: 7,
      name: "Redis Caching",
      description: "In-memory caching, sessions, and rate limiting.",
      theory:
        "Redis is an in-memory data store, which makes it extremely fast for things you read constantly and can afford to lose (caches) or that need shared state across server instances (sessions, rate limits). Learn the core data structures (strings, hashes, lists), setting expirations, and a simple cache-aside pattern in front of a slower database query.\n\nAdded once your API is otherwise correct, caching is a performance layer — reach for it after you've measured a real bottleneck, not before.",
      difficulty: "Advanced",
      estimatedHours: 4,
      size: "small",
      xpReward: 40,
      prerequisites: ["rest-api-design"],
      skillIds: ["redis"],
      resources: [
        { label: "Redis — Documentation", url: "https://redis.io/docs/latest/", kind: "doc" },
      ],
    },

    // ---------------------------------------------------------------- Tier 8
    {
      id: "capstone-backend-api",
      trackId,
      tier: 8,
      name: "Capstone: Full Backend API",
      description: "Bring it together: a documented, authenticated, containerized REST API.",
      theory:
        "This is the boss fight for the track: a REST API with real resources, MongoDB persistence, JWT-protected routes, sensible error handling, and a Dockerfile so it runs anywhere. It doesn't need to be original or complex — a task manager, a blog, or a bookmarking API are all fine — it needs to be complete and well-structured.\n\nWhen it's ready, submit it from the Projects page. The AI reviewer will rate architecture, security, performance, and documentation, and score every skill you tagged individually.",
      difficulty: "Expert",
      estimatedHours: 12,
      size: "large",
      xpReward: 150,
      prerequisites: ["authentication-jwt", "docker-basics"],
      skillIds: ["node", "express", "mongodb", "jwt", "docker"],
      resources: [
        { label: "roadmap.sh — Backend Roadmap", url: "https://roadmap.sh/backend", kind: "doc" },
      ],
      relatedProjectHint: "Submit your full backend API project on the Projects page for an AI review.",
    },
  ],
};

export const ROADMAP_TRACKS: RoadmapTrack[] = [backendTrack];
