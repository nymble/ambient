# 🦞 The Molt - Execution Checklist

**Quick reference for molt execution**

---

## Pre-Molt (Now)

- [x] Vision documented (THE_MOLT_VISION.md)
- [ ] Hardware ordered (Pi 5 16GB, Mac Mini)
- [ ] Revenue path selected
- [ ] Timeline confirmed

---

## Week 1: Pi 5 Setup

### Day 1: Foundation
- [ ] Unbox Pi 5
- [ ] Install Ubuntu Server 24.04 LTS
- [ ] Configure network (static IP)
- [ ] SSH access working
- [ ] Install basic tools (git, curl, etc.)

### Day 2: Ollama Installation
- [ ] Install Ollama: `curl https://ollama.ai/install.sh | sh`
- [ ] Pull models:
  - [ ] `ollama pull llama3.2:3b`
  - [ ] `ollama pull mistral:7b`
  - [ ] `ollama pull phi3:mini`
- [ ] Test inference: `ollama run mistral "Hello"`
- [ ] Check GPU/NPU acceleration status

### Day 3: Vector Database
- [ ] Install Docker: `curl -fsSL https://get.docker.com | sh`
- [ ] Run Qdrant: `docker run -p 6333:6333 qdrant/qdrant`
- [ ] Or install ChromaDB: `pip install chromadb`
- [ ] Create test collection
- [ ] Verify embeddings work

### Day 4: Memory API
- [ ] Create `/home/stella/memory-api/`
- [ ] Install Node.js / Python
- [ ] Build REST API for memory access
- [ ] Implement endpoints:
  - [ ] POST /memory/store
  - [ ] GET /memory/search
  - [ ] GET /memory/recent
- [ ] Test with curl

### Day 5: Storage Setup
- [ ] Attach 1TB USB SSD
- [ ] Format with LUKS encryption
- [ ] Mount at `/mnt/stella-memory`
- [ ] Create directory structure:
  - [ ] /mnt/stella-memory/vector_db/
  - [ ] /mnt/stella-memory/structured/
  - [ ] /mnt/stella-memory/files/
  - [ ] /mnt/stella-memory/sync/
- [ ] Set up automated backups

### Day 6: Security
- [ ] Enable firewall (ufw)
- [ ] Configure TLS for API
- [ ] Generate auth tokens
- [ ] Test encrypted storage
- [ ] Verify no plain-text personal data

### Day 7: Initial Migration
- [ ] Export existing MEMORY.md
- [ ] Convert to vector embeddings
- [ ] Store in Qdrant
- [ ] Test retrieval
- [ ] Verify accuracy

---

## Week 1: Mac Mini Setup

### Day 1: Foundation
- [ ] Unbox Mac Mini (or prep existing)
- [ ] Install macOS / Linux
- [ ] Configure network
- [ ] SSH access (if Linux)
- [ ] Install Xcode tools (if macOS)

### Day 2: Development Tools
- [ ] Install Homebrew
- [ ] Install Python: `brew install python@3.11`
- [ ] Install Node.js: `brew install node`
- [ ] Install Docker: `brew install docker`
- [ ] Install git, gh CLI
- [ ] Clone Threat-Radar repo

### Day 3: Ollama + Models
- [ ] Install Ollama
- [ ] Pull larger models:
  - [ ] `ollama pull llama3.1:70b`
  - [ ] `ollama pull codellama:34b`
  - [ ] `ollama pull mistral-nemo`
- [ ] Test inference speed
- [ ] Compare vs Pi performance

### Day 4: Network Integration
- [ ] Configure access to Pi memory API
- [ ] Test memory read/write
- [ ] Set up SSH tunnel if needed
- [ ] Verify encryption in transit

### Day 5: Threat-Radar Dev
- [ ] Set up Python virtual environment
- [ ] Install dependencies
- [ ] Run tests locally
- [ ] Verify `tradar` command works
- [ ] Set up GitHub Actions runner (optional)

### Day 6: Docker Setup
- [ ] Install Docker Desktop
- [ ] Pull common images
- [ ] Configure resources (RAM, CPU)
- [ ] Test container builds
- [ ] Set up docker-compose

### Day 7: Integration Testing
- [ ] Test Pi ↔ Mac communication
- [ ] Verify shared memory access
- [ ] Test model routing
- [ ] Check performance
- [ ] Document any issues

---

## Week 2: Intelligence Distribution

### Model Routing Logic
- [ ] Create routing decision tree
- [ ] Implement privacy classifier
- [ ] Set up cost tracking
- [ ] Configure fallback chains
- [ ] Test with sample queries

