import { BLOCK_CARD } from '../core/config.js';
import { buildCard } from '../utils/card-builder.js';

export function render(post, postID, config) {
    return buildCard(BLOCK_CARD, post, postID, config, (parts, config) => {
        const textContentHTML = parts.hasText ? `
            <div class="absolute inset-0 flex flex-col p-0 pointer-events-none ${{ top: 'justify-start', middle: 'justify-center', bottom: 'justify-end', overlay: '' }[config.textVerticalAlign] || ''
            }">
                <div class="pointer-events-none flex flex-col min-w-0 w-full overflow-hidden ${(config.textVerticalAlign === 'overlay' || !({ top: 'justify-start', middle: 'justify-center', bottom: 'justify-end', overlay: '' }[config.textVerticalAlign])) ? 'h-full ' : ''}${(parts.hasTextContent && (config.showHeader || config.showSnippet)) ? `${config.wrapperUI} backdrop-blur-xl pointer-events-auto ` : (parts.hasTextContent ? 'pointer-events-auto ' : '')}rounded-none p-2 @2xs:p-4 @sm:p-6 text-${config.textHAlign}">
                    <div class="flex flex-col gap-3 w-full flex-grow pointer-events-auto">
                        ${parts.authorCode}
                        ${parts.labelsCode}
                        ${parts.titleCode}
                        ${parts.snippetCode}
                        ${parts.ctaRowCode}
                    </div>
                </div>
            </div>
        ` : '';

        const blockClasses = ['relative', 'block', 'w-full', 'overflow-hidden', config.aspectRatio.trim(), 'h-full', config.wrapperUI].filter(Boolean).join(' ');
        const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
        const articleClasses = `@container col-span-1 flex min-w-0 w-full relative h-full ${config.cornerStyle} ${overflowClass}`;

        return `<article class="${articleClasses}" role="article" itemscope itemtype="https://schema.org/Article"><div class="${blockClasses}">${parts.finalImageCode}${textContentHTML}</div></article>`;
    });
}
