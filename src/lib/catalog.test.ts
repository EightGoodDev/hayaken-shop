import { describe, expect, it } from "vitest";
import { PRODUCTS, SUBCATEGORIES, subcategoriesWithCount } from "./catalog";

describe("catalog subcategories", () => {
  it("assigns every product a subcategory valid for its category", () => {
    for (const p of PRODUCTS) {
      const valid = SUBCATEGORIES[p.category] ?? [];
      expect(valid, `product ${p.id} category ${p.category}`).toContain(p.sub);
    }
  });

  it("reports subcategory counts that sum to the category total", () => {
    for (const cat of Object.keys(SUBCATEGORIES)) {
      const total = PRODUCTS.filter((p) => p.category === cat).length;
      const summed = subcategoriesWithCount(cat).reduce((s, x) => s + x.count, 0);
      expect(summed).toBe(total);
    }
  });
});
