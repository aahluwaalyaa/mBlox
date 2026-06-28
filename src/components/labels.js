export function renderLabels(config, labels, siteUrl) {
    if (!config.showLabels || !labels || labels.length === 0) return '';

    // Select up to 3 random labels
    const displayLabels = [...labels].sort(() => 0.5 - Math.random()).slice(0, 3);

    // Build base URL for searches
    // We use a relative or absolute path based on siteUrl or default to /search/label/
    let baseSearchUrl = '/search/label/';
    if (siteUrl && siteUrl !== '/') {
        try {
            const urlObj = new URL(siteUrl);
            const lowerUrl = siteUrl.toLowerCase();

            if (lowerUrl.includes('youtube.com')) {
                baseSearchUrl = 'https://www.youtube.com/hashtag/';
            } else if (lowerUrl.includes('/wp-json')) {
                baseSearchUrl = `${urlObj.origin}/search/`;
            } else if (lowerUrl.includes('tumblr.com')) {
                baseSearchUrl = `${urlObj.origin}/tagged/`;
            } else if (lowerUrl.includes('mastodon.social')) {
                baseSearchUrl = `${urlObj.origin}/tags/`;
            } else if (lowerUrl.includes('bsky.app')) {
                baseSearchUrl = 'https://bsky.app/search?q=';
            } else if (lowerUrl.includes('deviantart.com')) {
                baseSearchUrl = 'https://www.deviantart.com/tag/';
            } else if (lowerUrl.includes('reddit.com')) {
                baseSearchUrl = 'https://www.reddit.com/search/?q=';
            } else {
                baseSearchUrl = `${urlObj.origin}/search/label/`;
            }
        } catch (e) {
            // If siteUrl is relative or malformed, just use the default
            baseSearchUrl = '/search/label/';
        }
    }

    const chipSize = config.chipSize;
    const paddingClass = { sm: 'px-1', md: 'px-2 py-1', lg: 'px-3 py-1' }[chipSize] || 'px-2 py-1';
    const labelsHTML = displayLabels.map(label => {
        const encodedLabel = encodeURIComponent(label);
        let displayString = label.startsWith('_') ? label.substring(1) : label;
        if (!displayString.startsWith('#')) {
            displayString = '#' + displayString;
        }
        return `<a aria-label="${label.replace(/"/g, '&quot;')}" class="shrink-0 relative z-50 pointer-events-auto inline-flex items-center justify-center rounded-full cursor-pointer ${config.chipUI} ${paddingClass} text-label-${chipSize} mr-2 mb-2 align-top" href="${baseSearchUrl}${encodedLabel}"><span>${displayString}</span></a>`;
    }).join('');

    return `
    <div class="relative z-50 pointer-events-auto max-w-full overflow-hidden">
        <div class="block max-w-full ${heightClass} overflow-hidden whitespace-normal">
            ${labelsHTML}
        </div>
    </div>`;
}
