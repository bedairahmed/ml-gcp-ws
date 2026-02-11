# Workshop Scripts

Helper scripts for the Cloud Engineering Workshop.

## Setup

```bash
chmod +x scripts/*.sh
```

## Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `setup.sh` | Install prerequisites & configure environment | Start of workshop |
| `validate.sh` | Verify all labs completed successfully | After each lab or at the end |
| `cleanup.sh` | Tear down all GCP resources | End of workshop |

## Usage

```bash
# Initial setup
./scripts/setup.sh

# Validate progress (checks all labs)
./scripts/validate.sh yourname

# Clean up resources
./scripts/cleanup.sh yourname
```
