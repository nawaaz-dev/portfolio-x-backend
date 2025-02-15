/**
 * The quantity field in the raw data is not in a standard format.
 * List of possible quantity values:
 * 1 kg, 200 g, 400 gm, 1 l, 500 ml, 1 unit, 25U X 11.5 gm, 1 kg X 2
 * We need to standardize the quantity field to a format that can be used in the SKU and in the quantity field of the PS data.
 *
 * Let's consider the 25U x 11.5 gm quantity. Here, 25U is the pack size and 11.5 gm is the unit size.
 * We break this quantity into two parts: pack size and unit size (which will be broken further into quantity and unit).
 * pack size: 25
 * unit value: 11.5
 * unit: g (gm will be converted to g)
 *
 * return {
 *  packSize?: 25,
 *  unitValue: 11.5,
 *  unit: g,
 *  originalValue: 25U X 11.5 gm
 * }
 *
 * This function will need to be smart enough to handle all the possible quantity values.
 * Below are the formats that we need to handle:
 * 1. Number + Unit: 1 kg, 200 g, 400 gm, 1 l, 500 ml
 * 2. Number + Unit + X + Number + Unit: 25U X 11.5 gm, 1 kg X 2
 * 3. Number + Unit + X + Number: 1 kg X 2
 */
export type Quantity = {
  originalValue: string;
  packSize?: number;
  packUnit?: string;
  unitValue?: number | string;
  unit: StandardUnit;
};

export enum StandardUnit {
  ml = "ml",
  l = "l",
  g = "g",
  kg = "kg",
  piece = "piece",
  bags = "bags",
  color = "color",
  unknown = "unknown",
}

/**
 * These keys are used to map the unit of the quantity to the option value.
 * For example, if the unit of the quantity is ml, then the option value will be "Volume" using the key "V".
 */
export enum OptionValueKeyMap {
  V = "V", // volume
  Q = "Q", // quantity
  P = "P", // pack
  B = "B", // bag
  C = "C", // color
  U = "U", // unknown
}

export type StandardTaxonomy = {
  gid: string;
  name: string;
  breadcrumbs: string[];
  categories?: StandardTaxonomy[];
};
