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
                ${parts.ctaRowCode}
            </div>
        ` : '';

        const blockClasses = ['flex', 'flex-col', 'w-full', `text-${config.textHAlign}`, 'h-full', config.wrapperUI].filter(Boolean).join(' ');
        const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
        const articleClasses = `@container col-span-1 flex min-w-0 w-full relative h-full ${config.cornerStyle} ${overflowClass}`;

        return `<article class="${articleClasses}" role="article" itemscope itemtype="https://schema.org/Article"><div class="${blockClasses}">${parts.finalImageCode}${textContentHTML}</div></article>`;
    });
}
