import { BulkDiscount } from "./BulkDiscount";

 describe("BulkDiscount", () => {
   let discount;
 
   beforeEach(() => {
     discount = new BulkDiscount({});
   });
 
   it("should initialize", () => {
     expect(discount).toBeInstanceOf(BulkDiscount);
   });
 
   it("should perform no discount, initializing without params", () => {
     // This is really important to keep it safe from give products away
     const quantity = 1;
     const price = 10;
     expect(discount.run(quantity, price)).toStrictEqual(0);
     expect(discount.run(2, 100)).toStrictEqual(0);
     expect(discount.run(5, 10)).toStrictEqual(0);
   });

   it("should perform a bulk discount", () => {
     // This is really important to keep it safe from give products away
     const discount = new BulkDiscount({ percentage: 50, fromNumberAhead: 10 });
     
     // no discount
     let quantity = 1;
     let price = 10;
     expect(discount.run(quantity, price)).toStrictEqual(0);

     // discount of 50%
     quantity = 10;
     price = 1;
     expect(discount.run(quantity, price)).toStrictEqual(5);

     // discount of 50%
     quantity = 100;
     price = 1;
     expect(discount.run(quantity, price)).toStrictEqual(50);

   });
 });
 