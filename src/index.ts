import type { Plugin, PluginContext, PluginSDK, PluginMigration } from "@treeline-money/plugin-sdk";
import CashflowView from "./CashflowView.svelte";
import { mount, unmount } from "svelte";

// Database migrations - run in order by version when plugin loads
const migrations: PluginMigration[] = [
  {
    version: 1,
    name: "create_scheduled_table",
    up: `
      CREATE TABLE IF NOT EXISTS plugin_cashflow.scheduled (
        id VARCHAR PRIMARY KEY,
        series_id VARCHAR,
        description VARCHAR NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_cashflow_items_date
        ON plugin_cashflow.scheduled(date);
      CREATE INDEX IF NOT EXISTS idx_cashflow_items_series
        ON plugin_cashflow.scheduled(series_id)
    `,
  },
];

export const plugin: Plugin = {
  manifest: {
    id: "cashflow",
    name: "Cash Flow",
    version: "0.1.0",
    description: "Plan your future balance by scheduling expected income and expenses",
    author: "Treeline",
    permissions: {
      read: ["transactions", "accounts", "balance_snapshots"],
      schemaName: "plugin_cashflow",
    },
  },

  migrations,

  activate(context: PluginContext) {
    console.log("Cash Flow plugin activated!");

    // Register the view
    context.registerView({
      id: "cashflow-view",
      name: "Cash Flow",
      icon: "activity",
      mount: (target: HTMLElement, props: { sdk: PluginSDK }) => {
        const instance = mount(CashflowView, {
          target,
          props,
        });

        return () => {
          unmount(instance);
        };
      },
    });

    // Add sidebar item
    context.registerSidebarItem({
      sectionId: "main",
      id: "cashflow",
      label: "Cash Flow",
      icon: "activity",
      viewId: "cashflow-view",
    });

    console.log("✓ Cash Flow plugin registered");
  },

  deactivate() {
    console.log("Cash Flow plugin deactivated");
  },
};
