import { TwoForOneDiscount } from "./TwoForOneDiscount";

 describe("TwoForOneDiscount", () => {
   let discount;
 
   beforeEach(() => {
     discount = new TwoForOneDiscount({});
   });
 
   it("should initialize", () => {
     expect(discount).toBeInstanceOf(TwoForOneDiscount);
   });
 
   it("should perform no discount, initializing without params", () => {
     // This is really important to keep it safe from give products away
     const quantity = 1;
     const price = 10;
     expect(discount.run(quantity, price)).toStrictEqual(0);
   });

   it("should perform a 2 for 1", () => {
     // This is really important to keep it safe from give products away
     const discount = new TwoForOneDiscount({ giveAwayOneItemForEvery: 2 });
     
     // no discount
     let quantity = 1;
     let price = 10;
     expect(discount.run(quantity, price)).toStrictEqual(0);

     // discount of 1 item
     quantity = 2;
     price = 10;
     expect(discount.run(quantity, price)).toStrictEqual(10);

     // stel discount of 1 items and pay for the 3rd
     quantity = 3;
     price = 10;
     expect(discount.run(quantity, price)).toStrictEqual(10);

     // discount of 2 items
     quantity = 4;
     price = 10;
     expect(discount.run(quantity, price)).toStrictEqual(20);

   });
 });
 