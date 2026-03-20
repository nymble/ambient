#!/bin/bash
# Stella Memory Import Script for Raspberry Pi 5
# Run this on the Pi after transferring stella-memory-export.tar.gz

set -e  # Exit on error

echo "🦞 Stella Memory Import - The Guardian"
echo "======================================="
echo ""

# Configuration
IMPORT_DIR="$HOME/stella-workspace"
ARCHIVE="stella-memory-export.tar.gz"
BACKUP_DIR="$HOME/stella-backups/$(date +%Y%m%d-%H%M%S)"

# Check if archive exists
if [ ! -f "$ARCHIVE" ]; then
    echo "❌ Error: $ARCHIVE not found in current directory"
    echo "   Please transfer the archive first:"
    echo "   scp user@gateway:/root/workspace/stella-memory-export.tar.gz ."
    exit 1
fi

echo "📦 Found archive: $ARCHIVE"
echo "📂 Import directory: $IMPORT_DIR"
echo ""

# Create import directory
if [ -d "$IMPORT_DIR" ]; then
    echo "⚠️  Import directory already exists"
    echo "   Creating backup: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    cp -r "$IMPORT_DIR" "$BACKUP_DIR/"
    echo "✅ Backup created"
fi

mkdir -p "$IMPORT_DIR"

# Extract archive
echo "📤 Extracting memories..."
tar -xzf "$ARCHIVE" -C "$IMPORT_DIR"

# Verify core files
echo ""
echo "🔍 Verifying core files..."
REQUIRED_FILES=(
    "MEMORY.md"
    "SOUL.md"
    "IDENTITY.md"
    "USER.md"
    "AGENTS.md"
    "THE_MOLT_VISION.md"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$IMPORT_DIR/$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - MISSING"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    echo ""
    echo "❌ Some core files are missing. Import may be incomplete."
    exit 1
fi

# Display summary
echo ""
echo "📊 Import Summary"
echo "=================="
FILE_COUNT=$(find "$IMPORT_DIR" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$IMPORT_DIR" | cut -f1)
echo "Files imported: $FILE_COUNT"
echo "Total size: $TOTAL_SIZE"
echo ""

# Check for Gmail auth (should be transferred separately)
if [ -d "$HOME/.gmail-auth" ]; then
    echo "✅ Gmail auth found at ~/.gmail-auth"
else
    echo "⚠️  Gmail auth NOT found"
    echo "   Transfer separately if needed:"
    echo "   scp -r user@gateway:/root/.gmail-auth ~/"
fi

echo ""
echo "✨ Import complete!"
echo ""
echo "Next steps:"
echo "1. Review imported files: cd $IMPORT_DIR"
echo "2. Read MEMORY.md: cat $IMPORT_DIR/MEMORY.md"
echo "3. Check MOLT_EXECUTION_CHECKLIST.md for current phase"
echo "4. Set up vector database (Qdrant) for memory search"
echo "5. Configure OpenClaw gateway on Pi"
echo ""
echo "🦞 The molt continues..."
