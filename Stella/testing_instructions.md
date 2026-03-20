# Testing Instructions for Issue #123 - CLI Command Rename

**PR**: https://github.com/Threat-Radar/tr/pull/124  
**Branch**: `feature/cli-rename-tr`  
**Issue**: #123

## Quick Summary
Changed the primary CLI command from `threat-radar` to `tr` while maintaining full backward compatibility. All documentation has been updated with the new command.

## Testing Steps

### 1. Download and Setup
```bash
# Clone the repository (if not already done)
git clone https://github.com/Threat-Radar/tr.git
cd tr

# Fetch and checkout the feature branch
git fetch origin
git checkout feature/cli-rename-tr

# Install in development mode (creates both commands)
pip install -e .
```

### 2. Verify Both Commands Work
```bash
# Run the automated test script
./test_cli_aliases.sh

# This will verify:
# - Both 'tr' and 'threat-radar' commands exist
# - Both show identical help output
# - Both commands work correctly
```

### 3. Manual Testing
```bash
# Test version output
tr --version
threat-radar --version

# Test help output (should be identical)
tr --help
threat-radar --help

# Test subcommands
tr cve --help
threat-radar cve --help

tr sbom --help
threat-radar sbom --help

# Test actual scanning (requires Docker and Grype)
tr cve scan-image alpine:3.18
threat-radar cve scan-image alpine:3.18
```

### 4. Test SBOM Generation
```bash
# Using new 'tr' command
tr sbom docker alpine:3.18 -o test-sbom.json

# Using old 'threat-radar' command (should work identically)
threat-radar sbom docker alpine:3.18 -o test-sbom2.json

# Compare the outputs (should be similar)
ls -lh test-sbom*.json
```

### 5. Verify Documentation Updates
```bash
# Check that README uses 'tr' in examples
grep "^tr " README.md | head -5

# Check that pyproject.toml has correct configuration
grep -A2 "\[project.scripts\]" pyproject.toml
# Should show:
# tr = "threat_radar.cli.__main__:main"
# threat-radar = "threat_radar.cli.__main__:main"
```

## Expected Results

### ✅ Success Criteria
1. Both `tr` and `threat-radar` commands are available
2. Both commands produce identical output
3. All functionality works with both commands
4. Documentation primarily shows `tr` examples
5. No breaking changes - existing scripts using `threat-radar` still work
6. Test script (`./test_cli_aliases.sh`) passes all checks

### ❌ Failure Indicators
- Only one command works
- Commands produce different output
- Any functionality broken
- Import errors or installation issues

## What Changed?

### Code Changes (pyproject.toml)
```toml
# BEFORE:
[project.scripts]
threat-radar = "threat_radar.cli.__main__:main"
tradar = "threat_radar.cli.__main__:main"

# AFTER:
[project.scripts]
tr = "threat_radar.cli.__main__:main"
threat-radar = "threat_radar.cli.__main__:main"
```

### Documentation Changes
All command examples updated from:
```bash
threat-radar cve scan-image alpine:3.18
```

To:
```bash
tr cve scan-image alpine:3.18
```

### Files Updated
- `pyproject.toml` - Command configuration
- `README.md` - Main documentation
- All files in `docs/` directory
- Shell scripts in `docker/` directory
- GitHub workflows in `.github/workflows/`
- Python docstrings and examples
- Added `test_cli_aliases.sh` test script

## Backward Compatibility

**No action required for existing users!**

- Old scripts using `threat-radar` continue to work
- Both commands are functionally identical
- No breaking changes
- Gradual migration encouraged but not required

## Questions or Issues?

If you encounter any problems:
1. Check that you're on the `feature/cli-rename-tr` branch
2. Reinstall with `pip install -e .`
3. Run the test script: `./test_cli_aliases.sh`
4. Check the PR for additional context: https://github.com/Threat-Radar/tr/pull/124

## Approval Checklist for Paul

- [ ] Both commands (`tr` and `threat-radar`) work correctly
- [ ] Test script passes (`./test_cli_aliases.sh`)
- [ ] Can perform actual scans with both commands
- [ ] Documentation looks good (examples use `tr`)
- [ ] No breaking changes to existing workflows
- [ ] Ready to merge to main branch

---

**Status**: Ready for testing ✅  
**Breaking Changes**: None ❌  
**Backward Compatible**: Yes ✅
