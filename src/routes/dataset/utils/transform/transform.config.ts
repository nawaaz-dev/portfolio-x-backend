/**
 * The product categories in the raw data is different than what we want in the PS data.
 * For example, a product has a category "Dairy & Beverages" in the raw data. We want to separate
 * the Beverage products from the Dairy products in the PS data and add them to the "Snacks & Beverages" category.
 * For this, we need to create a mapping of the categories and sub-categories.
 * This mapping will be used to assign the new category to the product.
 * key: Product category
 * value: Old category > Sub category[]
 */

import {
  OptionValueKeyMap,
  StandardTaxonomy,
  StandardUnit,
} from "./transform.types";

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
  [OptionValueKeyMap.C]: "Color",
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
  [OptionValueKeyMap.C]: ["color"],
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
  [StandardUnit.color]: OptionValueKeyMap.C,
  [StandardUnit.unknown]: OptionValueKeyMap.U,
};

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
  "color",
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

const categoryMapping = {
  Dairy: ["Dairy & Beverages > Dairy"],
  "Snacks & Beverages": [
    "Dairy & Beverages > Beverages",
    "Packaged Food > Biscuits & Cookies",
    "Packaged Food > Snacks & Farsans",
    "Packaged Food > Chocolates & Candies",
    "Packaged Food > Sweets",
    "Packaged Food > Mukhwas",
  ],
  "Packaged Foods": [
    "Packaged Food > Breakfast Cereals",
    "Packaged Food > Ketchup & Sauce",
    "Packaged Food > Jams & Spreads",
    "Packaged Food > Pasta & Noodles",
    "Packaged Food > Ready To Cook",
    "Packaged Food > Gourmet Food",
    "Packaged Food > Pickles",
    "Packaged Food > Health Food",
    "Packaged Food > Soups",
    "Packaged Food > Canned Foods",
    "Packaged Food > Frozen Foods",
  ],
  Bakery: ["Packaged Food > Bakery"],
};

