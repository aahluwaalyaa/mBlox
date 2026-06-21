export function renderStageLayout(content, config) {
    return `<div id="carousel-${config.mBlockID}-st${config.stageID}" class="${config.blockType === 's' ? 'sFeature ' : ""}relative h-full flex flex-col">${content}</div>`;
}
