import type { CategorySlug } from "@/lib/types";

export interface SizeChart {
  unit: "in";
  columns: { key: string; label: string }[];
  rows: Record<string, string | number>[];
  howToMeasure: { label: string; description: string }[];
}

export const SIZE_CHARTS: Record<CategorySlug, SizeChart> = {
  shirts: {
    unit: "in",
    columns: [
      { key: "size", label: "Size" },
      { key: "chest", label: "Body chest" },
      { key: "length", label: "Length" },
      { key: "shoulder", label: "Shoulder" },
      { key: "sleeve", label: "Sleeve" },
    ],
    rows: [
      {
        size: "S",
        chest: "36–38",
        chestMax: 38,
        length: 28,
        shoulder: 17,
        sleeve: 24.5,
      },
      {
        size: "M",
        chest: "38–40",
        chestMax: 40,
        length: 29,
        shoulder: 17.75,
        sleeve: 25,
      },
      {
        size: "L",
        chest: "40–42",
        chestMax: 42,
        length: 30,
        shoulder: 18.5,
        sleeve: 25.5,
      },
      {
        size: "XL",
        chest: "42–44",
        chestMax: 44,
        length: 31,
        shoulder: 19.25,
        sleeve: 26,
      },
      {
        size: "XXL",
        chest: "44–47",
        chestMax: 47,
        length: 32,
        shoulder: 20,
        sleeve: 26.5,
      },
    ],
    howToMeasure: [
      {
        label: "Chest",
        description: "Around the fullest part of your chest, under the arms.",
      },
      {
        label: "Shoulder",
        description: "Across the back, from one shoulder seam to the other.",
      },
      {
        label: "Sleeve",
        description: "From the shoulder seam to the wrist bone.",
      },
    ],
  },
  pants: {
    unit: "in",
    columns: [
      { key: "size", label: "Size" },
      { key: "waist", label: "Body waist" },
      { key: "hip", label: "Hip" },
      { key: "inseam", label: "Inseam" },
      { key: "legOpening", label: "Leg opening" },
    ],
    rows: [
      {
        size: "30",
        waist: "29–30",
        waistMax: 30,
        hip: 38,
        inseam: 32,
        legOpening: 13,
      },
      {
        size: "32",
        waist: "31–32",
        waistMax: 32,
        hip: 40,
        inseam: 32,
        legOpening: 13.5,
      },
      {
        size: "34",
        waist: "33–34",
        waistMax: 34,
        hip: 42,
        inseam: 32,
        legOpening: 14,
      },
      {
        size: "36",
        waist: "35–36",
        waistMax: 36,
        hip: 44,
        inseam: 32,
        legOpening: 14.5,
      },
      {
        size: "38",
        waist: "37–38",
        waistMax: 38,
        hip: 46,
        inseam: 32,
        legOpening: 15,
      },
    ],
    howToMeasure: [
      {
        label: "Waist",
        description:
          "Where you normally wear your trousers, without pulling tight.",
      },
      { label: "Hip", description: "Around the fullest part of your seat." },
      {
        label: "Inseam",
        description: "From the crotch seam to the bottom of the ankle.",
      },
    ],
  },
};

export type PreferredFit = "closer" | "regular" | "relaxed";

export interface SizeInputs {
  heightCm?: number;
  weightKg?: number;
  chestIn?: number;
  waistIn?: number;
  fit: PreferredFit;
}

export interface SizeRecommendation {
  size: string;
  basis: string;
  chartRow: Record<string, string | number>;
}

/**
 * Deterministic lookup against the official chart. Body measurement wins;
 * height/weight is only used to estimate a measurement when none is given.
 */
export function recommendSize(
  category: CategorySlug,
  inputs: SizeInputs,
): SizeRecommendation | null {
  const chart = SIZE_CHARTS[category];
  const key = category === "shirts" ? "chestMax" : "waistMax";
  let measurement = category === "shirts" ? inputs.chestIn : inputs.waistIn;
  let basis =
    category === "shirts" ? "your chest measurement" : "your waist measurement";

  if (!measurement && inputs.weightKg && inputs.heightCm) {
    const bmi = inputs.weightKg / (inputs.heightCm / 100) ** 2;
    measurement = category === "shirts" ? 30 + bmi * 0.45 : 22 + bmi * 0.42;
    basis = "an estimate from your height and weight";
  }
  if (!measurement) return null;

  let index = chart.rows.findIndex((row) => measurement! <= Number(row[key]));
  if (index === -1) index = chart.rows.length - 1;
  if (inputs.fit === "relaxed")
    index = Math.min(index + 1, chart.rows.length - 1);
  if (inputs.fit === "closer") index = Math.max(index - 1, 0);

  const row = chart.rows[index];
  return { size: String(row.size), basis, chartRow: row };
}
