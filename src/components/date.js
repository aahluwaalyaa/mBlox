import { BLOCK_COMMENT } from '../core/config.js';

export function renderDate(finalType, config, publishedDate, updatedDate) {
    if (!config.showDate) return '';

    const pDate = new Date(publishedDate);
    const formattedDate = config.dateFormatter.format(pDate);

    const isoDate = pDate.toISOString();

    // For comment blocks, leave the frontend as is (long format, original layout)
    if (finalType === BLOCK_COMMENT) {
        return `<time datetime="${isoDate}" itemprop="datePublished" class="text-label-${config.chipSize}">${config.showAuthor ? ' &#8226; ' : ''} ${formattedDate}</time>`;
    }

    // New format for all other blocks
    let isUpdated = false;
    let finalIsoDate = isoDate;
    if (updatedDate) {
        const uDate = new Date(updatedDate);
        // Check if updated date is at least 24 hours after published date
        if (uDate.getTime() - pDate.getTime() > 24 * 60 * 60 * 1000) {
            isUpdated = true;
            finalIsoDate = uDate.toISOString();
        }
    }

    const prefix = isUpdated ? 'Updated' : 'Posted';
    const prefixClass = isUpdated ? `${config.palette.bg} ${config.palette.text}` : '';
    const propName = isUpdated ? 'dateModified' : 'datePublished';

    return `<div class="flex items-center gap-1 text-label-${config.chipSize}"><span class="${prefixClass} px-2 py-1 rounded-full">${prefix}</span><time datetime="${finalIsoDate}" itemprop="${propName}" class="opacity-50">${formattedDate}</time></div>`;
}