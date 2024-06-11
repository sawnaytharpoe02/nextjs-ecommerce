import db from "../src/db";
import { faker } from "@faker-js/faker";

async function seedProducts(count = 10) {
  const products = Array.from({ length: count }, () => ({
    name: faker.commerce.productName(),
    isAvailableForPurchase: false,
    priceInCents: parseInt(faker.finance.amount(100, 10000, 0)),
    filePath: null,
    imagePath: null,
    description: faker.commerce.productDescription(),
  }));

  await db.product.createMany({
    data: products,
  });
}

async function main() {
  // seeding placeholder products data to database
  await seedProducts(20);
}

main()
  .catch((err) => {
    console.error(
      "An error occurred while attempting to seed the database:",
      err
    );
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
