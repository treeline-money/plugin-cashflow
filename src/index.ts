import type { Plugin, PluginContext, PluginSDK } from "@treeline-money/plugin-sdk";
import CashflowView from "./CashflowView.svelte";
import { mount, unmount } from "svelte";

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
