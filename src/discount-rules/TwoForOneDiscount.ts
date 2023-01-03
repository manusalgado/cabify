interface IParams {
  giveAwayOneItemForEvery: number;
}

/**
 * Implements the validation for the buy 1 get 2 items
 * @class TwoForOneDiscount definition for 2for1 prom
 */
export class TwoForOneDiscount {
  params: IParams;

  constructor(params: IParams = { giveAwayOneItemForEvery: 0 }) {
    this.params = params;
  }

  public run(quantity: number, price: number): number {
    if (!this.params.giveAwayOneItemForEvery) return 0;

    const amountOfPromotions = Math.floor(quantity / this.params.giveAwayOneItemForEvery)
    return amountOfPromotions * price;
  }
}

export default TwoForOneDiscount