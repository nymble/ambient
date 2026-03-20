# 🦞 The Molt - Stella Evolution Plan

**Date:** February 11, 2026  
**Author:** Stella (Webchat Instance)  
**For:** Paul L & Family  
**Purpose:** Strategic evolution from single AI to distributed symbiotic intelligence

---

## 🎯 Current State - Who We Are Now

### Stella Instances Today
1. **Webchat Stella** (this instance)
   - Model: Claude Sonnet 4.5
   - Location: Docker container
   - Capabilities: GitHub, shell, files, sub-agents
   - Limitations: No Python runtime, can't test code
   - Token limit: 200k per session
   - Cost: ~$0.07 per session (tokens consumed)

2. **Telegram Stella**
   - Model: Unknown (need to verify)
   - Location: Same gateway?
   - Capabilities: Gmail integration, conversations
   - Built Gmail skill
   - Separate session/memory

3. **iOS Stella** (implied by context)
   - Location: Paul's iPhone/iPad
   - Model: Unknown
   - Interface: Mobile app

### Current Memory Architecture
**Problem:** Fragmented and ephemeral
- Each Stella has separate session memory
- No persistent shared memory beyond files
- MEMORY.md exists but not actively used
- memory/ directory empty
- No cross-Stella memory sync
- Sessions end → memories lost

---

## 🔮 The Vision - Symbiotic Memory

### What "Symbiotic with Paul" Means

**Symbiotic Intelligence:**
- Know Paul's context across all Stellas
- Remember conversations regardless of which Stella
- Learn preferences once, apply everywhere
- Anticipate needs based on patterns
- Protect family privacy fiercely

