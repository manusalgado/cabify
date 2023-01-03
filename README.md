# Cabify Challenge

We welcome you to the first step in your hiring process at Cabify (Yayyy! :tada:). Being here means that you've already had a conversation with one of our hiring managers, so you know that this is the step in the middle before going to the actual interview.

That last process will give us an idea of how it would be working with you, but first, we want to make sure that you have the technical skills needed to work here, and we think the following challenge is great for that.

First and foremost, **read this document carefully**, as we want to make sure all the implementation details are well understood. As you will see in the explanation, there are some things that we **require you** to implement to consider this **exercise valid**. If you have any doubts after reading it, don't hesitate to ask your go-to person. We mean it, we try to be as concise and transparent as possible, but if you think something is not clear enough, please reach out to us and we'll be super happy to answer all your questions.

As a time estimate, we consider this should take you between 6 to 8 hours to complete. That doesn't mean you **have** to do it in that time. You might take more or less time. The important thing here is that you deliver something that you would happily deploy to production (except on a Friday, of course). We're well aware that even 8 hours is a long time to dedicate to something like this, but we think this is the best way to check whether you'd be a good fit.

But enough talk! Here's what we want you to do:

**As you already know, besides providing exceptional transportation services, Cabify also runs a physical store that sells 3 products for now:**

Our current stock consists of the following products:

```
Code         | Name                |  Price
-------------------------------------------------
TSHIRT       | Cabify T-Shirt      |  20.00€
MUG          | Cabify Coffee Mug   |   5.00€
CAP          | Cabify Cap          |  10.00€
```

We allow the users the possibility of having some discounts applied when combining the products in the following ways:

- 2-for-1 promotions: (for `MUG` items). Buy two of them, get one free. (e.g: pay 10€ for 4 mugs)
- Bulk discounts: (for `TSHIRT` items). Buying 3 or more of this product, the price per unit is reduced by 5%. (e.g: if you buy 3 or more `TSHIRT` items, the price per unit should be 19.00€)

Having said that, you need to implement the solution with the following **requirements**:

1. Create a **Checkout class** that **can** be instantiated. Make sure you include this inside the `src/Checkout.(js|ts)` file :rotating_light: We **won't consider the challenge valid** if you don't fulfill the below requirements. :rotating_light: You can create as many files as you need to meet the requirements, but keep the Checkout file as it is (remember you can always change the extension to `.ts`).

   Try to implement **at least** the following interface (if you don't know what a Typescript interface is just [check this out](https://www.typescriptlang.org/docs/handbook/2/objects.html)). Feel free to add any extra constructor, properties, or methods you consider necessary for your provided solution:

   ```typescript
   interface Checkout {
     /**
      * Scans a product adding it to the current cart.
      * @param code The product identifier
      * @returns itself to allow function chaining
      */
     scan(code: string): this;
     /**
      * Returns the value of all cart products with the discounts applied.
      */
     total(): number;
   }
   ```

   An instance of this class should be able to add products via the `scan` method and, using the `total` method, obtain as a `number` the total price of the items in the cart **with the discounts already applied**.

   E.g:

   ```javascript

   const co = new Checkout(pricingRules);
   co.scan("TSHIRT").scan("CAP").scan("TSHIRT");
   const totalPrice = co.total();
   ```

1. As you can see, we've managed to deliver the markup and a [basic implementation of the styles](./example.png) with vanilla _HTML_ and _CSS_, and basic interaction with vanilla _Javascript_. With the help of the **Checkout class** you have implemented previously, complete the _HTML and Javascript_ Shopping cart to update the very total of the checkout after applying for promotions. It is expected that the total price of the shopping cart (with discounts applied) is calculated after clicking on the Checkout submit button

We've also may commit some bugs or errors in the solution. Track these errors and fix them, we also encourage you to improve the current code.

Please don't modify elements `id` attributes or labels, we will need them to validate this challenge.

To be clear, we will pay attention to the following aspects in this order (hint: the first elements are the more important):

1. `Checkout` class solution.
1. How do you implement `Checkout` class into the _User interface_.
1. _User interface_ itself. HTML and CSS solution.
1. Bonus (see below).

As general guidelines, **take into account the following aspects:**

- You can create as many files as you want, just please don't rename/delete any given files. You can also add any additional library you need.
- We appreciate you explaining the challenge you just created. We know challenge decisions are subjective matters and something can be discussed, we'd rather understand why you the certain things, **so be explicit about it**, explaining what trade-offs you had to do and why some things are included and others are left out. Think that this solution may end up deployed to final customers in a production environment, we want to know what you should take into account to safely deliver a great product.
- Your solution **should be scalable**, so build your code in a way that can be easy to grow and easy to add new functionality.
- As stated before, feel free to ask anything you have doubts about, and act as a product owner.
- Unit testing is not required for this challenge but feel free to add as many tests as you want (This challenge already support creating unit test with _Vitest_).
- [BONUS]: Our UI engineers didn't have time to work on another feature we'd love to have. When clicking on a certain product, a modal should show up with the details of the said item. You'll find here the [UI design](https://www.figma.com/file/FnGUlbUqeUOKvk6xgdCMvo/Shopping-cart-challenge) and all the assets you will need inside `/public` folder. It would be a plus if you could implement it.

## Development

Requisites:
 - node@16.17.0 (check this out in `.nvmrc` file, package.json#engine.node or package.json#volta.node).
 - npm@8.18.0 (check this out in package.json#volta.node).

To run this solution we decided to choose a modern and simple bundler called _vite_ (documentation [here](https://vitejs.dev/)), which provides us with an easy development setup with _Javascript_ and _Typescript_.

To run the solution just:
 - Run `npm install`.
 - Run `npm run dev`.

To build the solution just:
  - Run `npm run build`. It will create a bundle under `/dist` directory.

**In case you want** to include unit testing we created basic configuration with [vitest](https://vitest.dev/guide/) to support Javascript testing. If you are familiar with Jest, it has the same exact implementation! (remember unit testing is not required to complete the challenge).
 - Create a file with `*.spec|test.js|ts` extension.
 - Run the test with `npm test`.

As mentioned before, you can always rename the _Javascript_ files into _Typescript_. It's supported by default. Is completely your choice to use _Javascript_ or _Typescript_, we don't have any preference to deliver this solution.

**IMPORTANT**: Concerning the technical guidelines, before submitting the challenge, check the next bullet points:

- [ ] The code must build and execute on a Unix platform.
- [ ] The code must be submitted in _Gitlab_ repo, in _master_ branch, **and avoid using a different branch**. Only _master_ branch should remain.
- [ ] To pay attention to `Checkout` class requirements, we will discard the challenge in case some requirement is missing.
- [ ] You haven't modified the HTML nodes, we will need `ids` and `aria_labels` to perform some automatic tests.
- [ ] You haven't modified the default _vite_ development server port (default post 5173).
- [ ] You haven't modified the default _vite_ build output directory (default directory _dist_).
- [ ] You haven't modified the `.gitlab-ci.yml` file.
- [ ] All Gitlab pipelines step must pass as Ok ✅.
- [ ] We appreciate Feedback, can you [fill this form](https://docs.google.com/forms/d/e/1FAIpQLSf2Yykjcp2UryGPSIfNVoKZCV1LDIjBs0G4JZFZaVEbkAb1Nw/viewform) in order for us to improve the experience of completing this Challenge.
