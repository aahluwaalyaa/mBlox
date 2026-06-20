import { BLOCK_STACK } from '../core/config.js';
import { buildCard } from '../utils/card-builder.js';

export function render(post, postID, config) {
    return buildCard(BLOCK_STACK, post, postID, config, (parts, config, bodyClass) => {
        const innerContent = parts.hasText ? `
            <div class="p-2 @xs:p-4 @sm:p-6 flex-grow flex flex-col min-w-0 ${bodyClass} text-${config.textHAlign}">
                ${parts.authorCode}
                ${parts.labelsCode}
                ${parts.titleCode}
                ${parts.snippetCode}
                ${parts.ctaRowCode}
            </div>
        ` : '';

        const isIndependentStack = config.blockType === BLOCK_STACK;
        const textWidthClass = isIndependentStack ? 'w-3/4' : 'w-2/3';

        const textContentHTML = parts.hasText ? (config.showImage ? `<div class="${textWidthClass} min-w-0 h-full flex flex-col">${innerContent}</div>` : innerContent) : '';

        const blockClasses = ['flex', 'flex-row', 'w-full', 'h-full', config.wrapperUI].filter(Boolean).join(' ');
        const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
        const articleClasses = `@container col-span-1 flex min-w-0 w-full relative h-full ${config.cornerStyle} ${overflowClass}`;

        return `<article class="${articleClasses}" role="article" itemscope itemtype="https://schema.org/Article"><div class="${blockClasses}">${parts.finalImageCode}${textContentHTML}</div></article>`;
    });
}
