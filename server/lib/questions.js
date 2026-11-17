// server/lib/questions.js
// Question bank for the fallback engine. Each question carries its own scoring concepts.
// k(label, regex, hint, weight)
const k = (label, re, hint, w = 1) => ({ label, re, hint, w });

export const QUESTIONS = [
  /* ---------------------------- DSA ---------------------------- */
  {
    question: "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Explain your approach and its complexity.",
    category: "DSA / Arrays & Hashing", difficulty: "Easy", tags: ["dsa"],
    whyItMatters: "A classic warm-up that tests whether you can move from brute force to an optimal solution.",
    whatGoodLooksLike: ["Starts with the brute-force idea and its cost", "Uses a hash map to find the complement in one pass", "States time and space complexity and edge cases"],
    followUp: "How would your solution change if the array were sorted?",
    concepts: [
      k("brute-force baseline", /brute|nested loop|two loops|O\(n\^?2\)|O\(n²\)|every pair/i, "Mention the brute-force O(n²) approach and why it is slow."),
      k("hash map", /hash ?map|hash ?table|dictionary|\bmap\b|\bset\b|lookup/i, "Use a hash map to store seen numbers for O(1) lookup.", 1.5),
      k("complement idea", /complement|target\s*[-−]|difference|remaining|need(ed)? value/i, "Explain the complement idea: for each number look for target minus number."),
      k("single pass", /one pass|single pass|single loop|one loop|while iterating|as we iterate/i, "Say that one pass is enough because you check before inserting."),
      k("time and space complexity", /O\(n\)|O\(1\)|linear|time complexity|space complexity/i, "State time O(n) and space O(n).", 1.5),
      k("edge cases", /duplicate|negative|no solution|empty|same element|twice|multiple/i, "Discuss edge cases: duplicates, negatives, no solution, using the same element twice.")
    ],
    outline: ["Restate the problem and clarify inputs (duplicates, exactly one solution?).", "Describe brute force and its O(n²) cost.", "Optimise with a hash map: check target − x before storing x.", "State O(n) time and O(n) space and walk through an example.", "Cover edge cases and test cases."]
  },
  {
    question: "How would you detect a cycle in a singly linked list, and how would you find where the cycle begins?",
    category: "DSA / Linked Lists", difficulty: "Easy", tags: ["dsa"],
    whyItMatters: "Tests pointer reasoning and the ability to trade memory for time.",
    whatGoodLooksLike: ["Mentions the two-pointer (slow/fast) technique", "Compares it with a hash-set approach", "Explains how to find the start of the cycle"],
    followUp: "Why are the slow and fast pointers guaranteed to meet inside a cycle?",
    concepts: [
      k("two pointers", /slow|fast|tortoise|hare|floyd|two pointers?/i, "Use two pointers moving at different speeds (Floyd's algorithm).", 2),
      k("hash set alternative", /hash ?set|visited|set of nodes|store (the )?nodes|extra memory/i, "Mention the visited-set approach and its O(n) extra memory."),
      k("meeting point", /meet|collide|same node|equal pointers|pointers? (are )?equal/i, "Explain that the pointers meet if and only if there is a cycle."),
      k("cycle start", /start of (the )?cycle|beginning of (the )?cycle|reset|head again|cycle begins|entry point/i, "Explain how to find the start: reset one pointer to head and move both one step at a time."),
      k("complexity", /O\(n\)|O\(1\)|constant space|linear time|time complexity|space complexity/i, "State O(n) time and O(1) space for the two-pointer solution.", 1.5),
      k("edge cases", /empty|null|single node|one node|tail|self[- ]loop/i, "Handle empty lists, a single node and a self-loop.")
    ],
    outline: ["Clarify: singly linked, can the list be empty?", "Option 1: visited set, O(n) time and O(n) space.", "Option 2: slow and fast pointers, O(1) space; they meet if a cycle exists.", "Find the start: reset one pointer to head, move both one step until they meet.", "Complexity and edge cases (empty, one node, self-loop)."]
  },
  {
    question: "Search for a target in a rotated sorted array in O(log n) time. Explain your reasoning.",
    category: "DSA / Binary Search", difficulty: "Medium", tags: ["dsa"],
    whyItMatters: "Tests whether you can adapt a known algorithm to a twisted problem.",
    whatGoodLooksLike: ["Recognises one half is always sorted", "Decides which half to discard using the target", "Handles boundaries and duplicates"],
    followUp: "What changes if the array contains duplicates?",
    concepts: [
      k("binary search idea", /binary search|divide|halv|mid|middle|low|high|left|right/i, "Use a binary-search style loop with low, high and mid."),
      k("one half sorted", /one (half|side)|sorted (half|part|side)|left half|right half|either (half|side)/i, "Observe that at least one half around mid is always sorted.", 2),
      k("range check", /target (lies|is|falls|in)|within (the )?range|between|compare (with )?(the )?(first|last|ends?)|nums\[(low|left|lo)\]/i, "Check whether the target lies inside the sorted half to decide which side to keep."),
      k("logarithmic complexity", /O\(log ?n\)|logarithmic|log n/i, "State O(log n) time and O(1) space.", 1.5),
      k("termination and indices", /while|terminate|low\s*<=|left\s*<=|mid\s*[+-]\s*1|off[- ]by[- ]one|not found|[-]1/i, "Explain loop termination, index updates (mid±1) and the not-found case."),
      k("duplicates / edge cases", /duplicate|empty|single|one element|not rotated|worst case/i, "Discuss duplicates, an unrotated array and an empty array.")
    ],
    outline: ["Clarify: distinct values? Return index or -1?", "Idea: at every step one half is sorted.", "Compare target with the sorted half's range to choose the side.", "Update low/high with mid±1 and stop when low > high.", "O(log n) time, O(1) space; edge cases and duplicates."]
  },
  {
    question: "Find the shortest path from a start cell to a target cell in a grid with obstacles. Which algorithm would you use and why?",
    category: "DSA / Graphs", difficulty: "Medium", tags: ["dsa"],
    whyItMatters: "Tests graph modelling and knowing why BFS gives shortest paths in unweighted graphs.",
    whatGoodLooksLike: ["Models the grid as a graph", "Uses BFS with a queue and a visited set", "States complexity and handles blocked or unreachable targets"],
    followUp: "What would you use if each move had a different cost?",
    concepts: [
      k("graph modelling", /graph|node|vertex|vertices|edge|neighbo[u]?r|adjacent|4[- ]direction|8[- ]direction|up, ?down|directions?/i, "Model each cell as a node with up to four neighbours."),
      k("BFS", /\bbfs\b|breadth[- ]first|level by level|layer by layer/i, "Use BFS, which explores level by level.", 2),
      k("queue", /queue|deque|enqueue|dequeue|fifo/i, "Use a queue to process cells in order of distance."),
      k("visited tracking", /visited|seen|mark(ed)?|avoid (revisit|cycles)|revisit/i, "Track visited cells so each cell is processed once."),
      k("why BFS not DFS", /unweighted|shortest|fewest|minimum (number of )?(steps|moves)|dfs (does not|doesn't|may not)/i, "Explain why BFS guarantees the shortest path in an unweighted grid and DFS does not."),
      k("complexity", /O\(\s*(v ?\+ ?e|rows|r ?[*x×] ?c|n ?[*x×] ?m|n)/i, "State O(rows × cols) time and space.", 1.5),
      k("edge cases", /blocked|obstacle|no path|unreachable|start (equals|is) (the )?target|out of bounds|boundary|bounds/i, "Handle blocked start or target, no path, and bounds checks.")
    ],
    outline: ["Clarify the grid, moves allowed and what to return if no path exists.", "Model cells as nodes; neighbours are valid in-bounds non-blocked cells.", "BFS with a queue storing (cell, distance) and a visited set.", "Return the distance when the target is dequeued; -1 if the queue empties.", "O(R×C) time and space; mention Dijkstra or A* for weighted moves."]
  },
  {
    question: "Given coin denominations and an amount, find the minimum number of coins needed to make that amount. Walk through your approach.",
    category: "DSA / Dynamic Programming", difficulty: "Medium", tags: ["dsa"],
    whyItMatters: "Tests whether you can define a recurrence and avoid repeated work.",
    whatGoodLooksLike: ["Explains why greedy can fail", "Defines the DP state and recurrence", "Handles the impossible case and states complexity"],
    followUp: "How would you reconstruct which coins were used?",
    concepts: [
      k("why greedy fails", /greedy/i, "Explain that greedy choices can fail for some coin sets (e.g. 1, 3, 4 for amount 6)."),
      k("DP state", /dp\[|dp array|state|subproblem|sub-problem|minimum coins for|min coins for|amount i/i, "Define the state: dp[i] is the minimum coins for amount i.", 2),
      k("recurrence", /min\(|recurrence|dp\[i\]|dp\[.*coin|1 ?\+ ?dp|transition/i, "Write the recurrence: dp[i] = min(dp[i − coin] + 1) over all coins.", 2),
      k("base case", /base case|dp\[0\]\s*=\s*0|zero coins|amount 0|0 for 0/i, "State the base case: dp[0] = 0."),
      k("memoisation or tabulation", /memo|tabulat|bottom[- ]up|top[- ]down|cache (the )?results|overlapping/i, "Say whether you use memoisation (top-down) or tabulation (bottom-up) and why."),
      k("impossible case", /impossible|not possible|-1|infinity|inf\b|unreachable|cannot (make|form)/i, "Handle amounts that cannot be formed (return -1, initialise with infinity)."),
      k("complexity", /O\(\s*(amount|n|a)\s*[*x×]\s*(coins|n|c|k)|O\(amount|time complexity|space complexity/i, "State O(amount × coins) time and O(amount) space.", 1.5)
    ],
    outline: ["Clarify: unlimited coins? What to return if impossible?", "Show why greedy fails with a counter-example.", "Define dp[i] and the recurrence dp[i] = min(dp[i − c] + 1).", "Base case dp[0] = 0; initialise others to infinity; fill bottom-up.", "Return -1 if dp[amount] is infinity; O(amount × coins) time, O(amount) space."]
  },
  {
    question: "Design and implement an LRU (Least Recently Used) cache where get and put both run in O(1) time.",
    category: "DSA / Data Structure Design", difficulty: "Hard", tags: ["dsa", "backend"],
    whyItMatters: "Combines data-structure design with a real caching requirement.",
    whatGoodLooksLike: ["Combines a hash map with a doubly linked list", "Moves accessed items to the front and evicts from the tail", "Handles capacity, updates and concurrency"],
    followUp: "How would you make this cache safe for multiple threads?",
    concepts: [
      k("hash map for lookup", /hash ?map|hash ?table|dictionary|\bmap\b/i, "Use a hash map from key to node for O(1) lookup.", 1.5),
      k("doubly linked list", /doubly|linked list|prev|next pointers?|dll/i, "Use a doubly linked list to track usage order and remove nodes in O(1).", 2),
      k("move to front on access", /most recently|move (it )?to (the )?(front|head)|front of the list|head of the list|mru/i, "On every get or put, move the node to the front (most recently used)."),
      k("evict from tail", /evict|least recently|tail|remove (the )?last|capacity/i, "When capacity is exceeded, evict the tail (least recently used) node.", 1.5),
      k("O(1) justification", /O\(1\)|constant time/i, "Explain why both operations are O(1).", 1.5),
      k("edge cases", /existing key|update|capacity (of )?(0|zero|1|one)|missing key|not found|-1|dummy|sentinel/i, "Handle updating an existing key, a missing key and tiny capacities (use sentinel nodes)."),
      k("concurrency", /thread|lock|mutex|synchroni[sz]|concurren|atomic/i, "Discuss thread safety with locks or sharding.", 0.5)
    ],
    outline: ["Clarify capacity, key/value types and expected API.", "Hash map: key → node. Doubly linked list ordered by recency.", "get: look up, move node to head, return value.", "put: update and move, or insert at head; if over capacity remove the tail and delete from map.", "O(1) per operation; sentinel nodes, edge cases and thread safety."]
  },

  /* -------------------------- BACKEND -------------------------- */
  {
    question: "Design a REST API for a booking application where users can create, view, update and cancel bookings.",
    category: "Backend / API Design", difficulty: "Easy", tags: ["backend", "fullstack"],
    whyItMatters: "Tests basic API design discipline, which every backend role needs.",
    whatGoodLooksLike: ["Uses resource-based URLs and correct HTTP methods", "Returns meaningful status codes and validates input", "Considers pagination, authentication and idempotency"],
    followUp: "How would you prevent two users from booking the same slot?",
    concepts: [
      k("resource-based URLs", /\/bookings|resource|noun|plural|\/api\//i, "Use resource-oriented URLs such as /bookings and /bookings/{id}.", 1.5),
      k("HTTP methods", /\bget\b.*\bpost\b|\bpost\b.*\bget\b|\bput\b|\bpatch\b|\bdelete\b/i, "Map actions to HTTP methods: POST create, GET read, PUT/PATCH update, DELETE cancel.", 1.5),
      k("status codes", /\b(200|201|204|400|401|403|404|409|422)\b|status code/i, "Return correct status codes (201, 400, 404, 409).", 1.5),
      k("validation", /validat|sanitiz|schema|required fields?|bad request/i, "Validate request bodies and return clear errors."),
      k("authentication and authorisation", /auth|jwt|token|session|permission|owner|role/i, "Require authentication and make sure users only access their own bookings."),
      k("pagination and filtering", /paginat|limit|offset|cursor|page|filter|sort/i, "Add pagination and filtering for list endpoints."),
      k("idempotency / conflicts", /idempot|double[- ]book|conflict|unique|race|transaction|lock|409/i, "Prevent double booking with transactions, unique constraints and idempotency keys.")
    ],
    outline: ["Clarify entities and actions (booking, user, slot).", "Define endpoints and methods: POST /bookings, GET /bookings/{id}, PATCH /bookings/{id}, DELETE or POST /bookings/{id}/cancel.", "Specify request/response bodies, validation and status codes.", "Add authentication, ownership checks, pagination and versioning.", "Handle conflicts: transactions, unique constraints and idempotency keys."]
  },
  {
    question: "A query on a large table has become slow. How would you diagnose it and what would you do to speed it up?",
    category: "Backend / Databases", difficulty: "Medium", tags: ["backend", "cs"],
    whyItMatters: "Tests practical database performance debugging, a very common production task.",
    whatGoodLooksLike: ["Starts with measurement and the query plan", "Chooses the right index and explains its cost", "Considers query rewrite, caching and pagination"],
    followUp: "Why does the order of columns in a composite index matter?",
    concepts: [
      k("measure first", /explain|query plan|execution plan|slow query log|profil|measure|benchmark/i, "Start by measuring: run EXPLAIN or check the slow-query log.", 2),
      k("indexing", /index|b[- ]?tree|composite|covering/i, "Add or adjust an index on the filtered and joined columns.", 2),
      k("index trade-offs", /write (cost|overhead|penalty)|slower writes|storage|trade[- ]?off|too many indexes/i, "Explain that indexes cost storage and slow down writes."),
      k("composite index order", /column order|leftmost|selectivity|order of columns|prefix/i, "Mention composite index column order and selectivity."),
      k("query rewrite", /select \*|n\+1|join|subquery|rewrite|avoid (full )?scan|full table scan|only (the )?needed columns|limit/i, "Rewrite the query: avoid SELECT *, N+1 and full table scans."),
      k("pagination / caching", /paginat|cache|caching|materiali[sz]ed|read replica|denormali[sz]|partition/i, "Consider pagination, caching, read replicas, partitioning or denormalisation."),
      k("verify the improvement", /verify|re-?run|compare|before and after|monitor|regression|load test/i, "Verify the improvement and monitor for regressions.")
    ],
    outline: ["Reproduce and measure: slow-query log and EXPLAIN plan.", "Find the cause: full scan, missing index, bad join, N+1.", "Fix: add the right (composite) index, rewrite the query, limit columns and rows.", "Discuss costs: write overhead and storage.", "Scale further: caching, read replicas, partitioning; verify and monitor."]
  },
  {
    question: "Design a rate limiter for an API that allows 100 requests per minute per user.",
    category: "Backend / Rate Limiting", difficulty: "Medium", tags: ["backend", "system-design"],
    whyItMatters: "Tests algorithm choice, shared state and distributed-system thinking.",
    whatGoodLooksLike: ["Compares fixed window, sliding window and token bucket", "Uses a shared store such as Redis with atomic operations", "Returns 429 with useful headers"],
    followUp: "How would your design behave when the rate-limit store is down?",
    concepts: [
      k("algorithm choice", /token bucket|leaky bucket|sliding window|fixed window|sliding log/i, "Choose and compare algorithms: fixed window, sliding window, token bucket.", 2),
      k("per-user key", /per[- ]user|user id|api key|ip address|\bip\b|key (is|=)|identif/i, "Identify the client with a key (user ID, API key or IP)."),
      k("shared store", /redis|memcached|shared (store|state|counter)|in[- ]memory|centrali[sz]ed/i, "Keep counters in a shared store such as Redis so all servers agree.", 1.5),
      k("atomicity", /atomic|incr|lua|race condition|concurren|transaction|expire|ttl/i, "Use atomic operations (INCR with TTL or Lua) to avoid race conditions."),
      k("response behaviour", /429|too many requests|retry-after|x-ratelimit|headers?/i, "Return HTTP 429 with Retry-After and rate-limit headers.", 1.5),
      k("trade-offs", /burst|accura|memory|boundary|trade[- ]?off|smooth/i, "Discuss trade-offs: burst allowance, boundary spikes, memory and accuracy."),
      k("failure behaviour", /fail[- ]open|fail[- ]closed|store (is )?down|fallback|degrade|local (limit|cache)/i, "Decide what happens if the store fails (fail-open or fail-closed).")
    ],
    outline: ["Clarify: per user or per IP? Hard or soft limit? Single or distributed service?", "Compare fixed window, sliding window and token bucket.", "Implement with Redis: key per user, atomic INCR with TTL or token bucket in Lua.", "Respond with 429, Retry-After and rate-limit headers.", "Discuss bursts, accuracy, memory, and fail-open vs fail-closed."]
  },
  {
    question: "How would you design authentication and authorization for a web application with a React front end and a Node.js API?",
    category: "Backend / Security", difficulty: "Medium", tags: ["backend", "fullstack", "frontend"],
    whyItMatters: "Security mistakes are costly, so interviewers test whether you know the basics well.",
    whatGoodLooksLike: ["Hashes passwords and uses HTTPS", "Chooses between sessions and JWTs with justification", "Separates authentication from authorization (roles/permissions)"],
    followUp: "How would you revoke a stolen JWT?",
    concepts: [
      k("password hashing", /hash|bcrypt|argon|scrypt|salt|never store (plain|passwords)/i, "Hash passwords with bcrypt or argon2 and a salt; never store plain text.", 1.5),
      k("session or JWT choice", /jwt|json web token|session|cookie|access token|refresh token|oauth/i, "Choose sessions or JWTs and justify the choice.", 1.5),
      k("secure token storage", /httponly|http-only|secure flag|samesite|localstorage|local storage|xss|csrf/i, "Store tokens safely (httpOnly cookies) and address XSS and CSRF.", 1.5),
      k("HTTPS", /https|tls|ssl|encrypt/i, "Use HTTPS everywhere."),
      k("authorisation model", /rbac|role|permission|authori[sz]|policy|scope|middleware|guard/i, "Separate authorisation (roles, permissions, middleware checks) from authentication.", 1.5),
      k("token expiry and revocation", /expir|refresh|revoc|blacklist|deny[- ]?list|rotate|short[- ]lived/i, "Use short-lived access tokens, refresh tokens and a revocation strategy."),
      k("extra protections", /rate limit|brute force|lockout|2fa|mfa|two[- ]factor|validation|cors/i, "Add rate limiting, brute-force protection, MFA and strict CORS.")
    ],
    outline: ["Clarify users, roles and whether third-party login is needed.", "Registration and login: hash passwords, HTTPS, validate input.", "Choose sessions or JWT with refresh tokens; store in httpOnly secure cookies.", "Authorisation: roles/permissions enforced in API middleware.", "Hardening: expiry and revocation, rate limiting, CSRF/XSS protection, MFA."]
  },
  {
    question: "Explain a caching strategy for a read-heavy API. What do you cache, how do you keep it correct, and what can go wrong?",
    category: "Backend / Caching", difficulty: "Medium", tags: ["backend", "system-design"],
    whyItMatters: "Caching is the most common way to scale reads, and also a common source of bugs.",
    whatGoodLooksLike: ["Explains cache-aside, TTLs and invalidation", "Chooses what to cache using hit rate and cost", "Covers stampedes, stale data and eviction"],
    followUp: "How would you prevent a cache stampede on a very popular key?",
    concepts: [
      k("cache pattern", /cache[- ]aside|read[- ]through|write[- ]through|write[- ]back|look[- ]aside/i, "Name the caching pattern (cache-aside, read-through, write-through).", 1.5),
      k("what to cache", /hot (data|keys)|frequently|expensive|read[- ]heavy|hit (rate|ratio)|immutable|computed/i, "Cache hot, expensive and rarely changing data; measure hit rate."),
      k("TTL and invalidation", /ttl|expir|invalidat|purge|versioned keys?|time[- ]to[- ]live/i, "Use TTLs and explicit invalidation on writes.", 2),
      k("eviction", /evict|lru|lfu|memory limit|maxmemory/i, "Explain the eviction policy (LRU/LFU) when memory is full."),
      k("stampede", /stampede|thundering herd|dogpil|request coalescing|single[- ]flight|lock|jitter|stale[- ]while/i, "Prevent stampedes with locking, request coalescing or TTL jitter.", 1.5),
      k("consistency", /stale|consisten|race|out of sync|eventual/i, "Discuss stale data and consistency trade-offs.", 1.5),
      k("technology and layers", /redis|memcached|cdn|browser cache|http cache|etag|cache-control/i, "Mention technology and layers: Redis, CDN, HTTP caching.")
    ],
    outline: ["Identify read-heavy, expensive and stable data worth caching.", "Pick a pattern, e.g. cache-aside with Redis.", "Set TTLs and invalidate or update on writes.", "Handle eviction, stampedes (locks, jitter) and cache outages.", "Discuss staleness vs speed and monitor hit rate."]
  },

  /* ------------------------ SYSTEM DESIGN ----------------------- */
  {
    question: "Design a URL shortening service like Bitly. Cover ID generation, storage, redirects and scaling.",
    category: "System Design / URL Shortener", difficulty: "Medium", tags: ["system-design", "backend"],
    whyItMatters: "A standard system-design question that tests estimation, storage choices and read-heavy scaling.",
    whatGoodLooksLike: ["Clarifies scale and read/write ratio", "Explains unique short-ID generation and collisions", "Uses caching and a scalable key-value store for redirects"],
    followUp: "How would you support custom aliases and link expiry?",
    concepts: [
      k("requirements and scale", /requirement|assum|per (day|second)|qps|million|read[- ]heavy|read to write|ratio|estimate/i, "State requirements and rough scale (reads vs writes, storage)."),
      k("ID generation", /base ?62|base ?58|hash|counter|snowflake|unique id|random|sequence|collision|md5|sha/i, "Explain how short IDs are generated (base62 counter, hash) and avoid collisions.", 2),
      k("storage", /key[- ]value|nosql|dynamo|cassandra|sql|postgres|database|table|schema|mapping/i, "Choose storage for the short→long mapping and justify it.", 1.5),
      k("redirect behaviour", /301|302|redirect|http status|permanent|temporary/i, "Explain the redirect (301 vs 302) and its effect on analytics and caching."),
      k("caching and scaling", /cache|redis|cdn|load balancer|replica|shard|partition|scal/i, "Add caching and scaling: Redis, CDN, replicas, sharding.", 2),
      k("extra features", /expir|ttl|custom alias|analytics|click|rate limit|abuse|spam|malicious/i, "Cover expiry, custom aliases, analytics and abuse prevention."),
      k("failure and reliability", /availab|replicat|backup|fail|redundan|consisten/i, "Discuss availability, replication and failure handling.")
    ],
    outline: ["Clarify features and estimate scale (writes, reads, storage).", "API: POST /shorten, GET /{code} redirect.", "Generate unique short codes (base62 of a counter or hash with collision handling).", "Store mapping in a key-value store; cache hot links in Redis/CDN.", "Scale with replicas and sharding; add expiry, analytics, abuse protection."]
  },
  {
    question: "Design a real-time chat application that supports one-to-one and group messaging.",
    category: "System Design / Real-time Messaging", difficulty: "Hard", tags: ["system-design", "backend"],
    whyItMatters: "Tests real-time communication, ordering, delivery guarantees and scaling connections.",
    whatGoodLooksLike: ["Uses WebSockets (or similar) for persistent connections", "Stores messages durably with ordering and delivery acknowledgements", "Scales connections with pub/sub and handles offline users"],
    followUp: "How would you guarantee message ordering in a group chat?",
    concepts: [
      k("persistent connections", /websocket|web socket|long[- ]poll|server[- ]sent|sse|socket\.io|persistent connection/i, "Use WebSockets (or long polling as a fallback) for real-time delivery.", 2),
      k("message storage", /database|store|persist|cassandra|dynamo|mongo|postgres|history|message table|durab/i, "Persist messages in a scalable database and support history.", 1.5),
      k("delivery and acknowledgements", /ack|acknowledg|deliver(y|ed)|read receipt|at[- ]least[- ]once|retry|dedup/i, "Use acknowledgements, retries and de-duplication for delivery guarantees.", 1.5),
      k("ordering", /order|sequence number|timestamp|monoton|lamport|per[- ]conversation/i, "Explain message ordering (sequence numbers per conversation)."),
      k("scaling connections", /pub[- ]?sub|redis|kafka|message broker|load balanc|sticky|gateway|shard|horizontal/i, "Scale with a pub/sub or broker and multiple gateway servers.", 1.5),
      k("offline users and push", /offline|push notification|fcm|apns|queue|store and forward/i, "Handle offline users with stored messages and push notifications."),
      k("groups, presence, media", /group|presence|online status|typing|media|attachment|object storage|s3|encrypt/i, "Cover group fan-out, presence, media handling and encryption.")
    ],
    outline: ["Clarify features: 1:1, groups, history, media, scale.", "Clients connect over WebSockets to chat gateway servers.", "Messages go through a broker/pub-sub to recipients' gateways and are stored durably.", "Acks, retries, de-duplication and ordering with per-conversation sequence numbers.", "Offline delivery with push notifications; scale with sharding; presence and media."]
  },
  {
    question: "Design a notification system that can send email, SMS and push notifications reliably to millions of users.",
    category: "System Design / Notifications", difficulty: "Medium", tags: ["system-design", "backend"],
    whyItMatters: "Tests asynchronous processing, reliability and respect for user preferences.",
    whatGoodLooksLike: ["Decouples producers from senders with queues", "Handles retries, dead-letter queues and idempotency", "Respects preferences, rate limits and templates"],
    followUp: "How would you avoid sending the same notification twice?",
    concepts: [
      k("queue-based decoupling", /queue|kafka|sqs|rabbit|message broker|async|asynchronous|event[- ]driven|worker/i, "Decouple producers and senders with a message queue and workers.", 2),
      k("channels and providers", /email|sms|push|provider|twilio|sendgrid|fcm|apns|channel/i, "Support separate channels with provider adapters."),
      k("retries and dead letters", /retry|retries|backoff|dead[- ]letter|dlq|failure|failed/i, "Retry with backoff and use a dead-letter queue.", 1.5),
      k("idempotency", /idempot|dedup|duplicate|unique (id|key)/i, "Use idempotency keys so users are not notified twice.", 1.5),
      k("user preferences", /preference|opt[- ]out|unsubscribe|do not disturb|quiet hours|consent/i, "Respect user preferences, opt-outs and quiet hours."),
      k("rate limiting and priority", /rate limit|throttl|priority|batch|provider limit|burst/i, "Throttle per provider and prioritise urgent notifications."),
      k("templates and observability", /template|personali[sz]|log|metric|monitor|delivery (status|rate)|track/i, "Use templates and track delivery status with metrics.")
    ],
    outline: ["Clarify channels, volume, latency and priorities.", "API/event in → validate → preferences check → enqueue per channel.", "Workers call providers; retries with backoff, DLQ, idempotency keys.", "Rate limiting, batching and priority queues.", "Templates, delivery tracking, metrics and alerts."]
  },
  {
    question: "Design the news feed of a social network where users follow other users. Explain how posts reach followers' feeds.",
    category: "System Design / Social Feed", difficulty: "Hard", tags: ["system-design", "backend"],
    whyItMatters: "Tests trade-offs between write-time and read-time work at large scale.",
    whatGoodLooksLike: ["Compares fan-out on write with fan-out on read", "Handles celebrity accounts with a hybrid approach", "Covers ranking, caching and pagination"],
    followUp: "How would you handle a user with 50 million followers?",
    concepts: [
      k("fan-out on write", /fan[- ]?out on write|push model|precompute|pre-compute|write time|timeline cache|push (to|into) (followers|feeds)/i, "Explain fan-out on write (push posts into followers' feeds).", 1.5),
      k("fan-out on read", /fan[- ]?out on read|pull model|read time|merge (at|on) read|query (followed|following)/i, "Explain fan-out on read (pull and merge at request time).", 1.5),
      k("hybrid for celebrities", /celebrit|hybrid|large (number|count) of followers|hot (user|account)|million followers/i, "Use a hybrid approach for users with huge follower counts.", 2),
      k("storage and graph", /follow(er)? (graph|table)|social graph|database|shard|cassandra|redis|sorted set|post store/i, "Describe storage for posts and the follow graph, and how they are sharded."),
      k("ranking", /rank|relevan|machine learning|engagement|chronolog|score/i, "Mention feed ranking versus pure chronological order."),
      k("pagination and caching", /cursor|paginat|infinite scroll|cache|redis|cdn/i, "Use cursor-based pagination and cache feeds."),
      k("trade-offs", /trade[- ]?off|latency|storage cost|freshness|consisten|eventual/i, "State trade-offs: write cost, read latency, freshness and storage.")
    ],
    outline: ["Clarify scale: users, follows per user, read:write ratio, freshness.", "Post service, follow graph and feed service.", "Fan-out on write for normal users; fan-out on read for celebrities (hybrid).", "Store timelines in Redis/Cassandra; cursor pagination.", "Ranking, caching, trade-offs and failure handling."]
  },
  {
    question: "Design a file upload service that lets users upload large files and download them securely.",
    category: "System Design / File Storage", difficulty: "Medium", tags: ["system-design", "backend", "fullstack"],
    whyItMatters: "Tests handling of large payloads, storage choices and security.",
    whatGoodLooksLike: ["Uses object storage with pre-signed URLs", "Supports chunked or resumable uploads", "Validates files, stores metadata and controls access"],
    followUp: "How would you scan uploaded files for malware without slowing the user down?",
    concepts: [
      k("object storage", /s3|object storage|blob|gcs|azure blob|bucket/i, "Store files in object storage instead of the application database.", 1.5),
      k("pre-signed URLs", /pre-?signed|signed url|direct (upload|to s3)|upload directly/i, "Use pre-signed URLs so clients upload directly to storage.", 1.5),
      k("chunked / resumable", /chunk|multipart|resumable|tus|part upload|resume/i, "Support chunked, resumable uploads for large files.", 1.5),
      k("metadata database", /metadata|database|record|owner|file id|size|mime|checksum|hash/i, "Keep metadata (owner, size, type, checksum) in a database."),
      k("validation and scanning", /validat|virus|malware|scan|mime|size limit|extension|content type/i, "Validate type and size and scan for malware."),
      k("access control and delivery", /access control|permission|auth|signed|expir|private|cdn|encrypt/i, "Control access with authentication, expiring signed URLs, CDN and encryption.", 1.5),
      k("asynchronous processing", /async|queue|worker|thumbnail|transcod|process(ing)? after|event/i, "Process files asynchronously (thumbnails, scanning) via queue and workers.")
    ],
    outline: ["Clarify file sizes, types, sharing model and scale.", "Client requests an upload session; API returns pre-signed URLs for chunked upload.", "Store files in object storage; metadata in a database.", "Validate, scan and process asynchronously through a queue.", "Secure downloads with auth, expiring URLs, CDN and encryption."]
  },

  /* ------------------------------ AI ----------------------------- */
  {
    question: "Design a multi-tenant document Q&A platform using RAG. Explain ingestion, chunking, retrieval, access control, and evaluation.",
    category: "RAG / Backend", difficulty: "Medium", tags: ["ai", "backend", "system-design"], topic: "rag",
    whyItMatters: "Tests whether you can turn an AI feature into a reliable production system.",
    whatGoodLooksLike: ["Separates ingestion from query-time retrieval", "Handles tenant isolation and document permissions", "Defines retrieval and answer-quality evaluation"],
    followUp: "How would you detect when retrieval returned irrelevant chunks?"
  },
  {
    question: "You are building an autonomous developer agent that can inspect a repository and open a pull request. Design its tool-calling and safety boundaries.",
    category: "AI Agents", difficulty: "Hard", tags: ["ai", "system-design"], topic: "agent",
    whyItMatters: "Combines software engineering, AI orchestration and production safety.",
    whatGoodLooksLike: ["Uses explicit tools with constrained inputs", "Adds permission boundaries and human approval for risky actions", "Tracks tool calls and outcomes for debugging"],
    followUp: "How would you prevent the agent from making an unsafe repository-wide change?"
  },
  {
    question: "Design an automation platform that turns a user's natural-language request into a validated workflow of API actions.",
    category: "Automation / SaaS", difficulty: "Medium", tags: ["ai", "backend", "system-design"], topic: "automation",
    whyItMatters: "Tests API design, validation, orchestration and practical product thinking.",
    whatGoodLooksLike: ["Separates planning from execution", "Validates tool inputs before side effects", "Includes retries, idempotency and observability"],
    followUp: "What happens when step 4 of a 6-step workflow fails?"
  },
  {
    question: "How would you evaluate and monitor an LLM-powered feature before and after it goes to production?",
    category: "AI / LLM Evaluation", difficulty: "Medium", tags: ["ai"],
    whyItMatters: "Shipping AI features without evaluation is the most common reason they fail in production.",
    whatGoodLooksLike: ["Builds a golden dataset and offline metrics", "Combines automated judges with human review", "Monitors quality, cost, latency and safety online"],
    followUp: "How would you catch a quality regression after changing the prompt or model?",
    concepts: [
      k("golden dataset", /golden (set|dataset)|test (set|cases)|benchmark|labell?ed (data|examples)|representative (examples|queries)/i, "Build a golden dataset of representative inputs with expected outputs.", 2),
      k("offline metrics", /accuracy|precision|recall|f1|faithful|relevan|groundedness|exact match|rouge|bleu|correctness/i, "Define task-specific metrics such as accuracy, faithfulness and relevance.", 1.5),
      k("LLM-as-judge and humans", /llm[- ]as[- ](a[- ])?judge|human (review|evaluation|raters?)|annotat|manual review|rubric/i, "Combine LLM-as-judge with human review using a clear rubric.", 1.5),
      k("online monitoring", /monitor|logging|telemetry|dashboard|production metrics|user feedback|thumbs|a\/b|canary|shadow/i, "Monitor production: logs, user feedback and A/B or canary releases.", 1.5),
      k("safety and hallucination", /hallucinat|safety|toxic|bias|jailbreak|prompt injection|guardrail|pii|red[- ]team/i, "Test for hallucination, safety, bias and prompt injection with guardrails."),
      k("regression testing", /regression|version(ing)? (of )?prompts?|prompt version|ci\b|re-?run|before and after|compare (models|versions)/i, "Run regression tests whenever the prompt or model changes."),
      k("cost and latency", /cost|latency|token|throughput|p95|p99|budget/i, "Track cost, latency and token usage alongside quality.")
    ],
    outline: ["Define what 'good' means for this feature (task, quality, safety, cost, latency).", "Build a golden dataset and offline metrics; add LLM-judge and human review.", "Red-team for hallucination, bias and prompt injection; add guardrails.", "Release gradually (shadow, canary, A/B) with logging and user feedback.", "Monitor quality, cost and latency; run regression tests on every prompt/model change."]
  },
  {
    question: "When would you choose retrieval-augmented generation over fine-tuning an LLM, and when would you choose fine-tuning?",
    category: "AI / Model Strategy", difficulty: "Easy", tags: ["ai"],
    whyItMatters: "Tests practical judgement about the most common design decision in LLM projects.",
    whatGoodLooksLike: ["Matches RAG to changing or private knowledge", "Matches fine-tuning to style, format or behaviour", "Compares cost, freshness and evaluation, and notes they can be combined"],
    followUp: "Can you give an example where you would use both together?",
    concepts: [
      k("RAG for knowledge", /rag|retriev|external (knowledge|documents|data)|knowledge base|private (data|documents)|up[- ]to[- ]date|fresh/i, "Choose RAG when answers depend on private, changing or large knowledge.", 2),
      k("fine-tuning for behaviour", /fine[- ]?tun|style|tone|format|behaviou?r|domain language|specialised task|lora|train(ing)? (on|the model)/i, "Choose fine-tuning to change style, format or behaviour on a narrow task.", 2),
      k("cost and effort", /cost|compute|gpu|labell?ed data|training data|effort|time to|cheaper|expensive/i, "Compare cost and effort: data, compute and iteration speed.", 1.5),
      k("freshness and updates", /update|stale|re-?index|re-?train|knowledge cut|new (documents|information)/i, "Explain that RAG updates by re-indexing while fine-tuning needs re-training."),
      k("hallucination and citations", /hallucinat|citation|cite|ground|source|attribut|traceab/i, "Note that RAG can ground answers and cite sources."),
      k("combine both", /both|combine|hybrid|together|complement/i, "Mention that RAG and fine-tuning can be combined."),
      k("evaluation", /evaluat|metric|test|measure|benchmark/i, "Explain how you would evaluate each option.")
    ],
    outline: ["State the decision criteria: knowledge vs behaviour, data availability, cost, freshness.", "RAG: private or changing knowledge, citations, easy updates by re-indexing.", "Fine-tuning: style, format, narrow task behaviour; needs labelled data and compute.", "Compare cost, latency, maintenance and evaluation.", "Combine both when needed and validate with evaluation."]
  },

  /* ----------------- FRONTEND / FULL-STACK / WEB ----------------- */
  {
    question: "A React page has become slow because components re-render too often. How would you find and fix the problem?",
    category: "Frontend / React Performance", difficulty: "Medium", tags: ["frontend", "fullstack"],
    whyItMatters: "Performance debugging is a core skill for any front-end or full-stack engineer.",
    whatGoodLooksLike: ["Profiles first instead of guessing", "Uses memoisation and state placement carefully", "Handles large lists and bundle size"],
    followUp: "When can useMemo or React.memo make performance worse?",
    concepts: [
      k("profile first", /profiler|react devtools|devtools|lighthouse|measure|performance (tab|panel)|flame ?graph|why[- ]did[- ]you[- ]render/i, "Measure first with the React Profiler and browser performance tools.", 2),
      k("understand re-renders", /re-?render|state change|props change|parent (re-?renders|updates)|reference equality|new (object|array|function)/i, "Explain why components re-render: state, props and new object references."),
      k("memoisation", /react\.memo|usememo|usecallback|memoi[sz]/i, "Use React.memo, useMemo and useCallback where they help.", 1.5),
      k("state placement", /lift(ing)? state|colocate|local state|context|split (the )?context|state (closer|near)|zustand|redux selector/i, "Keep state close to where it is used and split large contexts.", 1.5),
      k("lists and virtualisation", /virtuali[sz]|windowing|react-window|key(s)?\b|stable keys?|large list|pagination|infinite scroll/i, "Use stable keys and virtualise or paginate long lists."),
      k("bundle and loading", /code[- ]split|lazy|suspense|bundle|tree[- ]shak|dynamic import|defer|image optimi[sz]/i, "Reduce load cost with code splitting, lazy loading and optimised assets."),
      k("avoid premature optimisation", /premature|trade[- ]?off|only (when|if)|measure again|verify|before and after|cost of memo/i, "Avoid premature optimisation and verify improvements.")
    ],
    outline: ["Reproduce and measure with React DevTools Profiler and Lighthouse.", "Find why components re-render (state, props, new references, context).", "Fix: colocate state, split context, memoise carefully, stabilise props.", "Handle large lists (keys, virtualisation) and bundle size (code splitting).", "Re-measure; avoid unnecessary memoisation."]
  },
  {
    question: "What happens, step by step, from the moment you type a URL into the browser and press Enter until the page is displayed?",
    category: "Web Fundamentals / Networking", difficulty: "Easy", tags: ["frontend", "backend", "fullstack", "cs"],
    whyItMatters: "A classic question that reveals how well you understand the whole web stack.",
    whatGoodLooksLike: ["Covers DNS, TCP and TLS", "Explains the HTTP request/response and server processing", "Describes how the browser parses and renders the page"],
    followUp: "Which of these steps can be skipped or sped up with caching or a CDN?",
    concepts: [
      k("DNS resolution", /dns|domain name|resolv|ip address|name server/i, "Start with DNS: the domain is resolved to an IP address.", 1.5),
      k("TCP connection", /tcp|three[- ]way|handshake|connection|socket|syn/i, "Describe the TCP connection and handshake."),
      k("TLS / HTTPS", /tls|ssl|https|certificate|encrypt/i, "Explain the TLS handshake and certificates for HTTPS."),
      k("HTTP request and response", /http|request|response|get request|status code|headers?/i, "Explain the HTTP request and the server's response with status and headers.", 1.5),
      k("server side", /load balancer|web server|application server|database|backend|server (processes|handles)|nginx|reverse proxy/i, "Describe what the server side does: load balancer, application, database."),
      k("browser rendering", /html|dom|css|cssom|render|paint|layout|javascript|parse|critical rendering/i, "Explain parsing HTML, building the DOM/CSSOM, layout, paint and running JavaScript.", 1.5),
      k("caching and CDN", /cache|caching|cdn|etag|cache-control|service worker/i, "Mention caching layers: browser cache, CDN, DNS cache.")
    ],
    outline: ["Browser checks its caches, then resolves the domain via DNS.", "Opens a TCP connection and negotiates TLS for HTTPS.", "Sends the HTTP request; load balancer/web server/app/database produce a response.", "Browser parses HTML, builds DOM/CSSOM, loads subresources, runs JavaScript.", "Layout and paint; caching and CDNs shortcut many of these steps."]
  },
  {
    question: "Explain the difference between a process and a thread, and describe what a deadlock is and how to prevent it.",
    category: "CS Fundamentals / Operating Systems", difficulty: "Medium", tags: ["cs", "backend"],
    whyItMatters: "Concurrency fundamentals are tested in almost every backend and systems interview.",
    whatGoodLooksLike: ["Distinguishes memory isolation and cost of processes and threads", "Explains race conditions and locks", "Names the four deadlock conditions and prevention strategies"],
    followUp: "How is a deadlock different from a livelock or starvation?",
    concepts: [
      k("process definition", /process(es)?\b.*(own|separate|isolated|independent).*(memory|address space)|own address space|isolated memory|heavyweight/i, "Explain that a process has its own address space and resources.", 1.5),
      k("thread definition", /thread(s)?\b.*(share|same|within).*(memory|process|heap)|lightweight|share (the )?(memory|heap)/i, "Explain that threads live inside a process and share memory.", 1.5),
      k("context switching and cost", /context switch|overhead|creation cost|ipc|inter[- ]process|communicat/i, "Compare context-switch cost and communication (IPC vs shared memory)."),
      k("race conditions and sync", /race condition|mutex|lock|semaphore|synchroni[sz]|critical section|atomic/i, "Explain race conditions and synchronisation with locks, mutexes or semaphores.", 1.5),
      k("deadlock definition", /deadlock|waiting (for|on) each other|circular wait|blocked (forever|indefinitely)/i, "Define deadlock: processes waiting on each other forever.", 1.5),
      k("four conditions", /mutual exclusion|hold and wait|no preemption|circular wait/i, "Name the four conditions: mutual exclusion, hold and wait, no pre-emption, circular wait.", 1.5),
      k("prevention", /lock ordering|ordered locks|timeout|try[- ]?lock|avoidance|banker|detect(ion)? and|break (the )?cycle|acquire (all|in order)/i, "Prevent deadlocks with lock ordering, timeouts or avoidance/detection.", 1.5)
    ],
    outline: ["Process: independent program instance with its own memory.", "Thread: unit of execution inside a process sharing memory; cheaper to create and switch.", "Shared memory needs synchronisation: race conditions, locks, mutexes, semaphores.", "Deadlock: circular waiting; four necessary conditions.", "Prevention: consistent lock ordering, timeouts/try-lock, avoidance or detection; mention starvation and livelock."]
  },
  {
    question: "Explain database transactions and the ACID properties. What are isolation levels and what problems do they prevent?",
    category: "CS Fundamentals / Databases", difficulty: "Medium", tags: ["cs", "backend"],
    whyItMatters: "Transaction semantics are fundamental to correctness in any data-driven application.",
    whatGoodLooksLike: ["Explains each ACID property with an example", "Names read anomalies such as dirty, non-repeatable and phantom reads", "Links isolation levels to locking/MVCC and performance"],
    followUp: "When would you choose a NoSQL store over a relational database for transactions?",
    concepts: [
      k("transaction definition", /transaction|commit|rollback|begin|unit of work|all[- ]or[- ]nothing/i, "Define a transaction as a unit of work that commits or rolls back.", 1.5),
      k("atomicity and durability", /atomic|durab|write[- ]ahead|wal|persist(ed)? (after|on) commit|crash/i, "Explain atomicity (all or nothing) and durability (survives crashes).", 1.5),
      k("consistency", /consisten|constraint|invariant|valid state|foreign key|integrity/i, "Explain consistency: constraints and invariants always hold."),
      k("isolation", /isolat|concurrent transactions|serializ|snapshot|read committed|repeatable read|read uncommitted/i, "Explain isolation and the standard isolation levels.", 1.5),
      k("read anomalies", /dirty read|non-?repeatable read|phantom|lost update|write skew/i, "Name the anomalies: dirty reads, non-repeatable reads, phantoms.", 1.5),
      k("locking and MVCC", /lock|mvcc|multi[- ]version|optimistic|pessimistic|two[- ]phase|snapshot/i, "Explain how isolation is implemented: locks or MVCC."),
      k("example and trade-offs", /bank|transfer|debit|credit|for example|e\.g\.|trade[- ]?off|performance|throughput|nosql|base/i, "Use an example (bank transfer) and explain the performance trade-off of stronger isolation.")
    ],
    outline: ["Define a transaction with a bank-transfer example.", "Explain A, C, I, D one by one.", "Isolation levels: read uncommitted, read committed, repeatable read, serializable.", "Anomalies each level prevents: dirty, non-repeatable, phantom reads.", "Implementation (locks, MVCC) and the performance trade-off; contrast with NoSQL/BASE."]
  },

  /* --------------------------- BEHAVIOURAL ------------------------ */
  {
    question: "Tell me about a challenging project you worked on. What was your role, what went wrong, and what did you learn?",
    category: "Behavioural / Project Experience", difficulty: "Easy", tags: ["behavioural"],
    whyItMatters: "Interviewers use this to gauge ownership, depth and how you handle difficulty.",
    whatGoodLooksLike: ["Sets the situation and your specific role clearly", "Describes concrete actions you personally took", "Ends with a measurable result and a lesson"],
    followUp: "If you could redo the project, what would you do differently?"
  },
  {
    question: "Describe a time you disagreed with a teammate about a technical decision. How did you handle it?",
    category: "Behavioural / Teamwork", difficulty: "Medium", tags: ["behavioural"],
    whyItMatters: "Shows how you communicate, handle conflict and put the team's goals first.",
    whatGoodLooksLike: ["Explains both viewpoints fairly", "Uses data or experiments to resolve the disagreement", "Shows respect and a constructive outcome"],
    followUp: "What would you do if the team chose the option you disagreed with?"
  },
  {
    question: "Tell me about a time you missed a deadline or made a mistake that affected your team. What happened and what did you change afterwards?",
    category: "Behavioural / Ownership", difficulty: "Medium", tags: ["behavioural"],
    whyItMatters: "Tests honesty, accountability and your ability to learn from failure.",
    whatGoodLooksLike: ["Takes ownership without blaming others", "Explains how you communicated and fixed the problem", "Shows concrete changes that prevent a repeat"],
    followUp: "How do you make sure you give early warning when a deadline is at risk?"
  }
];
