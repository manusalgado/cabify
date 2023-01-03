/**
 * Attention, do you like Typescript?
 * Just rename this file from .js to .ts and enjoy Type Safety.
 */

import { TwoForOneDiscount } from "./discount-rules/TwoForOneDiscount";
import { BulkDiscount } from "./discount-rules/BulkDiscount";

import db from "./data/data.json";
const ALL_PRODUCTS = db.products;

export const BULK_DISCOUNT = 'bulk-discounts';
export const TWO_FOR_ONE = 'two-for-one';

interface IScanedQuantity {
  [key: string]: number
};

interface IPricingClassesMap {
  // This values will be dinamyc, 
  [key: string]: typeof TwoForOneDiscount | typeof BulkDiscount
};

interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  total?: number;
  totalDiscount?: number;
}

interface IProducDetails {
  [key: string]: IProduct
}

interface IPricingRules {
  [key: string]: { promotionName: string; params: any}
}

interface ICheckout {
  /**
   * Scans a product adding it to the current cart.
   * @param code The product identifier
   * @returns itself to allow function chaining
   */
  scan(code: string, quantity: any): this;

  /**
   * Returns the value of all cart products with the discounts applied.
   */
  total(): number;

  /**
   * @description Calculates and return the discount to apply to all the purcharse
   * @returns The discount for all the purcharse
   */
  totalDiscount(): number;

  /**
   * @description Validates the scaned code to exists in the db
   * @returns Boolean
  */
  validateItemId(code: string): boolean;
}
  
export class Checkout implements ICheckout {
  /** @private This is to save the quantities scaned */
  private scanedQuantity: IScanedQuantity = {}

  /** @private Saves all the product details */
  private producDetails: IProducDetails = {}

  /** @private Saves discount rules  */
  private pricingRules: IPricingRules = {}

  /** @private Keep the currently implemented type of validations */
  private pricingClassesMap: IPricingClassesMap = {
    [TWO_FOR_ONE]: TwoForOneDiscount,
    [BULK_DISCOUNT]: BulkDiscount,
  }

  /**
   * @description Gets the pricing rules for discounts
   *   Discount rules are 100% configurables, and you can save the settings in a db
   *   or a repo eventually
   * @param pricingRules Object with the rules that will determine the discounts.
   * 
   * @example
   *   const checkout = new Checkout({
   *   // Appllies the 5% discount when there are more than 2 items with id X7R2OPX
   *   'X7R2OPX': {
   *     promotionName: 'bulk-discounts',
   *     params: {
   *       percentage: 5,
   *       fromNumberAhead: 2
   *     }
   *   },
   *   
   *   // Appllies the pay 1 and get 2
   *   'X2G2OPZ': { promotionName: 'two-for-one' },
   * });
   * @returns void
  */
  constructor(pricingRules = {}) {
    // Set the rules that comes from outside
    this.pricingRules = pricingRules
  }

  /**
   * @description Scans a product adding it to the current cart.
   * @param code The product identifier
   * @returns itself to allow function chaining
  */
  public scan(code: string, quantity?: number | null ): this {
    type Key = keyof typeof this.scanedQuantity;
    const keyName = code as Key;

    // Validates the product id before continue
    if (!this.validateItemId(code)) return this;

    // If a quantity is set up the previews
    // ammount is overriten
    if (quantity) {
      this.scanedQuantity = { ...this.scanedQuantity, [code]: quantity }
      return this;
    }
    // Add items to the cart
    if (!this.scanedQuantity[keyName]) {
      this.scanedQuantity = { ...this.scanedQuantity, [code]: 1 }
    } else {
      this.scanedQuantity[keyName]++;
    }
    // Return the instance to allow chain
    return this;
  }
  
  /**
   * @description Returns the value of all cart products with the discounts applied.
   * @returns The total amount for the user to pay without discounts
  */
  public total(): number {
    const total = this.totalGross()
    const discount = this.totalDiscount()
    return total - discount;
  }
  
  /**
   * @description Calculates and return the discount to apply to all the purcharse
   * @returns The discount for all the purcharse
   */
  public totalDiscount(): number {
    const itemIds = Object.keys(this.scanedQuantity);
    
    return itemIds.reduce((acc, id) => {
      const discount = this.getItemDiscount(id)
      return acc + discount
    }, 0);
  }
  
  /**
   * @description Calculates the total before doscount
   * @returns The discount for all the purcharse
   */
  public totalGross(): number {
    type Key = keyof typeof this.scanedQuantity;
    const itemIds = Object.keys(this.scanedQuantity);
    const productDetails = this.loadProductDetails();

    return itemIds.reduce((acc, id) => {
      const keyName = id as Key;
      const { price } = productDetails[id];
      const quantity = this.scanedQuantity[keyName];
      return acc + quantity * price
    }, 0);
  }

  /**
   * @description Calculates the total of item
   * @returns Total items
   */
  public totalQuantities(): number {
    const itemIds = Object.keys(this.scanedQuantity);
    type Key = keyof typeof this.scanedQuantity;

    return itemIds.reduce((acc, id) => {
      const keyName = id as Key;
      const quantity = this.scanedQuantity[keyName];
      return acc + quantity
    }, 0);
  }
  
  /**
   * @description Loads locally the prices to be ready to use them
   * @return An object with the product details
  */
  private loadProductDetails(): IProducDetails {
    
    // Cache prices to avoid loading prices every time
    if (Object.keys(this.producDetails).length > 0) {
      return this.producDetails;
    }

    // Populate the prices and index them to easyly get them
    const itemIds = Object.keys(this.scanedQuantity);
    itemIds.forEach(id => {
      const product = ALL_PRODUCTS.find(product => product.id === id)
      if (product !== undefined) {
        this.producDetails = { ...this.producDetails, [id]: product }
      }
    })
    return this.producDetails
  }

  /**
   * @description Calculates the discount by row
   * @returns Total discount for the iten selected
  */
  public getItemDiscount(id: string): number {
    type Key = keyof typeof this.pricingRules;
    const keyName = id as Key;

    if (!this.pricingRules[keyName]) return 0;

    const { promotionName, params } = this.pricingRules[keyName];
    const productDetails = this.loadProductDetails();
    const quantity = this.scanedQuantity[keyName];
    const { price } = productDetails[id];

    if (!this.pricingClassesMap[promotionName]) return 0;

    const className = this.pricingClassesMap[promotionName]
    const initParams = params
    
    // @ts-ignore: Dynamic initializers classes
    const discount = new className({ ...initParams })
    return discount.run(quantity, price)
  }

  /**
   * @description Returns the cart data
  */
  public getCartItems(): IProduct[] {
    type Key = keyof typeof this.scanedQuantity;

    const productDetails = this.loadProductDetails();

    const itemIds = Object.keys(this.scanedQuantity);
    return itemIds.map(id => {
      const keyName = id as Key;
      const { price, name  } = productDetails[id];
      const quantity = this.scanedQuantity[keyName]
      const total = price * this.scanedQuantity[keyName]
      const totalDiscount = this.getItemDiscount(id)

      return { id, quantity, price, total, totalDiscount, name }
    })
  }
  
  /**
   * @description Validates the scaned code to exists in the db
   * @returns Boolean
  */
  public validateItemId(code: string): boolean {
    if (!code) return false;
    return ALL_PRODUCTS.filter(
      product => product.id === code
    ).length > 0
  }
}

export default Checkout;
