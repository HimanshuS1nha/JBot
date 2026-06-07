export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

// Current date context: May 25, 2026
export const conversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Optimizing React Performance",
    lastMessage: "Think of it as useMemo for values, useCallback for functions.",
    timestamp: new Date(2026, 4, 25, 9, 30),
    messages: [
      {
        id: "m1-1",
        role: "user",
        content: "My React app is getting slow as it grows. What are the best ways to optimize it?",
        timestamp: new Date(2026, 4, 25, 9, 30),
      },
      {
        id: "m1-2",
        role: "assistant",
        content:
          "Here are the most impactful React performance optimizations:\n\n1. **React.memo** — Prevents re-renders when props haven't changed.\n2. **useMemo & useCallback** — Memoize expensive values and stable function references.\n3. **Code splitting** — Use `React.lazy()` and `Suspense` for route-based splitting.\n4. **Virtualization** — For long lists, use `react-window` or `react-virtual`.\n\nWhich would you like to explore first?",
        timestamp: new Date(2026, 4, 25, 9, 31),
      },
      {
        id: "m1-3",
        role: "user",
        content: "Let's start with React.memo and useMemo — when exactly should I use each?",
        timestamp: new Date(2026, 4, 25, 9, 33),
      },
      {
        id: "m1-4",
        role: "assistant",
        content:
          "**React.memo** wraps a component and skips re-rendering if props are shallowly equal. Use it when a component renders frequently but its props rarely change.\n\n**useMemo** memoizes the result of a computation:\n```tsx\nconst sorted = useMemo(() => heavySort(data), [data]);\n```\nUse it for expensive calculations that depend on values that don't change often.\n\nA common mistake is overusing both — they add overhead themselves, so only apply them after measuring a real problem.",
        timestamp: new Date(2026, 4, 25, 9, 35),
      },
      {
        id: "m1-5",
        role: "user",
        content: "Got it. What about useCallback?",
        timestamp: new Date(2026, 4, 25, 9, 36),
      },
      {
        id: "m1-6",
        role: "assistant",
        content:
          "**useCallback** memoizes a function reference so it stays stable across renders:\n```tsx\nconst handleClick = useCallback(() => doSomething(id), [id]);\n```\nIt's most useful when passing callbacks to child components wrapped in `React.memo`. Without it, a new function is created each render, making the memo pointless.\n\nThink of it as: `useMemo` for values, `useCallback` for functions.",
        timestamp: new Date(2026, 4, 25, 9, 38),
      },
    ],
  },
  {
    id: "conv-2",
    title: "TypeScript Utility Types",
    lastMessage: "Partial, Required, Pick, Omit, and Record are the ones you'll use most.",
    timestamp: new Date(2026, 4, 25, 14, 15),
    messages: [
      {
        id: "m2-1",
        role: "user",
        content: "Can you give me an overview of the most useful TypeScript utility types?",
        timestamp: new Date(2026, 4, 25, 14, 15),
      },
      {
        id: "m2-2",
        role: "assistant",
        content:
          "Here are the utility types you'll reach for most often:\n\n- **Partial<T>** — Makes all properties optional\n- **Required<T>** — Makes all properties required\n- **Pick<T, K>** — Keep only the specified keys\n- **Omit<T, K>** — Remove specified keys\n- **Record<K, V>** — Dictionary type\n- **Readonly<T>** — All properties become read-only\n- **ReturnType<T>** — Infer the return type of a function\n\nWhich one would you like to see in action?",
        timestamp: new Date(2026, 4, 25, 14, 16),
      },
      {
        id: "m2-3",
        role: "user",
        content: "Show me a practical example with Partial and Omit together.",
        timestamp: new Date(2026, 4, 25, 14, 18),
      },
      {
        id: "m2-4",
        role: "assistant",
        content:
          "Here's a real-world pattern for update functions:\n```typescript\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n  createdAt: Date;\n}\n\n// For updates: all fields optional except id is excluded\ntype UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;\n\nfunction updateUser(id: string, data: UserUpdate) {\n  // data can have name, email, or both — all optional\n}\n```\nThis is cleaner than maintaining a separate `UpdateUser` interface manually.",
        timestamp: new Date(2026, 4, 25, 14, 20),
      },
    ],
  },
  {
    id: "conv-3",
    title: "CSS Grid vs Flexbox",
    lastMessage: "Use Grid for 2D layouts, Flexbox for 1D alignment — or mix both.",
    timestamp: new Date(2026, 4, 25, 18, 45),
    messages: [
      {
        id: "m3-1",
        role: "user",
        content: "I always get confused about when to use CSS Grid vs Flexbox. Can you clarify?",
        timestamp: new Date(2026, 4, 25, 18, 45),
      },
      {
        id: "m3-2",
        role: "assistant",
        content:
          "The key mental model:\n\n**Flexbox** is one-dimensional — it lays items along a single axis (row or column). Perfect for navbars, button groups, centering a single element.\n\n**Grid** is two-dimensional — it controls both rows and columns simultaneously. Perfect for page layouts, card grids, complex UI regions.\n\nA practical rule: if your items flow in one direction and you don't care about alignment across rows, reach for Flexbox. If you need items to align in two dimensions, use Grid.",
        timestamp: new Date(2026, 4, 25, 18, 47),
      },
      {
        id: "m3-3",
        role: "user",
        content: "Can I mix them?",
        timestamp: new Date(2026, 4, 25, 18, 48),
      },
      {
        id: "m3-4",
        role: "assistant",
        content:
          "Absolutely — in fact, mixing them is the norm in modern layouts.\n\nA common pattern: use **Grid** for the overall page structure, and **Flexbox** inside each grid cell for component-level alignment:\n```css\n.page { display: grid; grid-template-columns: 250px 1fr; }\n.navbar { display: flex; align-items: center; gap: 1rem; }\n.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }\n```\nUse Grid for 2D layouts, Flexbox for 1D alignment — or mix both.",
        timestamp: new Date(2026, 4, 25, 18, 50),
      },
    ],
  },
  {
    id: "conv-4",
    title: "Building a REST API with Node.js",
    lastMessage: "Always validate request bodies and use middleware for error handling.",
    timestamp: new Date(2026, 4, 24, 11, 0),
    messages: [
      {
        id: "m4-1",
        role: "user",
        content: "What's the best way to structure a Node.js REST API for a medium-sized project?",
        timestamp: new Date(2026, 4, 24, 11, 0),
      },
      {
        id: "m4-2",
        role: "assistant",
        content:
          "A clean structure that scales well:\n```\nsrc/\n  routes/       # Express routers\n  controllers/  # Request handlers\n  services/     # Business logic\n  models/       # Data access\n  middleware/   # Auth, error handling, validation\n  utils/        # Helpers\n  config/       # Environment & app config\n```\nThe key is separating concerns: routes just wire up controllers, controllers handle HTTP, services hold all the business logic. This makes testing much easier.",
        timestamp: new Date(2026, 4, 24, 11, 2),
      },
      {
        id: "m4-3",
        role: "user",
        content: "How should I handle errors consistently across all routes?",
        timestamp: new Date(2026, 4, 24, 11, 5),
      },
      {
        id: "m4-4",
        role: "assistant",
        content:
          "Use a centralized error-handling middleware at the end of your Express app:\n```ts\napp.use((err: Error, req, res, next) => {\n  const status = err instanceof AppError ? err.statusCode : 500;\n  res.status(status).json({ error: err.message });\n});\n```\nCreate a custom `AppError` class that carries a status code, then `throw` it from your service layer. This keeps error handling out of individual controllers.\n\nAlways validate request bodies and use middleware for error handling.",
        timestamp: new Date(2026, 4, 24, 11, 8),
      },
    ],
  },
  {
    id: "conv-5",
    title: "Python for Data Analysis",
    lastMessage: "pandas + matplotlib is the classic combo; polars is faster for large datasets.",
    timestamp: new Date(2026, 4, 24, 16, 30),
    messages: [
      {
        id: "m5-1",
        role: "user",
        content: "I want to start doing data analysis with Python. Where do I begin?",
        timestamp: new Date(2026, 4, 24, 16, 30),
      },
      {
        id: "m5-2",
        role: "assistant",
        content:
          "The essential Python data stack:\n\n- **pandas** — Data manipulation and analysis (DataFrames)\n- **NumPy** — Numerical operations and arrays\n- **matplotlib / seaborn** — Visualization\n- **Jupyter** — Interactive notebooks for exploration\n\nStart with pandas — it's the cornerstone. Learn to load CSVs, filter rows, group data, and aggregate.",
        timestamp: new Date(2026, 4, 24, 16, 31),
      },
      {
        id: "m5-3",
        role: "user",
        content: "What about polars? I've heard it's much faster.",
        timestamp: new Date(2026, 4, 24, 16, 33),
      },
      {
        id: "m5-4",
        role: "assistant",
        content:
          "Polars is significantly faster than pandas, especially for large datasets (millions of rows). It uses Rust under the hood and evaluates lazily by default.\n\nThe API is similar but not identical:\n```python\nimport polars as pl\ndf = pl.read_csv('data.csv')\nresult = df.filter(pl.col('age') > 30).group_by('city').agg(pl.col('salary').mean())\n```\n\nMy recommendation: **learn pandas first** since most tutorials, job postings, and Stack Overflow answers use it. Switch to polars when you hit performance limits.\n\npandas + matplotlib is the classic combo; polars is faster for large datasets.",
        timestamp: new Date(2026, 4, 24, 16, 36),
      },
    ],
  },
  {
    id: "conv-6",
    title: "Docker & Kubernetes Basics",
    lastMessage: "Kubernetes is for orchestrating many containers across many machines.",
    timestamp: new Date(2026, 4, 22, 10, 0),
    messages: [
      {
        id: "m6-1",
        role: "user",
        content: "Can you explain Docker and Kubernetes and when I need each?",
        timestamp: new Date(2026, 4, 22, 10, 0),
      },
      {
        id: "m6-2",
        role: "assistant",
        content:
          "**Docker** packages your application and its dependencies into a container — a portable, isolated unit that runs the same everywhere.\n\n**Kubernetes (K8s)** orchestrates many containers across many machines. It handles deployment, scaling, self-healing, load balancing, and rolling updates.\n\nAnalogy: Docker is a shipping container; Kubernetes is the cargo ship and port logistics managing thousands of them.",
        timestamp: new Date(2026, 4, 22, 10, 2),
      },
      {
        id: "m6-3",
        role: "user",
        content: "Do I need Kubernetes for a small side project?",
        timestamp: new Date(2026, 4, 22, 10, 4),
      },
      {
        id: "m6-4",
        role: "assistant",
        content:
          "Almost certainly not. Kubernetes has significant operational overhead and complexity.\n\nFor a small project, Docker Compose is the right tool — it lets you define and run multi-container apps locally and on a single server:\n```yaml\nservices:\n  api:\n    build: .\n    ports: ['3000:3000']\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: secret\n```\n\nReach for Kubernetes when you need to run at scale across multiple servers or need advanced deployment strategies.\n\nKubernetes is for orchestrating many containers across many machines.",
        timestamp: new Date(2026, 4, 22, 10, 8),
      },
    ],
  },
  {
    id: "conv-7",
    title: "Git Workflows for Teams",
    lastMessage: "Trunk-based development with short-lived feature branches is the modern standard.",
    timestamp: new Date(2026, 4, 21, 15, 0),
    messages: [
      {
        id: "m7-1",
        role: "user",
        content: "What Git workflow should my team adopt? We're 5 developers.",
        timestamp: new Date(2026, 4, 21, 15, 0),
      },
      {
        id: "m7-2",
        role: "assistant",
        content:
          "For a 5-person team, I'd recommend **trunk-based development** with short-lived feature branches:\n\n1. Everyone branches off `main`\n2. Feature branches live for 1-2 days max\n3. Open a PR, get it reviewed, merge to `main`\n4. `main` is always deployable\n\nAvoid long-lived branches — they cause painful merge conflicts and slow everything down.",
        timestamp: new Date(2026, 4, 21, 15, 2),
      },
      {
        id: "m7-3",
        role: "user",
        content: "What about Git Flow? Our last team used it.",
        timestamp: new Date(2026, 4, 21, 15, 4),
      },
      {
        id: "m7-4",
        role: "assistant",
        content:
          "Git Flow made sense in the era of scheduled releases (e.g., monthly software releases). It uses long-lived `develop`, `release`, and `hotfix` branches.\n\nIf you're doing continuous deployment (pushing to production frequently), Git Flow adds overhead without benefit — you're managing complexity for a release model you don't use.\n\nTrunk-based development with short-lived feature branches is the modern standard for teams shipping continuously.",
        timestamp: new Date(2026, 4, 21, 15, 7),
      },
    ],
  },
  {
    id: "conv-8",
    title: "Database Indexing Strategies",
    lastMessage: "Composite indexes follow the leftmost prefix rule — column order matters.",
    timestamp: new Date(2026, 4, 19, 9, 30),
    messages: [
      {
        id: "m8-1",
        role: "user",
        content: "My queries are slow. How do I figure out which indexes to add?",
        timestamp: new Date(2026, 4, 19, 9, 30),
      },
      {
        id: "m8-2",
        role: "assistant",
        content:
          "Start with `EXPLAIN ANALYZE` on your slow query — it shows the query plan and where time is spent. Look for `Seq Scan` on large tables; that's a missing index.\n\nGeneral indexing rules:\n- Index columns used in `WHERE` clauses\n- Index foreign keys (JOIN columns)\n- For composite indexes, put the most selective column first\n- Don't over-index — indexes slow down writes",
        timestamp: new Date(2026, 4, 19, 9, 32),
      },
      {
        id: "m8-3",
        role: "user",
        content: "Can you explain composite indexes more? When the order matters?",
        timestamp: new Date(2026, 4, 19, 9, 35),
      },
      {
        id: "m8-4",
        role: "assistant",
        content:
          "Composite indexes follow the **leftmost prefix rule**: a composite index on `(a, b, c)` can be used for queries filtering on `a`, `a + b`, or `a + b + c`, but NOT for `b` alone or `c` alone.\n\n```sql\nCREATE INDEX idx_user_date ON orders (user_id, created_at);\n-- This helps:\nSELECT * FROM orders WHERE user_id = 5 AND created_at > '2026-01-01';\n-- This also helps (leftmost prefix):\nSELECT * FROM orders WHERE user_id = 5;\n-- This does NOT use the index:\nSELECT * FROM orders WHERE created_at > '2026-01-01';\n```\n\nComposite indexes follow the leftmost prefix rule — column order matters.",
        timestamp: new Date(2026, 4, 19, 9, 39),
      },
    ],
  },
  {
    id: "conv-9",
    title: "JWT Authentication",
    lastMessage: "Store the refresh token in an httpOnly cookie, access token in memory.",
    timestamp: new Date(2026, 4, 12, 14, 0),
    messages: [
      {
        id: "m9-1",
        role: "user",
        content: "How should I implement JWT authentication? Where do I store tokens?",
        timestamp: new Date(2026, 4, 12, 14, 0),
      },
      {
        id: "m9-2",
        role: "assistant",
        content:
          "The secure pattern uses two tokens:\n\n- **Access token** — short-lived (15 min), stored in memory (a variable). Used for API calls.\n- **Refresh token** — long-lived (7-30 days), stored in an `httpOnly` cookie. Used only to get new access tokens.\n\nNever store JWTs in `localStorage` — it's accessible to JavaScript and vulnerable to XSS attacks.",
        timestamp: new Date(2026, 4, 12, 14, 2),
      },
      {
        id: "m9-3",
        role: "user",
        content: "Why is httpOnly cookie safer than localStorage?",
        timestamp: new Date(2026, 4, 12, 14, 4),
      },
      {
        id: "m9-4",
        role: "assistant",
        content:
          "An `httpOnly` cookie cannot be read by JavaScript at all — only the browser sends it automatically with requests. This makes XSS attacks powerless against it, since malicious scripts can't access the token.\n\n`localStorage` is readable by any JS on the page. If an attacker injects a script (XSS), they can steal the token with `localStorage.getItem('token')`.\n\nThe trade-off: cookies require CSRF protection (use `SameSite=Strict` or a CSRF token). But that's a solvable problem; XSS token theft is worse.\n\nStore the refresh token in an httpOnly cookie, access token in memory.",
        timestamp: new Date(2026, 4, 12, 14, 7),
      },
    ],
  },
  {
    id: "conv-10",
    title: "Machine Learning Fundamentals",
    lastMessage: "Gradient descent iteratively adjusts weights to minimize the loss function.",
    timestamp: new Date(2026, 4, 8, 10, 30),
    messages: [
      {
        id: "m10-1",
        role: "user",
        content: "I want to understand machine learning from scratch. Where should I start?",
        timestamp: new Date(2026, 4, 8, 10, 30),
      },
      {
        id: "m10-2",
        role: "assistant",
        content:
          "Start with the core concepts before touching any frameworks:\n\n1. **Supervised vs. Unsupervised learning** — learning from labeled data vs. finding patterns\n2. **Loss functions** — how we measure how wrong a model is\n3. **Gradient descent** — how models learn by minimizing loss\n4. **Overfitting & regularization** — why models fail on new data and how to prevent it\n\nOnce these click, everything else in ML makes sense. Want to start with gradient descent?",
        timestamp: new Date(2026, 4, 8, 10, 32),
      },
      {
        id: "m10-3",
        role: "user",
        content: "Yes, explain gradient descent intuitively.",
        timestamp: new Date(2026, 4, 8, 10, 34),
      },
      {
        id: "m10-4",
        role: "assistant",
        content:
          "Imagine you're blindfolded on a hilly landscape and want to find the lowest valley. You feel the ground slope under your feet and take a small step downhill. You repeat this until each step doesn't go lower — you've found a minimum.\n\nIn ML:\n- The landscape = the loss function (a measure of model error)\n- Your position = the model's weights\n- The slope = the gradient (derivative of the loss)\n- Each step = updating weights by `weight -= learning_rate × gradient`\n\nThe learning rate controls step size — too large and you overshoot, too small and it's slow.\n\nGradient descent iteratively adjusts weights to minimize the loss function.",
        timestamp: new Date(2026, 4, 8, 10, 37),
      },
    ],
  },
];
