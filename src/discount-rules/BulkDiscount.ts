interface IParams {
  fromNumberAhead: number;
  percentage: number;
}

/**
 * Implements the validation for the bulk discount rows in the checkout
 * @class BulkDiscount definition to handle the batch discount
 */
export class BulkDiscount {
  params: IParams;

  constructor(params: IParams = {fromNumberAhead: 0, percentage: 0}) {
    this.params = params;
  }

  public run(quantity: number, price: number): number {
    return quantity >= this.params.fromNumberAhead 
        ? parseFloat((this.params.percentage * quantity * price / 100).toFixed(2))
        : 0;
  }
}

export default BulkDiscount;
