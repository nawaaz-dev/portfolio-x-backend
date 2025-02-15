import { PSProduct, PSProductVariant } from "yourders-types";
import { RawDataItem } from "../../types/data";

/**
 * The product categories in the raw data is different than what we want in the PS data.
 * For example, a product has a category "Dairy & Beverages" in the raw data. We want to separate
 * the Beverage products from the Dairy products in the PS data and add them to the "Snacks & Beverages" category.
 * For this, we need to create a mapping of the categories and sub-categories.
 * This mapping will be used to assign the new category to the product.
 * key: Product category
 * value: Old category > Sub category[]
 */

const categoryMapping = {
  Dairy: ["Dairy & Beverages > Dairy"],
  "Snacks & Beverages": [
    "Dairy & Beverages > Beverages",
    "Snacks & Packaged Foods > Biscuits & Cookies",
    "Snacks & Packaged Foods > Snacks & Farsans",
    "Snacks & Packaged Foods > Chocolates & Candies",
    "Snacks & Packaged Foods > Sweets",
    "Snacks & Packaged Foods > Mukhwas",
  ],
  "Packaged Foods": [
    "Snacks & Packaged Foods > Breakfast Cereals",
    "Snacks & Packaged Foods > Ketchup & Sauce",
    "Snacks & Packaged Foods > Jams & Spreads",
    "Snacks & Packaged Foods > Pasta & Noodles",
    "Snacks & Packaged Foods > Ready To Cook",
    "Snacks & Packaged Foods > Gourmet Food",
    "Snacks & Packaged Foods > Pickles",
    "Snacks & Packaged Foods > Health Food",
    "Snacks & Packaged Foods > Soups",
    "Snacks & Packaged Foods > Canned Foods",
    "Snacks & Packaged Foods > Frozen Foods",
  ],
  Bakery: ["Snacks & Packaged Foods > Bakery"],
};

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

type Quantity = {
  originalValue: string;
  packSize?: number;
  packUnit?: string;
  unitValue?: number;
  unit: StandardUnit;
};

enum StandardUnit {
  ml = "ml",
  l = "l",
  g = "g",
  kg = "kg",
  piece = "piece",
  bags = "bags",
  unknown = "unknown",
}

/**
 * These keys are used to map the unit of the quantity to the option value.
 * For example, if the unit of the quantity is ml, then the option value will be "Volume" using the key "V".
 */
enum OptionValueKeyMap {
  V = "V", // volume
  Q = "Q", // quantity
  P = "P", // pack
  B = "B", // bag
  U = "U", // unknown
}
/**
 * This map is used to get the options value text from the given key.
 * For example, if the key is "V", then the value will be "Volume".
 * This is used to set the option value in the PS data.
 */
const optionValueMap = {
  [OptionValueKeyMap.V]: "Volume",
  [OptionValueKeyMap.Q]: "Quantity",
  [OptionValueKeyMap.P]: "Pack",
  [OptionValueKeyMap.B]: "Bag",
  [OptionValueKeyMap.U]: "Variant",
};

/**
 * To maintain the consistency between the SKU and the unit of the quantity, we need to map the unit of the quantity to the SKU unit.
 * Using the unit of the quantity, we can get the unit required for the SKU.
 */
const skuToUnitMap = {
  [OptionValueKeyMap.V]: ["ml", "l"],
  [OptionValueKeyMap.Q]: ["g", "kg"],
  [OptionValueKeyMap.P]: ["piece"],
  [OptionValueKeyMap.B]: ["bags"],
  [OptionValueKeyMap.U]: [] as string[],
};

/**
 * This map is used to get the option value key from the standard unit.
 * For example, if we have a unit of ml, then the option value key will be "V".
 * Using this key, we can get the option value text.
 */