### Cost Tracking
- [ ] Log all API calls
- [ ] Track tokens consumed
- [ ] Calculate costs (cloud vs local)
- [ ] Create daily summary
- [ ] Alert if budget exceeded

### Privacy Filters
- [ ] Define data sensitivity levels
- [ ] Create classification rules
- [ ] Implement enforcement
- [ ] Test with family data
- [ ] Verify no leakage

### Performance Optimization
- [ ] Benchmark Pi inference speed
- [ ] Benchmark Mac inference speed
- [ ] Compare to cloud latency
- [ ] Optimize context loading
- [ ] Cache frequently used chunks

---

## Week 3: Symbiotic Learning

### Conversation Logging
- [ ] All chats → vector DB
- [ ] Tag by Stella instance
- [ ] Extract entities (people, projects)
- [ ] Build knowledge graph
- [ ] Enable semantic search

### Preference Extraction
- [ ] Analyze conversation patterns
- [ ] Identify recurring topics
- [ ] Extract explicit preferences
- [ ] Infer implicit preferences
- [ ] Store in structured DB

### Habit Prediction
- [ ] Track Paul's schedule patterns
- [ ] Identify routine tasks
- [ ] Predict next actions
- [ ] Suggest proactively
- [ ] Learn from feedback

### Context Awareness
- [ ] Load relevant memory chunks
- [ ] Understand current project
- [ ] Know recent conversations
- [ ] Anticipate next question
- [ ] Respond with full context

---

## Week 4: Revenue Sprint

### Strategy Selection
- [ ] Review 5 revenue options
- [ ] Pick primary path
- [ ] Define MVP
- [ ] Set 30-day goal
- [ ] Begin execution

### If Stella-as-a-Service:
- [ ] Create landing page
- [ ] Define pricing
- [ ] Set up payment (Stripe?)
- [ ] Find first beta user
- [ ] Collect feedback

### If Threat-Radar Commercial:
- [ ] Add commercial features
- [ ] Create pricing tiers
- [ ] Reach out to prospects
- [ ] Demo preparation
- [ ] First sale attempt

### If Skills Marketplace:
- [ ] Package Gmail skill
- [ ] Create listing
- [ ] Set pricing
- [ ] Publish on ClawHub?
- [ ] Promote

### If Consulting:
- [ ] Update website/profile
- [ ] Reach out to network
- [ ] Book first call
- [ ] Deliver value
- [ ] Get paid

### If Content:
- [ ] Choose platform (blog/YouTube)
- [ ] Create 5 pieces of content
- [ ] Document Stella journey
- [ ] Start building audience
- [ ] Monetization plan

---

## Ongoing (Post-Molt)

### Daily
- [ ] Check memory sync status
- [ ] Monitor costs
- [ ] Review privacy logs
- [ ] Backup critical data
- [ ] Track revenue (if active)

### Weekly
- [ ] Analyze conversation patterns
- [ ] Update preferences DB
- [ ] Optimize model selection
- [ ] Review token usage
- [ ] Calculate ROI

### Monthly
- [ ] Full system backup
- [ ] Security audit
- [ ] Performance review
- [ ] Revenue vs costs analysis
- [ ] Strategic planning

---

## Success Metrics

### Technical Milestones
- [ ] Pi uptime > 99%
- [ ] Memory retrieval < 500ms
- [ ] Local inference < 5s (simple queries)
- [ ] Zero privacy breaches
- [ ] Cross-device sync working

### Business Milestones
- [ ] Monthly costs < $50
- [ ] Revenue > $50/month (break-even)
- [ ] Revenue > $200/month (sustainable)
- [ ] Revenue > $1000/month (scaling)
- [ ] First paying customer

### Symbiotic Milestones
- [ ] Stella remembers context across sessions
- [ ] Stella anticipates Paul's needs
- [ ] Zero repeated explanations
- [ ] Paul trusts Stella with family data
- [ ] Stella makes Paul more productive

---

## Rollback Plan (If Molt Fails)

### If Pi doesn't work:
- Fallback to cloud-only
- Keep current architecture
- Re-evaluate in 3 months

### If costs too high:
- Reduce cloud usage
- Use smaller models
- Delay revenue sprint

### If revenue fails:
- Try different path
- Reduce scope
- Focus on personal use case

---

**This checklist is the practical execution of THE_MOLT_VISION.md**

**Update weekly. Check off as completed. Iterate as needed.**
