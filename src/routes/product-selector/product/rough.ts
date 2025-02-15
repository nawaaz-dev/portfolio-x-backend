import * as fs from "fs";
import * as path from "path";
import { getPaths } from "src/config/path";
import { Router } from "express";
import { productApiBase } from "../product-selector.config";
import { PSProduct } from "yourders-types";

const productRoughRouter = Router();

const paths = getPaths("..", "..");

/**
 * Get shopify collection set
 */
productRoughRouter.get("/shopify-collections", (req, res) => {
  const dataset = JSON.parse(
    fs.readFileSync(paths.file.allProductsData, "utf-8")
  ) as PSProduct[];

  type CollectionSet = {
    [key: string]: {
      name: string;
      children: CollectionSet;
      count?: number;
    };
  };

  let shopifyCollectionSet: CollectionSet = {};

  for (const product of dataset) {
    const { category, subCategory, subSubCategory } = product;
    const categorySet = shopifyCollectionSet[category];

    if (!categorySet) {
      shopifyCollectionSet[category] = {
        count: 0,
        name: category,
        children: {
          [`All ${category}`]: {
            count: 0,
            name: `All ${category}`,
            children: {},
          },
          [subCategory]: {
            count: 0,
            name: subCategory,
            children: {
              [`All ${subCategory}`]: {
                count: 0,
                name: `All ${subCategory}`,
                children: {},
              },
              [subSubCategory]: {
                count: 0,
                name: subSubCategory,
                children: {},
              },
            },
          },
        },
      };
    } else {
      const subCategorySet = categorySet.children[subCategory];
      if (!subCategorySet) {
        categorySet.children[subCategory] = {
          count: 0,
          name: subCategory,
          children: {
            [`All ${subCategory}`]: {
              count: 0,
              name: `All ${subCategory}`,
              children: {},
            },
            [subSubCategory]: {
              count: 0,
              name: subSubCategory,
              children: {},
            },
          },
        };
      } else {
        const subSubCategorySet = subCategorySet.children[subSubCategory];
        if (!subSubCategorySet) {
          subCategorySet.children[subSubCategory] = {
            count: 0,
            name: subSubCategory,
            children: {},
          };
        }
      }
    }

    shopifyCollectionSet[category].count =
      (shopifyCollectionSet[category].count ?? 0) + 1;
    shopifyCollectionSet[category].children[`All ${category}`].count =
      (shopifyCollectionSet[category].children[`All ${category}`].count ?? 0) +
      1;
    shopifyCollectionSet[category].children[subCategory].count =
      (shopifyCollectionSet[category].children[subCategory].count ?? 0) + 1;
    shopifyCollectionSet[category].children[subCategory].children[
      `All ${subCategory}`
    ].count =
      (shopifyCollectionSet[category].children[subCategory].children[
        `All ${subCategory}`
      ].count ?? 0) + 1;
    shopifyCollectionSet[category].children[subCategory].children[
      subSubCategory
    ].count =
      (shopifyCollectionSet[category].children[subCategory].children[
        subSubCategory
      ].count ?? 0) + 1;
  }

  // const collectionCount = dataset.reduce((acc, product) => {
  //   const { category, subCategory, subSubCategory } = product;
  //   // acc[category] = acc[category] ? acc[category] + 1 : 1;
  //   // acc[subCategory] = acc[subCategory] ? acc[subCategory] + 1 : 1;
  //   // acc[subSubCategory] = acc[subSubCategory] ? acc[subSubCategory] + 1 : 1;
  //   // return acc;
  //   acc[category].count = acc[category]?.count ? acc[category]?.count + 1 : 1;
  //   acc[category].children[`All ${category}`].count = acc[category].children[
  //     `All ${category}`
  //   ]?.count
  //     ? (acc[category].children[`All ${category}`]?.count ?? 0) + 1
  //     : 1;
  //   acc[category].children[subCategory].count = acc[category].children[
  //     subCategory
  //   ]?.count
  //     ? acc[category].children[subCategory]?.count + 1
  //     : 1;
  //   console.log(category, subCategory, `All ${subCategory}`);
  //   acc[category].children[subCategory].children[`All ${subCategory}`].count =
  //     acc[category].children[subCategory].children[`All ${subCategory}`]?.count
  //       ? (acc[category].children[subCategory].children[`All ${subCategory}`]
  //           ?.count ?? 0) + 1
  //       : 1;
  //   acc[category].children[subCategory].children[subSubCategory].count = acc[
  //     category
  //   ].children[subCategory].children[subSubCategory]?.count
  //     ? acc[category].children[subCategory].children[subSubCategory]?.count + 1
  //     : 1;
  //   return acc;
  // }, shopifyCollectionSet);

  return res.json(shopifyCollectionSet);
});

const fetchShopifyCollectionSet = async () => {
  ``;
  try {
    const response = await fetch(
      path.join(productApiBase, "/rough/shopify-collections")
    );
    const data = await response.json();
    fs.writeFileSync(
      paths.file.shopifyCollectionSet,
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error(error);
  }
};

export default productRoughRouter;

// fetchShopifyCollectionSet();