const standardUnitToOptionValueMap = {
  [StandardUnit.ml]: OptionValueKeyMap.V,
  [StandardUnit.l]: OptionValueKeyMap.V,
  [StandardUnit.g]: OptionValueKeyMap.Q,
  [StandardUnit.kg]: OptionValueKeyMap.Q,
  [StandardUnit.piece]: OptionValueKeyMap.P,
  [StandardUnit.bags]: OptionValueKeyMap.B,
  [StandardUnit.unknown]: OptionValueKeyMap.U,
};

const processQuantity = (quantity: string): Quantity => {
  const regexTemplates = [
    {
      id: "numberUnitXNumberUnit",
      regex: /([0-9.]+\s*\w*)\s*X\s*([0-9.]+\s*\w*)/i,
    },

    {
      id: "numberAndUnit",
      regex: /([0-9.]+)\s*(\w+)/i,
    },
  ];

  /**
   * These are the known units from the scraped data.
   */
  const knownUnitsLowercased = [
    "gms",
    "gm",
    "g",
    "kgs",
    "kg",
    "bags",
    "bag",
    "ml",
    "mls",
    "L",
    "pieces",
    "piece",
    "pcs",
  ];

  const unitCorrectorMap: Record<string, StandardUnit> = {
    gm: StandardUnit.g,
    gms: StandardUnit.g,
    kgs: StandardUnit.kg,
    bags: StandardUnit.bags,
    mls: StandardUnit.ml,
    pieces: StandardUnit.piece,
    pcs: StandardUnit.piece,
  };

  const splitUnitAndValue = (string: string) => {
    const v = string.replace(/\s/, "");
    return {
      unit: RegExp(/[a-zA-Z]+/).exec(v)?.[0],
      value: RegExp(/[0-9.]+/).exec(v)?.[0],
    };
  };

  let matchedTemplate: string | undefined;
  let matchedRegex: RegExpMatchArray | undefined;

  // Find the template that matches the quantity format.
  for (const regex of regexTemplates) {
    const match = RegExp(regex.regex).exec(quantity);
    if (match) {
      matchedTemplate = regex.id;
      matchedRegex = match;
      break;
    }
  }

  console.log(matchedTemplate, matchedRegex);

  switch (matchedTemplate) {
    case "numberUnitXNumberUnit": {
      /**
       * The first index of the matchedRegex will be the full matched string.
       * The rest of the indexes will be the matched groups.
       * The group can be of the following format:
       * 1. Group 1: [number][string] | Group 2: [number][string]
       * 2. Group 1: [number] | Group 2: [number][string]
       * 3. Group 1: [number][string] | Group 2: [number]
       *
       * For the first group, the pack size can either the first or the second group.
       * In other cases, the pack size will be the group without the string.
       *
       * For example:
       * 25U X 11.5 gm => packSize: 25, unitValue: 11.5, unit: g
       * 1 kg X 2 => packSize: 1, unitValue: 2, unit: kg
       * 2 X 1 kg => packSize: 2, unitValue: 1, unit: kg
       */
      const [originalValue, ...rest] = [...matchedRegex!];

      const group1 = splitUnitAndValue(rest[0]);
      const group2 = splitUnitAndValue(rest[1]);

      if (group1.unit && knownUnitsLowercased.includes(group1.unit)) {
        // this is the actual unit of the quantity
        return {
          originalValue,
          packSize: Number(group2.value),
          packUnit: group2.unit,
          unitValue: Number(group1.value),
          unit:
            unitCorrectorMap[group1.unit.toLocaleLowerCase()] ||
            group1.unit.toLocaleLowerCase(),
        };
      } else {
        return {
          originalValue,
          packSize: Number(group1.value),
          packUnit: group1.unit,
          unitValue: Number(group2.value),
          unit:
            unitCorrectorMap[group2.unit!.toLocaleLowerCase()] ||
            group2.unit!.toLocaleLowerCase(),
        };
      }
    }
    case "numberAndUnit": {
      const [value, unit] = quantity.split(" ");

      return {
        originalValue: quantity,
        unitValue: parseFloat(value),
        unit:
          unitCorrectorMap[unit.toLocaleLowerCase()] ||
          unit.toLocaleLowerCase(),
      };
    }
    default:
      return {
        originalValue: quantity,
        unit: StandardUnit.unknown,
      };
  }
};

