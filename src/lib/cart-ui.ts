export const OPEN_CART_EVENT = "mohallah:open-bag";

export function openCartDrawer() {
  window.dispatchEvent(new Event(OPEN_CART_EVENT));
}
