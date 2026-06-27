# Custom models

Place editable model code here. Register entries in `experiments/*.yaml` via:

```yaml
model:
  entry: models.custom.my_net:build
  kwargs: { base_arch: dual, use_film: true }
```

Phase 1 uses **mock mode** — files here are for layout preview until Phase 4 live training.

## Example stub

See `example_model.py` for a minimal build function signature.
