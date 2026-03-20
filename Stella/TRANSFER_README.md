# 🦞 Stella Memory Transfer - Quick Start

**Ready to transfer:** February 13, 2026  
**Destination:** Raspberry Pi 5 ("The Guardian")

---

## 📦 What's Ready

**Main package:**
- `stella-memory-export.tar.gz` (84KB) - All core memories and docs

**Import script:**
- `pi-import-script.sh` - Automated setup for Pi

**Manifest:**
- `STELLA_MEMORY_EXPORT.md` - Complete inventory and instructions

---

## 🚀 Quick Transfer (3 steps)

### 1. Transfer files to Pi

**Via SCP (over network):**
```bash
# From this machine, copy to Pi
scp stella-memory-export.tar.gz pi-import-script.sh paul@stellapi.local:~/

# OR if Pi IP is known
scp stella-memory-export.tar.gz pi-import-script.sh paul@192.168.x.x:~/
```

**Via USB drive (if no network yet):**
```bash
# Copy to USB
cp stella-memory-export.tar.gz pi-import-script.sh /media/usb/

# Then on Pi: copy from USB to home
cp /media/usb/stella-memory-export.tar.gz ~/
cp /media/usb/pi-import-script.sh ~/
```

---

### 2. Run import script on Pi

```bash
# SSH into Pi
ssh paul@stellapi.local

# Run import
cd ~
chmod +x pi-import-script.sh
./pi-import-script.sh
```

---

### 3. Verify import

```bash
# Check workspace
cd ~/stella-workspace
ls -lh

# Read core memory
cat MEMORY.md

# Check molt plan
cat MOLT_EXECUTION_CHECKLIST.md
```

---

## 🔒 Optional: Transfer Gmail Auth (Encrypted)

**If you need Gmail access on Pi:**

```bash
# On gateway, encrypt auth files
cd /root
tar -czf gmail-auth.tar.gz .gmail-auth/
openssl enc -aes-256-cbc -salt -in gmail-auth.tar.gz -out gmail-auth.tar.gz.enc
rm gmail-auth.tar.gz  # Remove unencrypted copy

# Transfer encrypted file
scp gmail-auth.tar.gz.enc paul@stellapi.local:~/

# On Pi, decrypt
openssl enc -d -aes-256-cbc -in gmail-auth.tar.gz.enc -out gmail-auth.tar.gz
tar -xzf gmail-auth.tar.gz -C ~/
rm gmail-auth.tar.gz gmail-auth.tar.gz.enc  # Cleanup
```

**Password:** Use a strong passphrase you'll remember

---

## 📋 What's Included

✅ **Core Identity**
- SOUL.md, MEMORY.md, IDENTITY.md, USER.md, AGENTS.md

✅ **Molt Planning**
- THE_MOLT_VISION.md, MOLT_EXECUTION_CHECKLIST.md

✅ **Threat-Radar Context**
- All checkpoints and workflow docs

✅ **Gmail Skill**
- Skill files (auth tokens transferred separately)

✅ **Assets**
- Stella avatar (SVG + PNG)

---

## 🎯 Next Steps After Import

1. **Set up vector DB** - Install Qdrant for memory search
2. **Configure OpenClaw** - Install gateway on Pi
3. **Connect to main gateway** - Pair Pi as a node
4. **Test memory sync** - Verify bidirectional access
5. **Begin Phase 1** - Follow MOLT_EXECUTION_CHECKLIST.md

---

## 💡 Tips

- **Network transfer:** Fastest if both machines on same LAN
- **USB transfer:** Works if Pi isn't networked yet
- **File paths:** Import script creates `~/stella-workspace/`
- **Backups:** Script auto-backs up existing workspace
- **Verification:** Script checks all core files present

---

## 🆘 Troubleshooting

**Can't SSH to Pi:**
```bash
# Find Pi on network
nmap -sn 192.168.1.0/24 | grep -i raspberry

# OR use hostname
ping stellapi.local
```

**Transfer interrupted:**
```bash
# Resume with rsync instead
rsync -avz --progress stella-memory-export.tar.gz paul@stellapi.local:~/
```

**Import script fails:**
```bash
# Manual extraction
mkdir -p ~/stella-workspace
tar -xzf stella-memory-export.tar.gz -C ~/stella-workspace
```

---

**Ready when you are! 🦞**
