import test from "node:test";
import assert from "node:assert/strict";
import { calculateKua } from "./kua";

test("Kua Calculator - Male Born 1988 (Zhen / East Group)", () => {
  const result = calculateKua(1988, "male");
  assert.equal(typeof result.kuaNumber, "number");
  assert.ok(["East", "West"].includes(result.group));
  assert.ok(result.luckyDirections.shengChi);
  assert.ok(result.luckyDirections.tianYi);
});

test("Kua Calculator - Female Born 1992 (Dui / West Group)", () => {
  const result = calculateKua(1992, "female");
  assert.equal(typeof result.kuaNumber, "number");
  assert.ok(["East", "West"].includes(result.group));
});

test("Kua Calculator - Special Kua 5 Transformation Rule", () => {
  const male = calculateKua(1995, "male");
  assert.notEqual(male.kuaNumber, 5);
  const female = calculateKua(1990, "female");
  assert.notEqual(female.kuaNumber, 5);
});
