export function renderHeaderDescription(config) {
    if (!config.mBlockDescription) return '';
    return `<p class="pb-3 ${config.palette.text} opacity-50">${config.mBlockDescription}</p>`;
}
