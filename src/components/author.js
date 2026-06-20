import { BLOCK_QUOTE, BLOCK_COMMENT } from '../core/config.js';

const AUTHOR_RENDERERS = {
    [BLOCK_QUOTE]: (name, _url, _theme, config) => {
        const size = config?.size || 'md';
        return `<figcaption class="text-body-${size}" itemprop="author" itemscope itemtype="https://schema.org/Person">- <span itemprop="name">${name}</span></figcaption>`;
    },
    [BLOCK_COMMENT]: (name, _url, theme) => `<span class="text-label-md ${theme.containerText}" rel="author" itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">${name}</span></span>`
};

export function renderAuthor(finalType, config, authorName, authorUri) {
    if (!config.showAuthor) return '';
    const authorURL = (authorName === "Anonymous" || authorName === "Unknown" || !authorUri) ? '' : authorUri;

    if (AUTHOR_RENDERERS[finalType]) {
        return AUTHOR_RENDERERS[finalType](authorName, authorURL, config.palette, config);
    }

    if (authorURL) {
        return `<span class="text-label-md hover:underline z-20 relative cursor-pointer" rel="author" data-href="${authorURL}" itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">${authorName}</span></span>`;
    }
    return `<span class="text-label-md" rel="author" itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">${authorName}</span></span>`;
}
