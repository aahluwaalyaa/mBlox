import { BLOCK_COVER } from '../core/config.js';

export function renderSnippet(finalType, config, postContent, postUrl) {
    if (!config.showSnippet || !postContent) return '';

    const doc = new DOMParser().parseFromString(postContent, 'text/html');
    let snippetText = doc.body.textContent || "";
    snippetText = snippetText.trim();
    if (!snippetText) return '';

    const isOnlyElement = !config.showHeader && !config.showImage && !config.callToAction && !config.showLabels && !config.showDate;
    const clampClass = `line-clamp-${config.snippetLines || 2}`;
    const size = config.size || 'md';

    if (isOnlyElement) {
        return `<a href="${postUrl}" itemprop="description" class="after:absolute after:inset-0 z-10 block ${clampClass} w-full list-none text-body-${size} opacity-50 ${(finalType === BLOCK_COVER) ? 'py-6 px-0 md:px-10' : ''}" aria-label="Read more">${snippetText}</a>`;
    }

    return `<div itemprop="description" class="${clampClass} w-full list-none text-body-${size} opacity-50 ${(finalType === BLOCK_COVER) ? 'py-6 px-0 md:px-10' : ''}">${snippetText}</div>`;
}
