import { test, expect } from '@playwright/test';
import {removesNonDigits} from '../functions/utils'
const WEBSITE_URL = process.env.FRONTEND_URL || "http://192.168.1.42:30388/";

test.describe("App Smoke Tests", () => {
  // Runs before every test in this block
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL);
    await page.getByRole('link', { name: 'Cart icon' }).click();
    
    const isCartEmpty = await page.getByRole('heading', { name: 'Your shopping cart is empty!' }).isVisible();
    if (isCartEmpty) {
      await page.getByRole("button", { name: "Continue Shopping" }).click();
      console.log("cart is empty")

    }
    else {
      await page.getByRole("button", { name: "Empty Cart" }).click();
      console.log("cart is not empty, emptying it");

    }
    

  });

  test("User can add multiple items to cart and place an order", async ({
    page,
  }) => {
    await test.step("1. Add first product to cart", async () => {
      await page.getByRole("heading", { name: "Hot Products" }).click();

      // ⚠️ WARNING: .nth(2) is brittle.
      // Better alternative: page.getByRole('link', { name: 'Blue T-Shirt' }).click();
      await page.getByRole("link").nth(2).click();

      await page.locator("#quantity").selectOption("3");
      const productPrice = await page.locator(".product-price").textContent();
      console.log(productPrice);

      const price = removesNonDigits(productPrice);

      await page.getByRole("button", { name: "Add To Cart" }).click();

      // ASSERTION: Verify the cart updated or a success message appeared
      await expect(page.getByText("$" + (price * 3))).toBeVisible();

      await page.getByRole("button", { name: "Continue Shopping" }).click();
    });

    await test.step("2. Add second product and proceed to checkout", async () => {
      // ⚠️ WARNING: .nth(4) is brittle.
      await page.getByRole("link").nth(4).click();
      await page.getByRole("button", { name: "Add To Cart" }).click();

      // Fill out email for guest checkout
      await page
        .getByRole("textbox", { name: "E-mail Address" })
        .fill("test@email.gr");
      await page.getByRole("button", { name: "Place Order" }).click();

      // ASSERTION: Verify the order was placed
      await expect(
        page.getByRole("heading", { name: "Your order is complete!" }),
      ).toBeVisible();

      await page.getByRole("button", { name: "Continue Shopping" }).click();
    });

    await test.step("3. Add a third product post-checkout", async () => {
      // ⚠️ WARNING: CSS child selectors are highly prone to breaking.
      // Better alternative: page.getByTestId('product-card-xyz').click();
      await page.locator("div:nth-child(9) > a").click();

      await page.locator("#quantity").selectOption("3");
      await page.getByRole("button", { name: "Add To Cart" }).click();
      await page.getByRole("button", { name: "Place Order" }).click();

      // ASSERTION: Verify the second order was placed
      await expect(page.getByText("Your order is complete!")).toBeVisible();

      await page.getByRole("button", { name: "Continue Shopping" }).click();
    });
  });

  
});