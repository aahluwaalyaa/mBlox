import { RESPONSIVE_GRID_CLASSES_M3E } from '../core/config.js';

export function renderListGrid(renderedBlocks, config) {
    if (!renderedBlocks || renderedBlocks.length === 0) return '';

    let currentColumnCount = config.columnCount;
    if (config.showHeader) currentColumnCount--;

    const innerGridColsClass = RESPONSIVE_GRID_CLASSES_M3E[currentColumnCount] || RESPONSIVE_GRID_CLASSES_M3E[6];

    // Calculate how many rows this grid *should* have on a full page (assuming first item was feature)
    const itemsOnFirstPage = config.postsPerBlock - 1;
    const expectedRows = Math.ceil(itemsOnFirstPage / currentColumnCount);

    // Calculate how many rows are actually needed for the current items
    const actualRowsNeeded = Math.ceil(renderedBlocks.length / currentColumnCount);

    // Use the larger of the two to ensure it never collapses to fewer rows than a full page
    // This forces empty rows to be created, preventing a single item from stretching to 100% height
    const rowsToDefine = Math.max(expectedRows, actualRowsNeeded);

    const rowStyle = `grid-template-rows: repeat(${rowsToDefine}, minmax(0, 1fr));`;

    return `<div class="${config.layout} px-0 grid ${innerGridColsClass} w-full flex-grow h-full" style="${rowStyle}">${renderedBlocks.join('')}</div>`;
}
