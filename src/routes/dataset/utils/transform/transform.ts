import { RawDataItem } from "src/types/data";
import { PSProduct, PSProductVariant } from "yourders-types";
import transformConfig from "./transform.config";
import { Quantity, StandardTaxonomy, StandardUnit } from "./transform.types";

const {
  skuToUnitMap,
  categoryMapping,
  knownUnitsLowercased,
  unitCorrectorMap,
  optionValueMap,
  standardUnitToOptionValueMap,
  standardTaxonomyMapping,
} = transformConfig;

/**
 * The raw description might be in
 * - HTML format.
 * - Have new lines.
 * - Have extra spaces.
 *
 * This function will clean the description as follows:
 * - Replaces as new lines with \n.
 * - Remove all the extra spaces.
 */
const createDescription = (description: string) => {
  return description;
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
    // Color: Wine Touch
    {
      id: "textColonText",
      regex: /(\w+):\s*(\w*\s*\w*)/i,
    },
  ];

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
    case "textColonText": {
      const [originalValue, unit, value] = [...matchedRegex!];

      return {
        originalValue,
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

function createOptionValue(quantity: Quantity) {
  const club = (size: number | string | undefined, unit: string | undefined) =>
    `${size ?? ""} ${unit ?? ""}`.trim();

  if (quantity.packSize) {
    return `${club(quantity.packSize, quantity.packUnit)} x ${club(
      quantity.unitValue,
      quantity.unit
    )}`;
  }

  return club(quantity.unitValue, quantity.unit);
}

function createSellingPrice(mrp: number, sp: number) {
  // TODO: improve selling price logic
  const difference = mrp - sp;
  // 50 % of the difference
  const sellingPrice = sp + difference * 0.5;
  return sellingPrice;
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

function getTaxonomy(
  category: string,
  subCategory: string,
  subSubCategory: string
): StandardTaxonomy {
  const taxCategory = standardTaxonomyMapping.find(
    (tax) => tax.name === category
  );

  if (!taxCategory) {
    throw new Error(`Taxonomy not found for category: ${category}`);
  }

  const taxSubCategory = taxCategory.categories?.find(
    (tax) => tax.name === subCategory
  );

  if (!taxSubCategory) {
    // console.log("taxCategory", taxCategory);
    throw new Error(
      `Taxonomy not found for category: ${category} subCategory: ${subCategory}`
    );
  }

  const taxSubSubCategory = taxSubCategory.categories?.find(
    (tax) => tax.name === subSubCategory
  );

  if (!taxSubSubCategory) {
    // console.log("taxCategory", taxCategory);
    // console.log("taxSubCategory", taxSubCategory);

    throw new Error(
      `Taxonomy not found for category: ${category} subCategory: ${
        subCategory
      } subSubCategory: ${subSubCategory}`
    );
  }

  return taxSubSubCategory;
}

export function transformRawData(
  data: RawDataItem[],
  assetPath?: string
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
    const description = createDescription(item.variants[0].description ?? "");
    const vendor = "Yourders";
    const category = getNewCategory({
      category: item.category,
      subCategory: item.subCategory,
    });
    const subCategory = item.subCategory;
    const subSubCategory = item.subSubCategory;
    const variants: PSProductVariant[] = item.variants.map((variant) => {
      const quantity = processQuantity(variant.quantity ?? "");
      const sku = createSKU(title, quantity);
      // Remove commas, current symbols, and spaces from the MRP value.
      const cleanPrice = (price: string) => price.replace(/,|₹|\s/g, "");
      const cleanedRawMrp = cleanPrice(variant.mrp);
      const cleanedRawSp = cleanPrice(variant.sp);

      return {
        id: `${handle}-${quantity.unitValue}`,
        sku,
        description: variant.description ?? "",
        optionUnit: optionValueMap[standardUnitToOptionValueMap[quantity.unit]],
        optionValue: createOptionValue(quantity),
        mrp: Number(cleanedRawMrp),
        sp:
          createSellingPrice(Number(cleanedRawMrp), Number(cleanedRawSp)) ?? 0,
        originalSp: Number(cleanedRawSp),
        spPerUnit: variant.spPerUnit ?? "",
        imageSrc: variant.images,
        localImageSrc: "",
        inventoryQty: 0,
      };
    });

    const id = handle;
    const images = item.variants.map((v) => v.images).flat();
    const tags = [category, subCategory, subSubCategory, item.brand];
    let taxonomy: StandardTaxonomy;
    try {
      taxonomy = getTaxonomy(category, subCategory, subSubCategory);
    } catch (error) {
      console.error(error);

      throw new Error(`Product name: ${title} does not have a valid taxonomy.`);
    }

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
      status: "draft",
      taxonomyGID: taxonomy.gid,
      productCategoryBreadcrumb: taxonomy.breadcrumbs,
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
