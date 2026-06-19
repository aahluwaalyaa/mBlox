import { BLOCK_QUOTE } from '../core/config.js';
import { buildCard } from '../utils/card-builder.js';

export function render(post, postID, config) {
    return buildCard(BLOCK_QUOTE, post, postID, config, (parts, config) => {
        const textContentHTML = parts.hasText ? `
            <div class="p-4 @xs:p-6 @sm:p-8 flex-grow flex flex-col">
                ${parts.titleCode}
                ${parts.snippetCode}
                <span class="mt-4 text-right">
                    ${parts.authorCode}
                </span>
                <div class="mt-auto pt-2">${parts.ctaRowCode}</div>
            </div>
        ` : '';

        const blockClasses = ['flex', 'flex-col', 'w-full', config.cornerStyle, `text-${config.textHAlign}`, 'h-full', config.wrapperUI].filter(Boolean).join(' ');
        const articleClasses = '@container col-span-1 inline-flex w-full relative h-full';

        return `<article class="${articleClasses}" role="article"><div class="${blockClasses}">${parts.finalImageCode}${textContentHTML}</div></article>`;
    });
}

