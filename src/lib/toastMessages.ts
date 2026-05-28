/** All toast copy in English — single source of truth. */

export type ToastCopy = { title: string; message: string };

export const TOAST = {
  common: {
    missingFields: { title: "Missing information", message: "Fill in all required fields." } satisfies ToastCopy,
    requestFailed: {
      title: "Request failed",
      message: "Something went wrong. Try again or contact support.",
    } satisfies ToastCopy,
    sessionExpired: {
      title: "Session expired",
      message: "Sign in again and retry.",
    } satisfies ToastCopy,
    accessDenied: { title: "Access denied", message: "You do not have permission for this action." } satisfies ToastCopy,
    invalidPassword: { title: "Invalid password", message: "The password you entered is incorrect." } satisfies ToastCopy,
    passwordRequired: {
      title: "Password required",
      message: "Enter your password to confirm this action.",
    } satisfies ToastCopy,
  },
  inventory: {
    itemCreated: {
      title: "Item added",
      message: "The inventory item was saved successfully.",
    } satisfies ToastCopy,
    itemDisabled: (id: number) => ({
      title: "Item deactivated",
      message: `Item #${id} was removed from active stock.`,
    }),
    itemEnabled: (id: number) => ({
      title: "Item activated",
      message: `Item #${id} is active again.`,
    }),
    createFailed: { title: "Could not add item", message: "" },
    disableFailed: { title: "Could not deactivate", message: "" },
    enableFailed: { title: "Could not activate", message: "" },
    movementMissing: {
      title: "Missing information",
      message: "Select an item, enter a quantity, and provide a reason.",
    } satisfies ToastCopy,
    movementPosted: {
      title: "Movement recorded",
      message: "Stock movement was saved successfully.",
    } satisfies ToastCopy,
    movementFailed: { title: "Movement failed", message: "" },
  },
  production: {
    started: {
      title: "Production started",
      message: "Materials were consumed and production is in progress.",
    } satisfies ToastCopy,
    startFailed: { title: "Could not start", message: "" },
    finished: {
      title: "Production finished",
      message: "The batch was sent to quality inspection.",
    } satisfies ToastCopy,
    finishFailed: { title: "Could not finish", message: "" },
    cancelled: (id: number) => ({
      title: "Order cancelled",
      message: `Production order PO-${id} was cancelled.`,
    }),
    cancelFailed: { title: "Could not cancel", message: "" },
    reworkStarted: {
      title: "Rework started",
      message: "The order was sent back to production.",
    } satisfies ToastCopy,
    reworkFailed: { title: "Rework failed", message: "" },
    paused: (id: number) => ({
      title: "Production paused",
      message: `Order PO-${id} is on hold.`,
    }),
    pauseFailed: { title: "Could not pause", message: "" },
    resumed: (id: number) => ({
      title: "Production resumed",
      message: `Order PO-${id} is running again.`,
    }),
    resumeFailed: { title: "Could not resume", message: "" },
    createMissing: {
      title: "Missing information",
      message: "Assign a recipe and an operator before creating the order.",
    } satisfies ToastCopy,
    created: {
      title: "Order created",
      message: "Production order was created successfully.",
    } satisfies ToastCopy,
    createFailed: { title: "Could not create order", message: "" },
  },
  orders: {
    missingFields: {
      title: "Missing information",
      message: "Select a recipe and an operator.",
    } satisfies ToastCopy,
    created: {
      title: "Order created",
      message: "Production order was created successfully.",
    } satisfies ToastCopy,
    createFailed: { title: "Could not create order", message: "" },
    cancelled: (id: number) => ({
      title: "Order cancelled",
      message: `Production order PO-${id} was cancelled.`,
    }),
    cancelFailed: { title: "Could not cancel", message: "" },
    queueSyncFailed: { title: "Queue update failed", message: "" },
  },
  recipes: {
    createMissing: {
      title: "Invalid recipe",
      message: "Cycle time must be greater than zero.",
    } satisfies ToastCopy,
    ingredientsInvalid: {
      title: "Invalid materials",
      message: "Each material needs a valid item and a positive quantity.",
    } satisfies ToastCopy,
    created: {
      title: "Recipe saved",
      message: "The production recipe was created successfully.",
    } satisfies ToastCopy,
    createFailed: { title: "Could not save recipe", message: "" },
    updateInvalid: {
      title: "Invalid values",
      message: "Cycle time and quantities must be positive.",
    } satisfies ToastCopy,
    updated: {
      title: "Recipe updated",
      message: "Changes were saved successfully.",
    } satisfies ToastCopy,
    updateFailed: { title: "Could not update recipe", message: "" },
    archived: {
      title: "Recipe archived",
      message: "This recipe is no longer available for new orders.",
    } satisfies ToastCopy,
    archiveFailed: { title: "Could not archive recipe", message: "" },
  },
  users: {
    updated: {
      title: "User updated",
      message: "User details were saved successfully.",
    } satisfies ToastCopy,
    updateFailed: { title: "Could not update user", message: "" },
    suspended: {
      title: "User suspended",
      message: "The user account was deactivated.",
    } satisfies ToastCopy,
    suspendFailed: { title: "Could not suspend user", message: "" },
    created: {
      title: "User created",
      message: "The new user was registered successfully.",
    } satisfies ToastCopy,
    createFailed: { title: "Could not create user", message: "" },
  },
  quality: {
    approved: (id: number) => ({
      title: "Inspection approved",
      message: `Order PO-${id} was released to logistics.`,
    }),
    flagged: (id: number, status: string) => ({
      title: "Inspection recorded",
      message: `Order PO-${id} was marked as ${status}.`,
    }),
    submitFailed: { title: "Inspection failed", message: "" },
  },
  integration: {
    created: {
      title: "API key created",
      message: "Copy the key now — it will not be shown again in full.",
    } satisfies ToastCopy,
    createFailed: { title: "Could not create API key", message: "" },
    revoked: {
      title: "API key revoked",
      message: "External systems using this key will lose access.",
    } satisfies ToastCopy,
    revokeFailed: { title: "Could not revoke API key", message: "" },
    copied: {
      title: "Copied",
      message: "API key copied to clipboard.",
    } satisfies ToastCopy,
    copyFailed: {
      title: "Copy failed",
      message: "Select and copy the key manually.",
    } satisfies ToastCopy,
  },
  notifications: {
    privateDefault: {
      title: "New notification",
      message: "You have a new message.",
    } satisfies ToastCopy,
    roleDefault: (role: string) => ({
      title: `Alert: ${role}`,
      message: "Review the notification details.",
    }),
  },
} as const;

export function showToast(
  fn: (title: string, message?: string) => void,
  copy: ToastCopy
): void {
  fn(copy.title, copy.message);
}
