import { BLOCK_LIST } from '../core/config.js';
import { buildCard } from '../utils/card-builder.js';

export function render(post, postID, config) {
    return buildCard(BLOCK_LIST, post, postID, config, (parts, config) => {
        let textContentHTML = '';
        const paddingClass = postID === 0 ? 'p-4 @xs:p-6 @sm:p-8' : 'p-2 @xs:p-4 @sm:p-6';

        if (parts.hasText) {
            const ctaHTML = parts.ctaRowCode ? `<div class="mt-4 w-full">${parts.ctaRowCode}</div>` : '';

            if (config.showImage) {
                textContentHTML = `
                    <div class="absolute inset-0 flex flex-col p-0 pointer-events-none ${{ top: 'justify-start', middle: 'justify-center', bottom: 'justify-end', overlay: '' }[config.textVerticalAlign] || ''
                    }">
                        <div class="pointer-events-auto flex flex-col min-w-0 w-full overflow-hidden ${(config.textVerticalAlign === 'overlay' || !({ top: 'justify-start', middle: 'justify-center', bottom: 'justify-end', overlay: '' }[config.textVerticalAlign])) ? 'h-full ' : ''}${parts.hasTextContent ? `${config.wrapperUI} backdrop-blur-xl ` : ''}rounded-none ${paddingClass} text-${config.textHAlign}">
                            ${parts.authorCode}
                            ${parts.labelsCode}
                            ${parts.titleCode}
                            ${parts.snippetCode}
                            ${ctaHTML}
                        </div>
                    </div>
                `;
            } else {
                textContentHTML = `
                    <div class=" ${paddingClass} flex flex-col min-w-0 overflow-hidden w-full text-${config.textHAlign}">
                        ${parts.authorCode}
                        ${parts.labelsCode}
                        ${parts.titleCode}
                        ${parts.snippetCode}
                        ${ctaHTML}
                    </div>
                `;
            }
        }

        const interactionClass = config.wrapperUI;
        const bgClasses = (!config.showImage) ? [] : [];
        const displayClass = (config.showImage) ? 'block' : 'flex flex-col justify-center';
        const blockClasses = ['relative', displayClass, config.aspectRatio.trim(), 'w-full', 'h-full', interactionClass].filter(Boolean).join(' ');
        const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
        const articleClasses = `@container col-span-1 flex min-w-0 w-full h-full relative ${config.cornerStyle} ${overflowClass}`;

        const featuredBadgeHTML = (postID === 0) ? `<div class="absolute top-0 left-0 z-20 pointer-events-none backdrop-blur-xl ${config.wrapperUI} px-6 py-3 text-label-lg font-bold w-full">Featured</div>` : '';

        return `<article class="${articleClasses}" role="article" itemscope itemtype="https://schema.org/Article"><div class="${blockClasses}">${parts.finalImageCode}${featuredBadgeHTML}${textContentHTML}</div></article>`;
    });
}

