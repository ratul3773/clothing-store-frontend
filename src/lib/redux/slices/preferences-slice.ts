import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PreferencesState {
  wishlist: string[];
  recentSearches: string[];
}

const initialState: PreferencesState = {
  wishlist: [
    "classic-oxford-shirt",
    "pleated-wool-blend-trouser",
    "selvedge-straight-jean",
  ],
  recentSearches: ["linen shirt", "navy chino"],
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const slug = action.payload;
      state.wishlist = state.wishlist.includes(slug)
        ? state.wishlist.filter((s) => s !== slug)
        : [slug, ...state.wishlist];
    },
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.wishlist.includes(action.payload))
        state.wishlist.unshift(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.wishlist = state.wishlist.filter((s) => s !== action.payload);
    },
    addRecentSearch(state, action: PayloadAction<string>) {
      const term = action.payload.trim().toLowerCase();
      if (!term) return;
      state.recentSearches = [
        term,
        ...state.recentSearches.filter((t) => t !== term),
      ].slice(0, 5);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
  },
});

export const {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  addRecentSearch,
  clearRecentSearches,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
