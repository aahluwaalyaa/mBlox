import { BLOCK_COVER, BLOCK_QUOTE, BLOCK_COMMENT, BLOCK_PANCAKE } from '../core/config.js';

export function renderTitle(finalType, config, postTitle, postUrl) {
    if (!config.showHeader || !postTitle || postTitle.trim() === '') return '';

    const hasCta = Boolean(config.callToAction);
    const size = config.size || 'md';
    const clampClass = 'line-clamp-2';
    const styleAttr = (finalType === BLOCK_PANCAKE && config.showImage) ? ` style="min-height: calc(var(--text-title-${size}--line-height) * 2);"` : '';

    const TITLE_RENDERERS = {
        [BLOCK_QUOTE]: (title, url, hasCta) => `<svg class="float-left" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><use href="#icon-quote"></use></svg><blockquote itemprop="headline" class="text-left mt-2 ml-6 text-headline-${size} italic"${styleAttr}>${hasCta ? title : `<a href="${url}" class="after:absolute after:inset-0 z-10" aria-label="Read more about ${title.replace(/"/g, '&quot;')}">${title}</a>`}</blockquote>`,
        [BLOCK_COVER]: (title, url, hasCta) => `<h3 itemprop="headline" class="w-full ${clampClass} text-headline-${size} font-bold px-0 md:px-10"${styleAttr}>${hasCta ? title : `<a href="${url}" class="after:absolute after:inset-0 z-10" aria-label="Read more about ${title.replace(/"/g, '&quot;')}">${title}</a>`}</h3>`,
        [BLOCK_COMMENT]: (title, url, hasCta) => `<span itemprop="headline" class="${clampClass} block my-2 text-title-${size}"${styleAttr}>"${hasCta ? title : `<a href="${url}" class="after:absolute after:inset-0 z-10" aria-label="Read more about ${title.replace(/"/g, '&quot;')}">${title}</a>`}"</span>`
    };

    const render = TITLE_RENDERERS[finalType] || ((title, url, hasCta) => `<h5 itemprop="headline" class="${clampClass} text-title-${size} font-bold"${styleAttr}>${hasCta ? title : `<a href="${url}" class="after:absolute after:inset-0 z-10" aria-label="Read more about ${title.replace(/"/g, '&quot;')}">${title}</a>`}</h5>`);
    return render(postTitle, postUrl, hasCta);
}
