import { BLOCK_PANCAKE } from '../core/config.js';
import { buildCard } from '../utils/card-builder.js';

export function render(post, postID, config) {
    return buildCard(BLOCK_PANCAKE, post, postID, config, (parts, config) => {
        const textContentHTML = parts.hasText ? `
            <div class="p-2 @xs:p-4 @sm:p-6 flex-grow flex flex-col text-${config.textHAlign}">
                ${parts.authorCode}
                ${parts.labelsCode}
                ${parts.titleCode}
                ${parts.snippetCode}
                <div class="mt-auto pt-2">${parts.ctaRowCode}</div>
            </div>
        ` : '';

        const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
        const articleClasses = `@container col-span-1 flex min-w-0 w-full relative h-full ${config.cornerStyle} ${overflowClass}`;
        return `<article class="${articleClasses}" role="article" itemscope itemtype="https://schema.org/Article"><div class="flex flex-col w-full h-full overflow-hidden ${config.wrapperUI}">${parts.finalImageCode}${textContentHTML}</div></article>`;
    });
}


