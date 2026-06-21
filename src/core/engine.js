/**
 * mBlox Core Engine
 */

import { getProvider, BloggerProvider } from '../services/providers.js';
import { parseBlockConfig, calculateLayout } from '../utils/config-parser.js';
import { BLOCK_SHOWCASE, BLOCK_LIST, RESPONSIVE_GRID_CLASSES_M3E } from '../core/config.js';
import { loadOptimalImages } from '../utils/image-loader.js';
import { injectSvgSprite } from '../components/icons.js';
import { renderGrid } from '../layouts/grid.js';
import { renderCarouselGrid } from '../layouts/carousel.js';
import { renderListGrid } from '../layouts/list.js';
import { M3ERenderer } from '../design/ui-m3e.js';

// The responsive span required for the inner grid to fill the remaining 
// columns of the outer grid (OuterCols - 1).
const SUBGRID_SPAN_CLASSES_M3E = {
    2: '@md:col-span-1',
    3: '@md:col-span-2',
    4: '@sm:col-span-1 @md:col-span-2 @lg:col-span-3',
    5: '@sm:col-span-2 @md:col-span-3 @xl:col-span-4',
    6: '@sm:col-span-3 @lg:col-span-4 @xl:col-span-5'
};

// Global renderer instance
let rendererInstance = null;

async function _getRenderer() {
    if (rendererInstance) return rendererInstance;
    const isM3E = (window.mBloxConfig && window.mBloxConfig.designSystem === 'm3e');
    if (isM3E) {
        window.mBlox = window.mBlox || {};
        window.mBlox.m3eRenderer = M3ERenderer;
        rendererInstance = new M3ERenderer();
    } else {
        rendererInstance = new M3ERenderer();
    }
    return rendererInstance;
}

let resizeBound = false;

export async function mBlocks(blockItem) {
    if (!resizeBound) {
        window.addEventListener('resize', () => {
            document.querySelectorAll('.m-blox').forEach(el => el.style.minHeight = '');
        });
        resizeBound = true;
    }

    injectSvgSprite();
    const renderer = await _getRenderer();
    const elements = (typeof blockItem === 'string') ? document.querySelectorAll(blockItem) : [blockItem];

    for (const rawElement of elements) {
        // Designate the block wrapper as a CSS container query root
        rawElement.classList.add('@container');
        
        let blockConfig = parseBlockConfig(rawElement);
        
        // Apply the auto-detected theme and palette natively to the wrapper
        rawElement.setAttribute('data-scheme', blockConfig.mBloxTheme);
        rawElement.setAttribute('data-palette', blockConfig.paletteName);

        // Listen for pagination events fired by the renderer
        if (!rawElement._mbloxPaginateListener) {
            rawElement.addEventListener('mblox:loadNextPage', (e) => {
                mBlocks(e.target);
            });
            rawElement._mbloxPaginateListener = true;
        }

        try {
            const provider = getProvider(blockConfig);
            const response = await provider.fetch();
            blockConfig.isBloggerFeed = provider instanceof BloggerProvider;

            if (response.posts && response.posts.length > 0) {
                const postsInFeed = response.posts.length;
                if (blockConfig.contentType === "comments") blockConfig.moreText = "";

                if (blockConfig.firstInstance) {
                    rawElement.setAttribute("data-s", blockConfig.stageID);
                    rawElement.className += ` flex flex-col ${blockConfig.sectionLayout}`;
                    rawElement.insertAdjacentHTML('beforeend', renderer.createBlockHeader(blockConfig));
                }

                blockConfig = calculateLayout(blockConfig, postsInFeed);

                const { renderedBlocks, carouselIndicators, featureHTML } = await renderer.buildBlockBody(response, blockConfig);

                const isComplexLayout = (blockConfig.blockType === BLOCK_SHOWCASE || blockConfig.blockType === BLOCK_LIST);
                const isCurrentStage = blockConfig.stageID === parseInt(rawElement.getAttribute("data-s") || "1", 10);
                const displayClass = isCurrentStage ? '' : ' d-none';
                
                let blockBody = '';
                if (blockConfig.isCarousel) {
                    blockBody = renderCarouselGrid(renderedBlocks, blockConfig);
                } else if (blockConfig.blockType === BLOCK_LIST) {
                    blockBody = renderListGrid(renderedBlocks, blockConfig);
                } else {
                    blockBody = renderGrid(renderedBlocks, blockConfig);
                }

                const wrapperCode = renderer.createStageWrapper(blockBody, carouselIndicators, blockConfig, response);
                const footerCode = renderer.createBlockFooter(blockConfig, response);

                const renderOutput = `<div class="st${blockConfig.stageID}${displayClass} h-full" id="m${blockConfig.mBlockID}-st${blockConfig.stageID}">${wrapperCode}${footerCode}</div>`;

                const loadingSkeleton = rawElement.querySelector(`#m${blockConfig.mBlockID}-st${blockConfig.stageID}-loading`);
                if (loadingSkeleton) {
                    loadingSkeleton.remove();
                }

                if (blockConfig.firstInstance && isComplexLayout && featureHTML) {
                    // Inject a .complexWrapper to hold the feature and the stage
                    let wrapperClasses = `flex flex-col ${blockConfig.sectionLayout}`;
                    let stageClasses = `w-full relative`;

                    if (blockConfig.blockType === BLOCK_LIST) {
                        const outerGridColsClass = RESPONSIVE_GRID_CLASSES_M3E[blockConfig.columnCount] || RESPONSIVE_GRID_CLASSES_M3E[6];
                        const innerSpanClass = SUBGRID_SPAN_CLASSES_M3E[blockConfig.columnCount] || 'col-span-1';
                        wrapperClasses = `grid ${outerGridColsClass} ${blockConfig.sectionLayout}`;
                        stageClasses = `${innerSpanClass} relative`;
                    }
                    
                    const complexWrapperHTML = `
                        <div class="complexWrapper w-full h-full flex-grow ${wrapperClasses}">
                            ${featureHTML}
                            <div class="complexStage ${stageClasses}">
                                ${renderOutput}
                            </div>
                        </div>
                    `;
                    rawElement.insertAdjacentHTML('beforeend', complexWrapperHTML);
                } else if (isComplexLayout) {
                    // On subsequent pages, inject the new stage directly into the .complexStage
                    const stageContainer = rawElement.querySelector('.complexStage');
                    if (stageContainer) {
                        stageContainer.insertAdjacentHTML('beforeend', renderOutput);
                    } else {
                        rawElement.insertAdjacentHTML('beforeend', renderOutput);
                    }
                } else {
                    rawElement.insertAdjacentHTML('beforeend', renderOutput);
                }
                renderer.bindEvents(rawElement, blockConfig);

                const customEvent = new CustomEvent('mblox:rendered', { detail: { element: rawElement, config: blockConfig } });
                rawElement.dispatchEvent(customEvent);

                loadOptimalImages(rawElement);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