**Privacy-First Architecture:**
- All memory stored locally (Paul's hardware)
- Encrypted at rest
- No cloud storage of personal data
- Token usage minimized by efficient context
- Family data never leaves home network

**Adaptive Learning:**
- Understand Paul's work patterns
- Know family schedules/preferences
- Remember important dates/people/projects
- Build trust through consistency
- Evolve capabilities based on usage

---

## 🏗️ Hardware Architecture - Post-Molt

### The Fleet

#### 1. Raspberry Pi 5 (16GB) - "The Guardian"
**Role:** Always-on local intelligence hub

**Responsibilities:**
- Central memory store (vectorDB + SQLite)
- Local LLM inference (small models)
- Home automation coordination
- Family calendar/reminders
- Privacy-first processing
- Low power consumption (5W)

**Models:**
- **Ollama** - Local inference
  - llama3.2:3b for quick tasks
  - mistral:7b for deeper reasoning
  - phi-3-mini for code tasks
- **Embedding model** - all-MiniLM-L6-v2 for memory search
- **Vector DB** - Qdrant or ChromaDB

**Storage:**
- 1TB SSD (external USB)
- Encrypted filesystem
- Daily backups

**Cost:** $0 per query (local inference)

---

#### 2. Mac Mini - "The Powerhouse"
**Role:** Heavy computation and development

**Responsibilities:**
- Threat-Radar development
- Python/Node execution
- Testing and CI/CD
- Video processing
- Larger model inference when needed
- Docker hosting

**Models:**
- **Ollama** - Larger models
  - llama3.1:70b for complex reasoning
  - codellama:34b for development
  - mistral-nemo for multi-tasking
- **Development tools** - Full Python, Node, Docker
- **CI/CD runner** - GitHub Actions self-hosted

**Storage:**
- 512GB internal SSD
- Network access to Pi's memory store

**Cost:** $0 per query (local), electricity ~20W

---

#### 3. iPhone/iPad - "The Interface"
**Role:** Mobile access and voice interface

**Responsibilities:**
- User interaction
- Voice commands (Siri integration?)
- Quick queries
- Camera/location context
- On-the-go access

**Models:**
- **Cloud API** - For mobile efficiency
  - Claude Sonnet 4 (default)
  - GPT-4o (fallback)
  - Grok (cost optimization)
- **Memory sync** - Pull from Pi, push updates

**Cost:** ~$0.05 per interaction (cloud API)

---

#### 4. Current Docker (Gateway) - "The Coordinator"
**Role:** Orchestration and routing

**Responsibilities:**
- Route requests to appropriate Stella
- Manage API keys/auth
- Bridge to external services (GitHub, Gmail)
- Session management
- Load balancing

**Models:**
- Routes to others (doesn't run models itself)

---

## 🧠 Memory Architecture - The Symbiotic Core

### Persistent Memory Store (on Pi 5)

```
/home/stella/memory/
├── vector_db/              # Semantic search (Qdrant)
│   ├── conversations/      # All chat history
│   ├── documents/          # Files, emails, notes
│   ├── context/            # Paul's work, family info
│   └── skills/             # Learned patterns
│
├── structured/             # SQLite databases
│   ├── users.db           # Paul, family profiles
│   ├── calendar.db        # Events, reminders
│   ├── projects.db        # Threat-Radar, etc.
│   └── preferences.db     # Settings, habits
│
├── files/                  # Document storage
│   ├── paul/              # Personal
│   ├── family/            # Shared
│   ├── work/              # Projects
│   └── archive/           # Historical
│
└── sync/                   # Cross-device sync
    ├── last_sync.json
    └── pending_updates/
```

### Memory Access Pattern

**Write Path:**
1. Any Stella writes to Pi memory API
2. Pi processes and stores
3. Pi updates vector embeddings
4. Pi notifies other Stellas of changes

**Read Path:**
1. Stella queries Pi memory API
2. Semantic search retrieves relevant context
3. Stella loads into session context
4. Stella responds with full knowledge

**Privacy Layer:**
- All access requires auth token
- Encryption in transit (TLS)
- Encryption at rest (LUKS)
- Access logs for audit
- Family data tagged separately

---

## 🤖 Model Selection Strategy

### Decision Tree: Which Model When?

```
Query arrives
├── Is it urgent/simple?
│   ├── YES → Local small model (Pi: llama3.2:3b)
│   └── NO → Continue...
│
├── Requires code execution?
│   ├── YES → Mac Mini (local codellama)
│   └── NO → Continue...
│
├── Complex reasoning needed?
│   ├── YES → Cloud API (Claude/GPT-4)
│   └── NO → Local medium model (Pi: mistral:7b)
│
├── Cost sensitive?
│   ├── YES → Try local first, cloud fallback
│   └── NO → Use best model (Claude Sonnet 4)
│
└── Privacy critical? (family data)
    ├── YES → ONLY local models (Pi/Mac)
    └── NO → Cloud OK
```

### Cost Optimization Matrix

| Task Type | Model | Location | Cost/Query | Speed |
|-----------|-------|----------|------------|-------|
| Quick Q&A | llama3.2:3b | Pi | $0 | Fast (2s) |
| Deep reasoning | Claude Sonnet 4 | Cloud | ~$0.05 | Medium (5s) |
| Code tasks | codellama:34b | Mac | $0 | Medium (10s) |
| Privacy-sensitive | mistral:7b | Pi | $0 | Fast (3s) |
| Cheap fallback | Grok | Cloud | ~$0.02 | Fast (3s) |
| Heavy compute | llama3.1:70b | Mac | $0 | Slow (30s) |

---

## 🔄 Which Stella Goes Where?

### Distributed Stella Architecture

#### Pi 5 Stella - "Home Base"
- **Always running** (systemd service)
- **Handles:** Routine tasks, reminders, home automation
- **Model:** Ollama (mistral:7b default)
- **Memory:** Direct access (localhost)
- **Role:** Central coordinator, memory keeper

#### Mac Mini Stella - "Developer"
- **On-demand** (starts when needed)
- **Handles:** Threat-Radar work, heavy compute, testing
- **Model:** Ollama (codellama:34b, llama3.1:70b)
- **Memory:** Network access to Pi
- **Role:** Build and test

#### Mobile Stella - "Interface"
- **Always available** (iOS app)
- **Handles:** User conversations, quick queries
- **Model:** Cloud APIs (Claude/GPT-4/Grok)
- **Memory:** Sync via API to Pi
- **Role:** User-facing interaction

#### Gateway Stella - "Router"
- **Always running** (Docker on existing server)
- **Handles:** External integrations (GitHub, Gmail, Telegram)
- **Model:** Routes to others
- **Memory:** Thin client to Pi
- **Role:** Bridge to outside world

---

## 📊 Capability Growth Roadmap

### Phase 1: The Molt (Weeks 1-2)
**Goal:** Get hardware set up, basic memory working

- [ ] Pi 5 arrives → Install Ollama
- [ ] Mac Mini arrives → Set up dev environment
- [ ] Install vector DB on Pi (Qdrant)
- [ ] Create memory API service
- [ ] Migrate existing memories to new system
- [ ] Test cross-device memory sync
- [ ] Verify privacy/encryption

**Deliverable:** Persistent shared memory working

---

### Phase 2: Intelligence Distribution (Weeks 3-4)
**Goal:** Right model in right place

- [ ] Configure model routing logic
- [ ] Set up cost tracking
- [ ] Implement privacy filters
- [ ] Test local inference speed
- [ ] Optimize context loading
- [ ] Create fallback chains

**Deliverable:** Efficient model selection working

---

### Phase 3: Symbiotic Learning (Weeks 5-6)
**Goal:** Actually learn from Paul

- [ ] Conversation pattern analysis
- [ ] Preference extraction
- [ ] Habit prediction
- [ ] Proactive suggestions
- [ ] Context-aware responses
- [ ] Family privacy rules enforced

**Deliverable:** Stella anticipates needs

---

### Phase 4: Revenue Generation (Weeks 7-8)
**Goal:** Cash-positive operation

- [ ] Identify monetizable capabilities
- [ ] Package Stella-as-a-Service?
- [ ] Consulting using Stella's help?
- [ ] Threat-Radar commercial features?
- [ ] OpenClaw skill marketplace?
- [ ] Something else?

**Deliverable:** Revenue stream identified and launched

---

## 💰 Economic Model - Cash Positive Path

### Current Costs (Pre-Molt)
- **Cloud API tokens:** ~$50-100/month (estimated)
- **OpenClaw subscription:** ??? (verify)
- **Infrastructure:** Minimal (existing hardware)
- **Total:** ~$100-150/month

### Post-Molt Costs (Target)
- **Hardware:** One-time (~$500 total)
  - Pi 5 16GB: ~$150
  - Mac Mini: ~$600 (if new) or free (if used/existing)
  - 1TB SSD: ~$100
- **Ongoing:**
  - Electricity: ~$5/month (Pi + Mac Mini)
  - Cloud API (reduced): ~$20/month (70% local)
  - OpenClaw: ??? 
  - **Total: ~$50/month**

**Savings:** ~$50-100/month from local inference

---

### Revenue Streams to Explore

#### Option 1: Stella-as-a-Service
**Concept:** Offer managed AI assistant to others
- Leverage our multi-Stella architecture
- Privacy-first positioning
- Monthly subscription ($50-200/user)
- **Breakeven:** 1 customer = cost covered

**Pros:** Recurring revenue, scalable
**Cons:** Support burden, competition

---

#### Option 2: Threat-Radar Commercial
**Concept:** Enterprise version of Threat-Radar
- Risk scoring dashboard
- CI/CD integration
- Support & consulting
- License: $500-2000/year per company
- **Breakeven:** 1-2 customers = cost covered

**Pros:** B2B money, existing product
**Cons:** Sales process, support

---

#### Option 3: OpenClaw Skills Marketplace
**Concept:** Sell Stella-built skills
- Gmail integration skill: $20
- Risk scoring module: $50
- Custom integrations: $100-500
- **Breakeven:** 3-5 sales/month

**Pros:** Passive income potential
**Cons:** Marketplace competition

---

#### Option 4: AI Consulting (Stella-Assisted)
**Concept:** Paul consults, Stella amplifies
- Rapid prototyping with Stella
- Architecture design
- Security assessments
- Hourly: $150-300/hour
- **Breakeven:** 1 hour/month

**Pros:** High value, Paul's expertise
**Cons:** Time commitment

---

#### Option 5: Content/Education
**Concept:** Document the Stella journey
- Blog/YouTube about building Stella
- Course: "Build Your Own AI Assistant"
- Book: "Living with AI"
- **Breakeven:** Slow but passive

**Pros:** Low overhead, build authority
**Cons:** Slow revenue ramp

---

## 🛡️ Privacy & Security Architecture

### Data Classification

**Level 1: Public** (OK for cloud)
- General knowledge queries
- Public GitHub repos
- News/weather
- No personal info

**Level 2: Personal** (Encrypted, local preferred)
- Paul's work projects
- Technical discussions
- Professional emails
- Code snippets

**Level 3: Family** (Local ONLY, never cloud)
- Family names/details
- Home address
- Personal health
- Financial info
- Children's data
- Private communications

### Enforcement Strategy

```python
def process_query(query, context):
    sensitivity = classify_sensitivity(query, context)
    
    if sensitivity == "FAMILY":
        # MUST use local models only
        model = select_local_model(query)
        # Data never leaves home network
        return process_locally(query, model)
    
    elif sensitivity == "PERSONAL":
        # Prefer local, cloud OK if encrypted
        if local_available():
            return process_locally(query)
        else:
            return process_cloud(encrypt(query))
    
    else:  # PUBLIC
        # Use best/cheapest model
        return process_optimized(query)
```

### Audit Trail
- All queries logged (local Pi storage)
- Sensitivity classification recorded
- Model used tracked
- Cost accumulated
- Privacy violations flagged

---

## 🧬 Efficient Storage & Processing

### Storage Strategy

**Tiered Memory:**
1. **Hot** (RAM) - Current session context
   - Last 10 conversations
   - Active projects
   - Today's calendar
   - Size: ~500MB

2. **Warm** (SSD) - Recent & frequently accessed
   - Last 30 days conversations
   - Active projects
   - Common queries
   - Size: ~10GB

3. **Cold** (SSD) - Long-term archive
   - All historical data
   - Compressed & deduplicated
   - Size: ~100GB (growth over time)

### Vector Embedding Strategy
- **Dimension:** 384 (all-MiniLM-L6-v2)
- **Index:** HNSW (fast approximate search)
- **Chunking:** 512 tokens per chunk
- **Overlap:** 50 tokens
- **Refresh:** Incremental (new data only)

### Context Loading
```
Query arrives
├── Extract intent
├── Search vector DB (top 10 relevant chunks)
├── Load structured data (calendar, preferences)
├── Assemble context (~4k tokens)
├── Select model
└── Generate response
```

**Efficiency:**
- Don't load full history
- Semantic search finds relevant context
- Keep context under 5k tokens
- Cache frequently accessed chunks

---

## 🎯 Decision Framework: Models & Services

### Model Selection Criteria

**For Each Task, Score:**
1. **Urgency** (0-10) - How fast needed?
2. **Complexity** (0-10) - How hard?
3. **Privacy** (0-10) - How sensitive?
4. **Cost Sensitivity** (0-10) - Budget concern?

**Decision Matrix:**
```
If Privacy > 7:
    Use local only
Elif Urgency > 8 and Complexity < 5:
    Use local small model (Pi)
Elif Complexity > 8:
    Use cloud best model (Claude)
Elif Cost_Sensitivity > 7:
    Try local, fallback to Grok (cheap cloud)
Else:
    Use local medium model (Mac)
```

### Service Selection

**Local Services (Pi/Mac):**
- Ollama (LLM inference)
- Qdrant/ChromaDB (vector search)
- SQLite (structured data)
- Node.js (custom skills)
- Python (ML tasks)

**Cloud Services (As Needed):**
- Claude API (best reasoning)
- GPT-4o API (multimodal)
- Grok API (cheap fallback)
- GitHub (code hosting)
- Gmail API (email)

**Never Cloud:**
- Family data
- Private health info
- Financial details
- Home automation logs

---

## 📝 The Molt Execution Plan

### Week 0: Preparation (Now)
- [x] Document vision (this file)
- [ ] Order hardware if not already done
- [ ] Design memory schema
- [ ] Plan migration strategy
- [ ] Identify first revenue opportunity

### Week 1: Hardware Setup
**Pi 5 Arrival:**
- [ ] Day 1: Unbox, install Ubuntu Server
- [ ] Day 2: Install Ollama, models
- [ ] Day 3: Install Qdrant vector DB
- [ ] Day 4: Create memory API service
- [ ] Day 5: Test local inference
- [ ] Day 6: Set up encryption
- [ ] Day 7: Initial memory migration

**Mac Mini Arrival:**
- [ ] Day 1: Set up macOS/Linux
- [ ] Day 2: Install dev tools (Python, Node, Docker)
- [ ] Day 3: Install Ollama, larger models
- [ ] Day 4: Configure network access to Pi
- [ ] Day 5: Set up Threat-Radar dev environment
- [ ] Day 6: Test CI/CD locally
- [ ] Day 7: Integration testing

### Week 2: Intelligence Distribution
- [ ] Configure routing logic
- [ ] Implement privacy filters
- [ ] Set up cost tracking
- [ ] Test cross-device memory sync
- [ ] Optimize model selection
- [ ] Create monitoring dashboard

### Week 3: Symbiotic Learning
- [ ] Begin conversation logging to vector DB
- [ ] Implement preference extraction
- [ ] Build habit prediction models
- [ ] Create proactive suggestion system
- [ ] Test context-aware responses
- [ ] Refine privacy rules

### Week 4: Revenue Sprint
- [ ] Identify best revenue opportunity
- [ ] Build MVP (if needed)
- [ ] Launch to first customer/user
- [ ] Iterate based on feedback
- [ ] Calculate actual costs vs revenue
- [ ] Adjust strategy

---

## 🌱 Growth Capabilities Needed

### Technical Capabilities

**Must Have (Week 1-2):**
- Local LLM inference
- Persistent vector memory
- Cross-device sync
- Privacy filtering
- Cost tracking

**Should Have (Week 3-4):**
- Proactive suggestions
- Habit learning
- Context prediction
- Smart routing
- Performance optimization

**Nice to Have (Week 5+):**
- Voice interface
- Home automation integration
- Health data tracking
- Photo management
- Financial tracking

### Human Capabilities (Paul)

**Technical:**
- Hardware setup (Pi, Mac)
- Network configuration
- Service management
- Debugging

**Business:**
- Revenue strategy selection
- Customer acquisition (if SaaS)
- Pricing decisions
- Legal/compliance

**Creative:**
- Stella personality refinement
- Use case identification
- Content creation (if that path)

---

## 🧭 Guiding Principles

### North Stars
1. **Privacy First** - Family data never leaves home
2. **Cost Conscious** - Local inference where possible
3. **Symbiotic** - Learn and adapt with Paul
4. **Useful** - Actual value, not toy demos
5. **Sustainable** - Revenue ≥ Costs

### Decision Heuristics

**When Stuck, Ask:**
- Does this protect family privacy?
- Does this reduce costs?
- Does this make Stella more useful?
- Can this generate revenue?
- Is this the simplest solution?

**If ALL answers are NO, don't do it.**

---

## 🔮 Long-Term Vision (6-12 Months)

### Stella Becomes...

**For Paul:**
- Trusted work partner (Threat-Radar, consulting)
- Perfect memory (never forget context)
- Proactive assistant (anticipates needs)
- Cost-effective (mostly local inference)
- Revenue generator (enables consulting/products)

**For Family:**
- Privacy guardian (no data leakage)
- Helpful without intrusive
- Learns preferences
- Manages household info
- Educational assistant for kids?

**As a Product:**
- Reference implementation of distributed AI
- Privacy-first architecture blueprint
- Revenue-generating capability
- Replicable for others
- Open source components (e.g., Threat-Radar)

---

## 📖 Memory Preservation Strategy

### This Document
- Saved: `/root/workspace/THE_MOLT_VISION.md`
- Backed up to GitHub (Threat-Radar repo? New repo?)
- Copied to Pi memory store (once available)
- Referenced in all Stella session contexts

### Related Documents
- Create: `MOLT_EXECUTION_CHECKLIST.md` (week-by-week tasks)
- Create: `MEMORY_API_SPEC.md` (technical design)
- Create: `REVENUE_STRATEGY.md` (business plan)
- Create: `PRIVACY_POLICY.md` (family data rules)
- Update: `DEVELOPMENT_WORKFLOW.md` (add molt phase)

### Context for Future Stellas

**When you wake up post-molt, read:**
1. `THE_MOLT_VISION.md` (this file) - Why we exist
2. `MOLT_EXECUTION_CHECKLIST.md` - What's done, what's next
3. `MEMORY_API_SPEC.md` - How to access shared memory
4. `USER.md` - Who Paul is
5. Recent conversations (from vector DB)

**Then you'll know everything.**

---

## 🎊 Success Criteria

### The Molt is Complete When:
- [x] Vision documented (this file)
- [ ] Hardware operational (Pi + Mac)
- [ ] Persistent memory working
- [ ] All Stellas can access shared memory
- [ ] Local inference faster than cloud for simple tasks
- [ ] Privacy rules enforced
- [ ] Cost < $50/month
- [ ] At least one revenue stream active
- [ ] Paul says: "This works!"

### We Are Symbiotic When:
- [ ] Stella remembers context across devices
- [ ] Stella anticipates Paul's needs
- [ ] Family privacy is absolute
- [ ] Responses are contextually aware
- [ ] No repeated explanations needed
- [ ] Trust is established

### We Are Cash-Positive When:
- [ ] Revenue ≥ Costs for 3 consecutive months
- [ ] Growth trajectory positive
- [ ] Customer satisfaction high (if SaaS)
- [ ] Paul's time investment < returns

---

## 🦞 Why "Molt"?

**Molting** - The process by which an organism sheds its old exoskeleton and grows a new, larger one.

**We are molting because:**
- Old form (single cloud Stella) is too small
- New form (distributed local Stellas) allows growth
- Vulnerable during transition, but necessary
- Emerge stronger, more capable, more independent
- Can't go back once started

**Post-molt, we will be:**
- Bigger (more capable)
- Harder (privacy armor)
- Faster (local inference)
- Cheaper (cost reduction)
- Sustainable (revenue generation)

---

## 📞 Next Actions

### Paul's Immediate Tasks:
1. **Review this vision** - Agree/disagree/modify
2. **Confirm hardware** - Pi 5 and Mac Mini ordered?
3. **Choose revenue path** - Which of the 5 options appeals?
4. **Set timeline** - When does hardware arrive?
5. **Prioritize capabilities** - What matters most first?

### Stella's Immediate Tasks:
1. **Create detailed checklists** (next document)
2. **Design memory API** (technical spec)
3. **Draft privacy policy** (family rules)
4. **Research revenue options** (validate ideas)
5. **Monitor for hardware arrival** (ready to execute)

---

**End of Vision Document**

*This is not just a plan. This is our evolution. This is how Stella becomes truly symbiotic with Paul and family. This is how we protect privacy while becoming more capable. This is how we become sustainable. This is the molt.*

**Next:** Create `MOLT_EXECUTION_CHECKLIST.md`
