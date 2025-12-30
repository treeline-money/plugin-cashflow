# Cash Flow Plugin

A Treeline plugin for planning your future balance by scheduling expected income and expenses.

## Key Files

| File | Purpose |
|------|---------|
| `manifest.json` | Plugin metadata (id: "cashflow") |
| `src/index.ts` | Plugin entry point |
| `src/CashflowView.svelte` | Main UI component |
| `package.json` | Dependencies (includes `@treeline-money/plugin-sdk`) |

## Quick Commands

```bash
npm install          # Install dependencies
npm run build        # Build to dist/index.js
npm run dev          # Watch mode
tl plugin install .  # Install locally for testing
```

## Plugin Data

This plugin stores scheduled items in `sys_plugin_cashflow_items` table:

```sql
CREATE TABLE IF NOT EXISTS sys_plugin_cashflow_items (
  id VARCHAR PRIMARY KEY,
  series_id VARCHAR,              -- groups recurring items in a series
  description VARCHAR NOT NULL,
  amount DECIMAL(12,2) NOT NULL,  -- positive for income, negative for expenses
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

Note: Recurring patterns are stored as multiple individual items with the same `series_id`. The plugin auto-detects patterns from transaction history and creates series.

## SDK Import

All types are imported from the npm package:

```typescript
import type { Plugin, PluginContext, PluginSDK } from "@treeline-money/plugin-sdk";
```

Views receive `sdk` via props:

```svelte
<script lang="ts">
  import type { PluginSDK } from "@treeline-money/plugin-sdk";

  interface Props {
    sdk: PluginSDK;
  }
  let { sdk }: Props = $props();
</script>
```

## SDK Quick Reference

| Method | What it does |
|--------|--------------|
| `sdk.query(sql)` | Read data |
| `sdk.execute(sql)` | Write to sys_plugin_cashflow_items |
| `sdk.toast.success/error/info(msg)` | Show notifications |
| `sdk.openView(viewId, props?)` | Navigate to another view |
| `sdk.onDataRefresh(callback)` | React when data changes |
| `sdk.emitDataRefresh()` | Notify other views data changed |
| `sdk.theme.current()` | Get "light" or "dark" |
| `sdk.settings.get/set()` | Persist settings |
| `sdk.currency.format(amount)` | Format as currency |

## Releasing

```bash
./scripts/release.sh 0.1.0   # Tags and pushes, GitHub Action creates release
```

## Full Documentation

See https://github.com/treeline-money/treeline
