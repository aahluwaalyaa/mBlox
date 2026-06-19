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

        return `<article class="@container col-span-1 inline-flex w-full relative h-full" role="article"><div class="flex flex-col w-full h-full overflow-hidden ${config.cornerStyle} ${config.wrapperUI}">${parts.finalImageCode}${textContentHTML}</div></article>`;
    });
}

