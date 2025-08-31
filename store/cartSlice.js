import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      const quantityToAdd = item.quantity || 1;

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        state.items.push({
          ...item,
          quantity: quantityToAdd,
          total: item.price * quantityToAdd,
          addOns: [],
        });
      }
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      state.items = state.items.filter((i) => i.id !== item);
    },
    updateCart: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((i) => i.id === id);
      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity = quantity;
          existingItem.total = quantity * existingItem.price;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    addAddOns: (state, action) => {
      const { productId, item } = action.payload;
      console.log(productId, item);
      const existingItem = state.items.find((z) => z.id === productId);

      if (existingItem) {
        const checkItem = existingItem.addOns.find(
          (addOn) => addOn.id === item.id
        );
        if (!checkItem) {
          existingItem.addOns.push(item);
          existingItem.total += Number(item.price);
        }
      }
    },
    removeAddOns: (state, action) => {
      const { productId, itemId } = action.payload;

      const existingItem = state.items.find((z) => z.id === productId);

      if (existingItem && existingItem.addOns) {
        const index = existingItem.addOns.findIndex(
          (addOn) => addOn.id === itemId
        );

        if (index !== -1) {
          const removedAddOn = existingItem.addOns[index];
          existingItem.addOns.splice(index, 1);
          existingItem.total -= Number(removedAddOn.price) || 0; // Ensure price subtraction
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCart,
  addAddOns,
  removeAddOns,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
