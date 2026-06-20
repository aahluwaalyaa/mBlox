export function renderHeaderTitle(config) {
    if (!config.mBlockTitle) return '';
    return `<h4 class="text-title-lg font-bold">${config.mBlockTitle}</h4>`;
}
