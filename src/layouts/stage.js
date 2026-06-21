export function renderStageLayout(content, config) {
    const isOutside = config.navPosition === 'outside';
    const paddingClass = isOutside ? 'px-6 md:px-8' : '';
    return `<div id="carousel-${config.mBlockID}-st${config.stageID}" class="${config.blockType === 's' ? 'sFeature ' : ""}relative h-full flex flex-col ${paddingClass}">${content}</div>`;
}
