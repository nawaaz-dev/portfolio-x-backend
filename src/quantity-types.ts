import * as fs from "fs";
import * as path from "path";
import { RawDataItem } from "./types/data";

const dataDirPath = path.join(__dirname, "..", "data", "raw");
const dataDirs = [
  "10-f4dbad",
  // "12-b51633"
];

let quantities: any[] = [];

dataDirs.forEach((dataDir) => {
  const rawFilePath = path.join(dataDirPath, dataDir, "raw.json");
  const data = JSON.parse(
    fs.readFileSync(rawFilePath, { encoding: "utf-8" })
  ) as RawDataItem[];

  quantities = data
    .map((item) =>
      item.variants.map((v) => ({
        name: item.name,
        quantity: v.quantity,
      }))
    )
    .flat();
});

// fs.writeFileSync(
//   path.join(__dirname, "quantities.json"),
//   JSON.stringify(quantities, null, 2),
//   { encoding: "utf-8" }
// );

type Quantity = {
  originalValue: string;
  packSize?: number;
  packUnit?: string;
  unitValue?: number;
  unit: string;
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

  const unitCorrectorMap: Record<string, string> = {
    gm: "g",
    gms: "g",
    kgs: "kg",
    bags: "bag",
    mls: "ml",
    pieces: "piece",
    pcs: "piece",
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
        unit: "unknown",
      };
  }
};

function createSKU(title: string, quantity: Quantity) {
  const skuSecondPartMap = {
    V: ["ml", "l"],
    Q: ["g", "kg"],
    P: ["piece"],
    B: ["bags"],
  };
  const titleParts = title.split(" ");
  const firstPart = titleParts
    .map((part) => part.slice(0, 4).toUpperCase())
    .join("")
    .slice(0, 8);
  const secondPart = `${Object.entries(skuSecondPartMap).reduce(
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

const writeData = quantities.map<{
  name: string;
  quantity: {
    originalValue: string;
    packSize?: number;
    packUnit?: string;
    unitValue?: number;
    unit: string;
  };
}>((q) => {
  const title = q.name.split(":")[0].trim().trim();
  return {
    name: title,
    quantity: processQuantity(q.quantity),
    sku: createSKU(title, processQuantity(q.quantity)),
  };
});

fs.writeFileSync(
  path.join(__dirname, "quantities.json"),
  JSON.stringify(writeData, null, 2),
  { encoding: "utf-8" }
);