const standardTaxonomyMapping: StandardTaxonomy[] = [
  {
    name: "Snacks & Beverages",
    gid: "gid://shopify/TaxonomyCategory/fb",
    breadcrumbs: ["Food, Beverages & Tobacco"],
    categories: [
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
        name: "Biscuits & Cookies",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Bakery",
          "Cookies",
        ],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Cookies",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Glucose Biscuits",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Marie Biscuits",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Salty Biscuits",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Cream Biscuits",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Digestive Biscuits",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1",
            name: "Khari & Toasts",
            breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Bakery"],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Wafer Biscuits",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-6",
            name: "Health Biscuits",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cookies",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-17",
        name: "Snacks & Farsans",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Snack Foods"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-17",
            name: "Sev & Mixtures",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Snack Foods",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-17-4",
            name: "Chips & Wafers",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Snack Foods",
              "Chips",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-17",
            name: "Namkeens",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Snack Foods",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-17-2",
            name: "Snack Bars",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Snack Foods",
              "Cereal & Granola Bars",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-15",
            name: "Frozen Snacks",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Prepared Foods",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-17-9",
            name: "Popcorn",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Snack Foods",
              "Popcorn",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-3",
        name: "Chocolates & Candies",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Snack Foods"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-3-2",
            name: "Chocolates",
            // Food, Beverages & Tobacco > Food Items > Candy & Chocolate > Chocolate
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Candy & Chocolate",
              "Chocolate",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-3-1",
            name: "Candies",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Candy & Chocolate",
              "Candy",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-5-2",
            name: "Compound Chocolates",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Cooking & Baking Ingredients ",
              "Baking Chocolate",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-3-2",
            name: "Dark Chocolates",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Candy & Chocolate",
              "Chocolate",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2",
        name: "Sweets",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Snack Foods"],
        categories: [],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2",
        name: "Mukhwas",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
        categories: [],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-10-3",
        name: "Canned Food",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Fruits & Vegetables",
          "Canned & Prepared Beans",
        ],
        categories: [],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-1",
        name: "Beverages",
        breadcrumbs: ["Food, Beverages & Tobacco", "Beverages"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-14-2",
            name: "Tea",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Tea & Infusions",
              "Tea",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-14",
            name: "Tea Bags",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Tea & Infusions",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-14",
            name: "Green Tea",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Tea & Infusions",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-3",
            name: "Coffee",
            breadcrumbs: ["Food, Beverages & Tobacco", "Beverages", "Coffee"],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-11",
            name: "Drink Mixes",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Powdered Beverage Mixes",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-12",
            name: "Soft Drinks",
            breadcrumbs: ["Food, Beverages & Tobacco", "Beverages", "Soda"],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-8-1",
            name: "Non-Alcoholic Beers",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Low Alcohol & Alcohol-Free Beverages",
              "Low Alcohol & Alcohol-Free Beer",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-7",
            name: "Juices",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Juices, Milkshakes & Smoothies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-5",
            name: "Fruit Mixes",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Fruit Flavored Drinks",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-13-1",
            name: "Energy Drinks",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Sports & Energy Drinks",
              "Energy Drinks",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-4",
            name: "Squash & Syrups",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Cordials, Syrups & Squash",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-11",
            name: "Concentrates",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Beverages",
              "Powdered Beverage Mixes",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-16",
            name: "Soda & Water",
            breadcrumbs: ["Food, Beverages & Tobacco", "Beverages", "Water"],
          },
        ],
      },
    ],
  },
  {
    gid: "gid://shopify/TaxonomyCategory/fb-2",
    name: "Packaged Foods",
    breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
    categories: [
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-11",
        name: "Breakfast Cereals",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Grains, Rice & Cereal",
        ],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-11-4",
            name: "Flakes",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Grains, Rice & Cereal",
              "Cereal & Granola",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-11-7",
            name: "Oats",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Grains, Rice & Cereal",
              "Oats, Grits & Hot Cereal",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-11-4",
            name: "Muesli",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Grains, Rice & Cereal",
              "Cereal & Granola",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-4",
        name: "Ketchup & Sauce",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Condiments & Sauces",
        ],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-9",
            name: "Ketchup",
            // Food, Beverages & Tobacco > Food Items > Candy & Chocolate > Chocolate
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Ketchup",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4",
            name: "Sauce",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4",
            name: "Chutney",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-5-34",
            name: "Vinegar",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Cooking & Baking Ingredients",
              "Vinegar",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-7",
        name: "Jams & Spreads",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Dips & Spreads",
        ],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-7-6",
            name: "Jams",
            // Food, Beverages & Tobacco > Food Items > Candy & Chocolate > Chocolate
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dips & Spreads",
              "Jams & Jellies",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-7-7",
            name: "Spreads",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dips & Spreads",
              "Nut Butters",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-6",
            name: "Honey",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Honey",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-11",
            name: "Mayonnaise",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Mayonnaise",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-18",
            name: "Dips & Dressings",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Salad Dressing",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-14",
        name: "Pasta & Noodles",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Pasta & Noodles",
        ],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-14",
            name: "Instant Noodles",
            // Food, Beverages & Tobacco > Food Items > Candy & Chocolate > Chocolate
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Pasta & Noodles",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-14",
            name: "Hakka Noodles",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Pasta & Noodles",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-14",
            name: "Pasta",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Pasta & Noodles",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-14",
            name: "Vermicelli",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Pasta & Noodles",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2",
        name: "Ready To Cook",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-5",
            name: "Ready Mix",
            // Food, Beverages & Tobacco > Food Items > Candy & Chocolate > Chocolate
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Cooking & Baking Ingredients",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-17",
            name: "Papad",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Snack Foods",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2",
        name: "Gourmet Food",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-5",
            name: "Biscuits & Chocolates",
            // Food, Beverages & Tobacco > Food Items > Candy & Chocolate > Chocolate
            breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4",
            name: "Ketchup & Sauces",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-14",
            name: "Noodles & Pasta",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Pasta & Noodles",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-3-2",
            name: "Dark Chocolates",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Candy & Chocolate",
              "Chocolate",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-4-15",
        name: "Pickles",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Condiments & Sauces",
          "Pickled Fruits & Vegetables",
        ],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-15",
            name: "Mango Pickles",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Pickled Fruits & Vegetables",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-15",
            name: "Lime Pickles",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Pickled Fruits & Vegetables",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-15",
            name: "Mixed Pickles",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Pickled Fruits & Vegetables",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-15",
            name: "Chilli Pickles",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Pickled Fruits & Vegetables",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4",
            name: "Chutney & Chutney Powder",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4",
            name: "Other Pickles",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
            ],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-4-15",
        name: "Health Food",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-4-6",
            name: "Honey",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Condiments & Sauces",
              "Honey",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2",
            name: "Chyawanprash",
            breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-5-30",
            name: "Sugar Substitutes",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Cooking & Baking Ingredients",
              "Sugar & Sweeteners",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2",
            name: "Other Healthy Alternatives",
            breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
          },
        ],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-18",
        name: "Soups",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Soups & Broths",
        ],
        categories: [],
      },
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-10-3",
        name: "Frozen Foods",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-15",
            name: "Snacks",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Prepared Foods",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-10-8",
            name: "Veggies",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Fruits & Vegetables",
              "Fresh & Frozen Vegetables",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-15",
            name: "Parathas & Rotis",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Prepared Foods",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-9",
            name: "Ice Cream & Desserts",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Frozen Desserts & Novelties",
            ],
          },
        ],
      },
    ],
  },
  {
    gid: "gid://shopify/TaxonomyCategory/fb-2-1",
    name: "Bakery",
    breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Bakery"],
    categories: [
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-1",
        name: "Bakery",
        breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Bakery"],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-4-1",
            name: "Cakes",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Cakes & Dessert Bars",
              "Cakes",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1",
            name: "Khari & Toasts",
            breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Bakery"],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-1-3",
            name: "Bread & Buns",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Bakery",
              "Breads & Buns",
            ],
          },
        ],
      },
    ],
  },
  {
    gid: "gid://shopify/TaxonomyCategory/fb-2-6",
    name: "Dairy",
    breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Dairy Products"],
    categories: [
      {
        gid: "gid://shopify/TaxonomyCategory/fb-2-6",
        name: "Dairy",
        breadcrumbs: [
          "Food, Beverages & Tobacco",
          "Food Items",
          "Dairy Products",
        ],
        categories: [
          {
            gid: "gid://shopify/TaxonomyCategory/fb-1-9",
            name: "Milk",
            breadcrumbs: ["Food, Beverages & Tobacco", "Food Items", "Milk"],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-6-1",
            name: "Butter",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dairy Products",
              "Butter & Margarine",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-6-2",
            name: "Cheese",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dairy Products",
              "Cheese",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-6",
            name: "Dairy Products",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dairy Products",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-6-8",
            name: "Dahi",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dairy Products",
              "Yogurt",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-6-8",
            name: "Yogurt",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dairy Products",
              "Yogurt",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-6-8",
            name: "Shrikhand",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dairy Products",
              "Yogurt",
            ],
          },
          {
            gid: "gid://shopify/TaxonomyCategory/fb-2-6-4",
            name: "Paneer",
            breadcrumbs: [
              "Food, Beverages & Tobacco",
              "Food Items",
              "Dairy Products",
              "Cottage Cheese",
            ],
          },
        ],
      },
    ],
  },
];

const transformConfig = {
  optionValueMap,
  skuToUnitMap,
  standardUnitToOptionValueMap,
  knownUnitsLowercased,
  unitCorrectorMap,
  categoryMapping,
  standardTaxonomyMapping,
};

export default transformConfig;
