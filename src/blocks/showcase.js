import { renderImage } from '../components/image.js';
import { renderCTA } from '../components/cta.js';
import { renderAuthor } from '../components/author.js';
import { renderDate } from '../components/date.js';
import { renderTitle } from '../components/title.js';
import { renderSnippet } from '../components/snippet.js';
import { renderLabels } from '../components/labels.js';
import { renderImageOverlay } from '../components/overlay.js';
import { BLOCK_SHOWCASE, noImg } from '../core/config.js';

import { getYouTubeVideoId, getVideoIcon } from '../components/video.js';

export function render(post, postID, config) {
    const finalType = BLOCK_SHOWCASE;
    const videoID = getYouTubeVideoId(post);

    // Render parts
    const titleCode = renderTitle(finalType, config, post.title, post.url);
    const snippetCode = renderSnippet(finalType, config, post.content, post.url);

    let snippetText = '';
    if (post.content) {
        const doc = new DOMParser().parseFromString(post.content, 'text/html');
        snippetText = doc.body.textContent || "";
        if (snippetText.length > config.snippetLines * 50) {
            snippetText = snippetText.substring(0, config.snippetLines * 50) + "...";
        }
        snippetText = snippetText.replace(/"/g, '&quot;');
    }

    const ctaButtonCode = renderCTA(finalType, config, post.title, post.url);

    const { imageCode, showcaseImageCode } = renderImage(finalType, postID, config, {
        postSnippet: post.content,
        videoID: videoID,
        postTitle: post.title,
        thumbnailUrl: post.thumbnailUrl,
        authorImage: post.authorImage,
        post: post
    });

    if (postID === 0 && config.firstInstance) {
        // Large feature block
        const cta = (config.showImage || config.callToAction !== "") ? ctaButtonCode : "";

        let showcaseContent = '';
        if (config.showHeader || cta || config.showLabels) {
            const dateCode = renderDate(finalType, config, post.publishedDate, post.updatedDate);
            const labelsCode = renderLabels(config, post.labels, config.siteURL);
            
            let dateAndLabels = '';
            if (dateCode && labelsCode) {
                dateAndLabels = `<div class="flex items-center gap-4 w-full"><div class="shrink-0 pointer-events-auto">${dateCode}</div><div class="min-w-0 flex-1">${labelsCode}</div></div>`;
            } else if (dateCode) {
                dateAndLabels = `<div class="w-full pointer-events-auto">${dateCode}</div>`;
            } else if (labelsCode) {
                dateAndLabels = `<div class="w-full min-w-0">${labelsCode}</div>`;
            }

            const hasHSContent = Boolean(dateAndLabels || titleCode || snippetCode);
            const hsCode = hasHSContent ? `<div class="flex-grow min-w-0 w-full max-w-3xl flex flex-col gap-3 text-${config.textHAlign}">${dateAndLabels}${titleCode} ${snippetCode}</div>` : '';
            const ctaAlignClass = config.ctaAlign === 'left' ? 'justify-start' : (config.ctaAlign === 'center' ? 'justify-center' : 'justify-end');

            const ctaWidth = hasHSContent ? 'w-full @md:w-auto' : 'w-full';
            const ctaCode = cta ? `<div class="flex-shrink-0 flex items-center ${ctaAlignClass} ${ctaWidth} pointer-events-none [&>a]:pointer-events-auto">${cta}</div>` : '';

            const hasTextContent = Boolean(titleCode || snippetCode || ctaCode);
            const wrapperClasses = (hasTextContent && (config.showHeader || config.showSnippet)) ? `${config.wrapperUI} backdrop-blur-xl pointer-events-auto ` : '';
            showcaseContent = `<div class="absolute inset-0 flex flex-col justify-end p-0 z-10 pointer-events-none w-full overflow-hidden"><div class="sContent w-full flex flex-col @md:flex-row items-start @md:items-center justify-between gap-4 @md:gap-6 p-2 @xs:p-4 @sm:px-12 ${wrapperClasses}pointer-events-none">${hsCode}${ctaCode}</div></div>`;
        }

        const linkWrapper = `<a href="${post.url}" itemprop="url" class="absolute inset-0 z-10" title="${post.title.replace(/"/g, '&quot;')}" aria-label="View ${post.title.replace(/"/g, '&quot;')}"></a>`;

        return `<div class="@container feature-image w-full ${config.aspectRatio.trim()} relative flex flex-col text-${config.textHAlign} overflow-hidden ${config.cornerStyle}" style="${config.articleHeight.replace(';', '')}" itemscope itemtype="https://schema.org/Article"><div class="sIframe hidden absolute inset-0 w-full h-full z-10"></div>${linkWrapper}${showcaseImageCode}<div class="${config.palette.text} block absolute inset-0 z-40 pointer-events-none">${showcaseContent}</div></div>`;
    }

    // Showcase grid post
    const videoAttr = (videoID && videoID !== 'noVideo') ? ` data-vidid="${videoID}"` : '';
    const ringClasses = (postID === 0 && config.firstInstance) ? ' ring-4 ring-inset' : '';
    const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
    const articleClasses = `@container col-span-1 flex min-w-0 w-full h-full sPost cursor-pointer relative ${ringClasses} ${config.cornerStyle} ${overflowClass}`;
    let imageHigh = noImg;
    if (videoID && videoID !== 'noVideo') imageHigh = `https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg`;
    else if (post.thumbnailUrl) imageHigh = post.thumbnailUrl.replace(/\/s\d+(-[a-z]\d+)*(-c)?/, '/s1600');

    const escapedTitle = post.title.replace(/"/g, '&quot;');
    const articleDataAttributes = `data-title="${escapedTitle}" data-link="${post.url}" data-summary="${snippetText}"${videoAttr} data-img-high="${imageHigh}" data-toggle="tooltip"`;

    return `<article class="${articleClasses}" ${articleDataAttributes} role="article" itemscope itemtype="https://schema.org/Article" title="${escapedTitle}">${config.showImage ? imageCode : ''}</article>`;
}

export function renderThumbnail(post, config) {
    const videoID = getYouTubeVideoId(post);
    let thumbnailUrl = post.thumbnailUrl || noImg;
    let highResUrl = thumbnailUrl;

    if (videoID && videoID !== 'noVideo' && highResUrl.includes('ytimg.com')) {
        highResUrl = highResUrl.replace(/\/([^\/]+)$/, '/maxresdefault.jpg');
    } else {
        highResUrl = highResUrl.replace(/\/s\d+(-c)?/, '/s1600').replace(/\/w\d+-h\d+(-c)?/, '/s1600');
    }

    const snippetText = (post.content || "").replace(/<[^>]*>/g, "").substring(0, config.snippetLines * 50) + "...";
    if (!thumbnailUrl || thumbnailUrl.includes('no-image.png')) thumbnailUrl = noImg;
    if (!highResUrl || highResUrl.includes('no-image.png')) highResUrl = noImg;

    const lazyLoadClass = config.isBloggerFeed ? ' m-blox-image-to-load' : '';
    const videoAttr = videoID !== 'noVideo' ? ` data-vidid="${videoID}"` : '';
    const articleDataAttributes = `data-title="${post.title}" data-link="${post.url}" data-summary="${snippetText}"${videoAttr} data-toggle="tooltip"`;
    const filterClass = config.imageFilter ? ` ${config.imageFilter}` : '';
    const imageTag = `<img itemprop="image" class="w-full h-full object-cover${lazyLoadClass}${filterClass}" src="${thumbnailUrl}" data-img-high="${highResUrl}" alt="${post.title.replace(/"/g, '&quot;')}" loading="lazy" title="${post.title.replace(/"/g, '&quot;')}" />`;
    const youtubeIcon = getVideoIcon(videoID);
    const overlayCode = renderImageOverlay(post, config);
    const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
    const figureTag = `<figure class="w-full ${config.aspectRatio.trim()} relative">${imageTag}${overlayCode}${youtubeIcon}</figure>`;

    return `<article class="col-span-1 flex min-w-0 w-full h-full sPost cursor-pointer relative ${config.cornerStyle} ${overflowClass}" ${articleDataAttributes} title="${post.title.replace(/"/g, '&quot;')}" role="article" itemscope itemtype="https://schema.org/Article">${figureTag}</article>`;
}

