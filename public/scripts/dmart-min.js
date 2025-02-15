(function () {
    'use strict';

    const querySelector = (selector, element = document.body) => {
        return element.querySelector(selector);
    };
    const queryByClass = (classPartial, element = document.body) => {
        // console.log(`[class*="${classPartial}"]`);
        return element.querySelector(`[class*="${classPartial}"]`);
    };
    const queryAllByClass = (classPartial, element = document.body) => {
        return Array.from(element.querySelectorAll(`[class*="${classPartial}"]`));
    };
    const jocument = {
        querySelector,
        queryByClass,
        queryAllByClass,
    };

    const dmartSelectors = {
        customUI: {
            pageContentContainer: 'layout_container',
            customUiContainer: 'custom-ui_container',
        },
        categoryPanel: {
            trigger: 'categories-header_listStaticItemLink',
            container: 'all-categories_content',
            title: 'all-categories_header',
            list: 'all-categories_list',
            listItem: 'all-categories_items',
            image: 'all-categories_image',
        },
        categoryListing: {
            categoryBreadcrumb: 'MuiBreadcrumbs-ol',
            cardContainer: 'vertical-card_card-vertical',
            imageContainer: 'vertical-card_section-top',
            name: 'vertical-card_title',
            priceContainerMain: 'vertical-card_price-left',
            priceContainer: 'vertical-card_price-container',
        },
    };

    /**
     * Creates a vertical column that lists items that have been clicked/selected.
     * Allows removing the items with a cross button appended to that item
     * Shows export and clear buttons.
     */
    let customUI = null;
    function injectUI() {
        const main = document.querySelector('main');
        main.style.width = '80vw';
        main.style.overflowY = 'auto';
        customUI = document.querySelector(`.${dmartSelectors.customUI.customUiContainer}`);
        if (!customUI) {
            customUI = document.createElement('div');
        }
        else {
            customUI.innerHTML = '';
        }
        customUI.classList.add(dmartSelectors.customUI.customUiContainer);
        customUI.style.position = 'fixed';
        customUI.style.bottom = '0';
        customUI.style.right = '0';
        customUI.style.backgroundColor = 'white';
        customUI.style.width = '20vw';
        customUI.style.height = '100vh';
        customUI.style.display = 'flex';
        customUI.style.flexDirection = 'column';
        customUI.style.overflowX = 'auto';
        const pageContentContainer = jocument.queryByClass(dmartSelectors.customUI.pageContentContainer);
        pageContentContainer === null || pageContentContainer === void 0 ? void 0 : pageContentContainer.appendChild(customUI);
    }
    /**
     * Adds clickability to all the product cards in the page.
     */
    function addClickability() {
        const cards = jocument.queryAllByClass(dmartSelectors.categoryListing.cardContainer);
        cards.forEach((card) => {
            card.addEventListener('click', clickHandler);
        });
    }
    const itemDataList = [];
    function clickHandler(e) {
        var _a, _b, _c, _d, _e;
        e.preventDefault();
        e.stopPropagation();
        const element = e.target;
        // Get the closes parent that has the cardContainer class
        const card = element.closest(`[class*="${dmartSelectors.categoryListing.cardContainer}"]`);
        if (!card) {
            return;
        }
        const data = {};
        data.name = (_a = jocument.queryByClass(dmartSelectors.categoryListing.name, card)) === null || _a === void 0 ? void 0 : _a.textContent;
        if (itemDataList.find((x) => x.name === data.name)) {
            console.log(itemDataList);
            return;
        }
        const [category, subCategory, subSubCategory, ...rest] = ((_c = (_b = jocument
            .queryByClass(dmartSelectors.categoryListing.categoryBreadcrumb)) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.split(' ').filter((x) => x)) || [];
        data.category = category;
        data.subCategory = subCategory;
        data.subSubCategory = [subSubCategory].concat(rest).join(' '); // all the crumbs after the first two are subSubCategory
        data.imageUrl = (_e = (_d = jocument
            .queryByClass(dmartSelectors.categoryListing.imageContainer, card)) === null || _d === void 0 ? void 0 : _d.querySelector('img')) === null || _e === void 0 ? void 0 : _e.getAttribute('src');
        const [mrp, sp] = (() => {
            var _a, _b, _c, _d;
            const priceContainer = jocument.queryByClass(dmartSelectors.categoryListing.priceContainerMain, card);
            if (!priceContainer) {
                return [null, null];
            }
            const [mrpContainer, spContainer] = jocument.queryAllByClass(dmartSelectors.categoryListing.priceContainer, priceContainer);
            const mrp = (_b = (_a = mrpContainer === null || mrpContainer === void 0 ? void 0 : mrpContainer.textContent) === null || _a === void 0 ? void 0 : _a.match(/\d+/)) === null || _b === void 0 ? void 0 : _b[0];
            const sp = (_d = (_c = spContainer === null || spContainer === void 0 ? void 0 : spContainer.textContent) === null || _c === void 0 ? void 0 : _c.match(/\d+/)) === null || _d === void 0 ? void 0 : _d[0];
            return [mrp, sp];
        })();
        data.mrp = mrp ? parseInt(mrp) : null;
        data.sp = sp ? parseInt(sp) : null;
        itemDataList.push(data);
        renderUI();
    }
    function renderUI() {
        customUI.innerHTML = '';
        itemDataList.forEach((item, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.style.display = 'flex';
            itemContainer.style.justifyContent = 'space-between';
            itemContainer.style.padding = '1rem';
            itemContainer.style.border = '1px solid black';
            itemContainer.style.width = '100%';
            itemContainer.style.position = 'relative';
            const itemDetails = document.createElement('div');
            itemDetails.style.display = 'flex';
            itemDetails.style.flexDirection = 'column';
            const image = document.createElement('img');
            image.src = item.imageUrl;
            image.style.width = '100%';
            // image.style.height = '30px';
            const name = document.createElement('span');
            name.textContent = item.name;
            name.style.fontWeight = 'bold';
            const category = document.createElement('span');
            category.textContent = item.category;
            const subCategory = document.createElement('span');
            subCategory.textContent = item.subCategory;
            const subSubCategory = document.createElement('span');
            subSubCategory.textContent = item.subSubCategory;
            const price = document.createElement('span');
            price.textContent = `₹${item.sp}`;
            itemDetails.appendChild(image);
            itemDetails.appendChild(name);
            // itemDetails.appendChild(category);
            // itemDetails.appendChild(subCategory);
            // itemDetails.appendChild(subSubCategory);
            itemDetails.appendChild(price);
            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.style.position = 'absolute';
            removeButton.style.top = '0';
            removeButton.style.right = '0';
            removeButton.style.backgroundColor = 'red';
            removeButton.style.color = 'white';
            removeButton.style.border = 'none';
            removeButton.style.borderRadius = '50%';
            removeButton.style.cursor = 'pointer';
            removeButton.style.padding = '0.25rem';
            removeButton.addEventListener('click', () => {
                itemDataList.splice(index, 1);
                renderUI();
            });
            itemContainer.appendChild(itemDetails);
            itemContainer.appendChild(removeButton);
            customUI.appendChild(itemContainer);
        });
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export';
        exportButton.style.backgroundColor = 'green';
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '5px';
        exportButton.style.cursor = 'pointer';
        exportButton.style.margin = '1rem';
        exportButton.style.padding = '0.5rem';
        exportButton.addEventListener('click', () => {
            exportData();
        });
        customUI.appendChild(exportButton);
    }
    function exportData() {
        const data = JSON.stringify(itemDataList, null, 2);
        // const blob = new Blob([data], { type: 'application/json' });
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'dmart.json';
        // a.click();
        fetch('http://localhost:3000/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'no-cors': '',
            },
            body: data,
        })
            .then((res) => res.json())
            .then(console.log)
            .catch((err) => {
            console.error(err);
        });
    }
    injectUI();
    addClickability();

})();
