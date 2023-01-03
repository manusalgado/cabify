/**
 * Attention, do you like Typescript?
 * Just rename this file from .js to .ts and enjoy Type Safety.
 */

import { Checkout } from "./Checkout";

describe("Checkout", () => {
  let checkout;

  beforeEach(() => {
    checkout = new Checkout();
  });

  it("should initialize", () => {
    expect(checkout).toBeInstanceOf(Checkout);
  });

  it("should modify the items object and the total", () => {
    
    expect(checkout.scan('X7R2OPX')
      .scan('X2G2OPZ')
      .scan('X3W2OPY')
      .scan('X3W2OPY:')
      .scan('This')
      .total()
    ).toStrictEqual(35);
  });

  it("should scan eith quantity", () => {
    
    expect(checkout
      .scan('X7R2OPX', 2)
      .totalGross()
    ).toBe(40);
  });
  
  it("should validate the item", () => {
    expect(checkout.validateItemId('X7R2OPX')).toBe(true);
    expect(checkout.validateItemId('X2G2OPZ')).toBe(true);
    expect(checkout.validateItemId('X3W2OPY')).toBe(true);
    expect(checkout.validateItemId('Anything')).toBe(false);
    expect(checkout.validateItemId('')).toBe(false);
    expect(checkout.validateItemId()).toBe(false);
  });
  
  it("should no t perform discount", () => {
    checkout.scan('X7R2OPX')
    checkout.scan('X7R2OPX')
    checkout.scan('X2G2OPZ')
    checkout.scan('X3W2OPY')
    expect(checkout.total()).toBe(55);
  });

  it("should not apply discount without params", () => {
    const checkout = new Checkout({
      'X2G2OPZ': { promotionName: 'two-for-one' },
    });
    checkout
      .scan('X2G2OPZ')
      .scan('X2G2OPZ')
      .scan('X2G2OPZ')
      .scan('X3W2OPY')
    expect(checkout.totalDiscount()).toBe(0);
  });

  it("should apply discount", () => {
    const checkout = new Checkout({
      'X2G2OPZ': { promotionName: 'two-for-one', params: { giveAwayOneItemForEvery: 2 } },
    });
    checkout
      .scan('X2G2OPZ') // 1st 0 Discount
      .scan('X2G2OPZ') // 2nd 5 Eur Discount
      .scan('X2G2OPZ') // 3th 0 Euros
      .scan('X3W2OPY') // No promotion 0 Discount
    expect(checkout.totalDiscount()).toBe(5);
  });

  it("should apply bulk discount", () => {
    const checkout = new Checkout({
      'X2G2OPZ': {
        promotionName: 'bulk-discounts',
        params: {
          percentage: 5,
          fromNumberAhead: 3
        }
      },
    });
    checkout
      .scan('X2G2OPZ') // 5 Eur
      .scan('X2G2OPZ') // 5 Eur
      .scan('X2G2OPZ') // 5 Eur
      .scan('X2G2OPZ') // 5 Eur
      .scan('X2G2OPZ') // 5 Eur
      .scan('X3W2OPY') // 10 Eur
    expect(checkout.totalDiscount()).toBe(1.25);
  });

  it("should apply bulk discount to shirts", () => {
    const checkout = new Checkout({
      'X7R2OPX': {
        promotionName: 'bulk-discounts',
        params: {
          percentage: 5,
          fromNumberAhead: 3
        }
      },
    });
    checkout
      .scan('X7R2OPX') // 20 Eur
      .scan('X7R2OPX') // 20 Eur
      .scan('X7R2OPX') // 20 Eur
      .scan('X7R2OPX') // 20 Eur
      .scan('X7R2OPX') // 20 Eur
    expect(checkout.totalDiscount()).toBe(5);
  });

  it("should not apply bulk discount to shirts", () => {
    const checkout = new Checkout({
      'X7R2OPX': {
        promotionName: 'bulk-discounts',
        params: {
          percentage: 5,
          fromNumberAhead: 3
        }
      },
    });
    checkout
      .scan('X7R2OPX') // 20 Eur -0%  0 Eur Discount
      .scan('X7R2OPX') // 20 Eur -0%  0 Eur Discount
                       // --------------------------
                       // Total:      0 Eur Discount
                       // * Only two units
    expect(checkout.totalDiscount()).toBe(0);
  });

  it("should apply requested rules to shirts and mugs", () => {
    const checkout = new Checkout({
      'X7R2OPX': {
        promotionName: 'bulk-discounts',
        params: {
          percentage: 5,
          fromNumberAhead: 3
        }
      },
      'X2G2OPZ': { promotionName: 'two-for-one', params: { giveAwayOneItemForEvery: 2 } },
    });
    checkout
      .scan('X7R2OPX') // 20 Eur -5%  1 Eur Discount
      .scan('X7R2OPX') // 20 Eur -5%  1 Eur Discount
      .scan('X7R2OPX') // 20 Eur -5%  1 Eur Discount
      .scan('X2G2OPZ') // 5 Eur -0%   0 Eur Discount
      .scan('X2G2OPZ') // 5 Eur -100% 5 Eur Discount
                       // --------------------------
                       // Total:      8 Eur Discount
    expect(checkout.totalDiscount()).toBe(8);
  });

  it("should perform discount", () => {
    const checkout = new Checkout({
      'X7R2OPX': {
        promotionName: 'bulk-discounts',
        params: {
          percentage: 5,
          fromNumberAhead: 3
        }
      },
      'X2G2OPZ': { promotionName: 'two-for-one', params: { giveAwayOneItemForEvery: 2 } },
    });
    checkout
      .scan('X7R2OPX') // 20 Eur -5%        20 Eur
      .scan('X7R2OPX') // 20 Eur -5%        20 Eur
      .scan('X7R2OPX') // 20 Eur -5%        20 Eur
      .scan('X2G2OPZ') // 5 Eur -0%         5 Eur
      .scan('X2G2OPZ') // 5 Eur -100%       5 Eur
                       // Minus discount:   8 Eur
                       // --------------------------
                       // Total:            62 Eur
    expect(checkout.total()).toBe(62);
  });

});
