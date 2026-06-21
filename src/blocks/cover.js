import { renderImage } from '../components/image.js';
import { renderCTA } from '../components/cta.js';
import { renderAuthor } from '../components/author.js';
import { renderDate } from '../components/date.js';
import { renderTitle } from '../components/title.js';
import { renderSnippet } from '../components/snippet.js';
import { renderLabels } from '../components/labels.js';
import { BLOCK_COVER } from '../core/config.js';

export function render(post, postID, config) {
    const finalType = BLOCK_COVER;

    // Render parts
    const authorCode = renderAuthor(finalType, config, post.authorName, post.authorUri);
    const dateCode = renderDate(finalType, config, post.publishedDate, post.updatedDate);
    const titleCode = renderTitle(finalType, config, post.title, post.url);
    const snippetCode = renderSnippet(finalType, config, post.content, post.url);
    const ctaButtonCode = renderCTA(finalType, config, post.title, post.url);
    const labelsCode = renderLabels(config, post.labels, config.siteURL);

    const { imageCode } = renderImage(finalType, postID, config, {
        postSnippet: post.content,
        videoID: post.videoId,
        postTitle: post.title,
        thumbnailUrl: post.thumbnailUrl,
        authorImage: post.authorImage,
        post: post
    });

    // Content container
    const hasText = Boolean(authorCode || dateCode || titleCode || snippetCode || ctaButtonCode || labelsCode);
    const wrapperUIClasses = (hasText && config.textVerticalAlign !== 'overlay') ? `${config.wrapperUI} backdrop-blur-xl ` : '';
    const textContentHTML = hasText ? `
        <div class="pointer-events-none flex flex-col items-center justify-center text-center w-full z-10 ${{
            top: 'absolute top-0 left-0 right-0 p-4 @sm:p-8',
            middle: 'absolute top-1/2 -translate-y-1/2 w-full p-4 @sm:p-8',
            bottom: 'absolute bottom-0 left-0 right-0 p-4 @sm:p-8',
            overlay: `w-full h-full inset-0 rounded-none`
        }[config.textVerticalAlign] || `w-full absolute top-1/2 -translate-y-1/2 p-4 @sm:p-8`
        }">
            <div class="${wrapperUIClasses}w-full max-w-3xl flex flex-col items-center gap-3 pointer-events-auto p-6 @sm:p-8 @md:px-12 ${config.textVerticalAlign === 'overlay' ? 'rounded-none h-full justify-center' : config.cornerStyle}">
                ${authorCode}
                ${(() => {
            if (dateCode && labelsCode) {
                return `<div class="flex flex-wrap items-center justify-center gap-4 w-full min-w-0"><div class="shrink-0 pointer-events-auto">${dateCode}</div><div class="min-w-0 max-w-full">${labelsCode}</div></div>`;
            } else if (dateCode) {
                return `<div class="flex justify-center w-full pointer-events-auto">${dateCode}</div>`;
            } else if (labelsCode) {
                return `<div class="flex justify-center w-full min-w-0">${labelsCode}</div>`;
            }
            return '';
        })()}
                ${titleCode}
                ${snippetCode}
                ${ctaButtonCode ? `<div class="mt-4">${ctaButtonCode}</div>` : ''}
            </div>
        </div>
    ` : '';

    // Block wrapper classes
    const blockClasses = ['relative', 'block', 'w-full', 'rounded-none', 'text-' + config.textHAlign, 'h-full', config.wrapperUI].filter(Boolean).join(' ');

    const articleStyle = config.articleHeight ? ` style="${config.articleHeight.replace(';', '')}"` : '';
    const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
    const articleClasses = `@container col-span-1 flex min-w-0 w-full relative h-full ${config.cornerStyle} ${overflowClass}`;

    let finalImageCode = config.showImage ? imageCode : '';
    if (!config.showHeader && !config.callToAction) {
        finalImageCode = `<a href="${post.url}" itemprop="url" class="absolute inset-0 z-10" aria-label="View ${post.title.replace(/"/g, '&quot;')}"></a>${imageCode}`;
    }

    return `<article class="${articleClasses}"${articleStyle} role="article" itemscope itemtype="https://schema.org/Article"><div class="${blockClasses}">${finalImageCode}${textContentHTML}</div></article>`;
}

