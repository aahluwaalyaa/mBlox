export function renderHeaderDescription(config) {
    if (!config.mBlockDescription) return '';
    return `<p class="opacity-50">${config.mBlockDescription}</p>`;
}
