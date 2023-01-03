import { Checkout, BULK_DISCOUNT, TWO_FOR_ONE } from "./Checkout";

// You can set up the discounts from a 
// data base, cms, admin or other origins
const PRICING_RULES = {
  'X7R2OPX': {
    promotionName: BULK_DISCOUNT,
    params: {
      percentage: 5,
      fromNumberAhead: 3
    }
  },
  'X2G2OPZ': {
    promotionName: TWO_FOR_ONE,
      params: {
        giveAwayOneItemForEvery: 2
      }
    },
};

export function getCheckout() {
  return { checkout: new Checkout(PRICING_RULES) };
}