function createSKU(title: string, quantity: Quantity) {
  const titleParts = title.split(" ");
  const firstPart = titleParts
    .map((part) => part.slice(0, 4).toUpperCase())
    .join("")
    .slice(0, 8);
  const secondPart = `${Object.entries(skuToUnitMap).reduce(
    (acc, [key, units]) => {
      if (units.includes(quantity.unit)) {
        return key;
      }
      return acc;
    },
    ""
  )}${quantity.unitValue?.toString().match(/\d+/)?.[0]}`;

  const thirdPart = "RALL";
  const fourthPart = quantity.packUnit ? `-PAC${quantity.packSize}` : "";

  return `${firstPart}-${secondPart}-${thirdPart}${fourthPart}`.toUpperCase();
}

function getNewCategory(old: { category: string; subCategory: string }) {
  const oldCategory = `${old.category} > ${old.subCategory}`;
  for (const [newCategory, oldCategories] of Object.entries(categoryMapping)) {
    if (oldCategories.includes(oldCategory)) {
      return newCategory;
    }
  }
  return oldCategory;
}

export function createPsData(
  data: RawDataItem[],
  assetPath: string
): PSProduct[] {
  return data.reduce((acc, item) => {
    if (!item.variants.length) {
      return acc;
    }
    /**
     * Remove the quantity from the name.
     * Usually, DMart titles have the quantity in the name.
     * For example:
     *  DMart Title: Toor Dal: 1 kg
     * We need to remove the quantity from the title.
     *  Expected Title: Toor Dal
     */
    const title = item.name.split(":")[0].trim().trim();
    /**
     * Handle is the unique identifier for the product.
     * It is made from the title value by lowercasing it and replacing spaces with hyphens.
     */
    const handle = title.toLowerCase().replace(/\s/g, "-");
    /**
     * Description is taken from the variant.description field for the default description value.
     * Later, this fields will use OpenAI to generate a better description.
     */
    const description = item.variants[0].description ?? "";
    const vendor = "Yourders";
    const category = getNewCategory({
      category: item.category,
      subCategory: item.subCategory,
    });
    const subCategory = item.subSubCategory;
    const subSubCategory = item.subSubCategory;
    const variants: PSProductVariant[] = item.variants.map((variant) => {
      const quantity = processQuantity(variant.quantity ?? "");
      const sku = createSKU(title, quantity);

      return {
        id: `${handle}-${quantity.unitValue}`,
        sku,
        description: variant.description ?? "",
        optionValue:
          optionValueMap[standardUnitToOptionValueMap[quantity.unit]],
        optionUnit: "",
        mrp: variant.mrp?.toString() ?? "",
        sp: variant.sp?.toString() ?? "",
        spPerUnit: variant.spPerUnit ?? "",
        imageSrc: variant.images,
        localImageSrc: "",
        inventoryQty: 0,
      } as any;
    });
    const id = handle;
    const images = item.variants.map((v) => v.images).flat();
    const tags = [category, subCategory, subSubCategory, item.brand];

    const product: PSProduct = {
      id,
      handle,
      title,
      description,
      vendor,
      category,
      subCategory,
      subSubCategory,
      images,
      localImages: [],
      published: true,
      status: "active",
      taxonomyGID: category,
      productCategoryBreadcrumb: [category, subCategory, subSubCategory],
      tags,
      productType: category,
      optionName: "Quantity",
      collections: [],
      variants,
    };

    const similarItemIndex = acc.findIndex((i) => i.id === id);
    if (similarItemIndex > -1) {
      acc[similarItemIndex].variants.push(...product.variants);
    } else {
      acc.push(product);
    }

    return acc;
  }, [] as PSProduct[]);
}
