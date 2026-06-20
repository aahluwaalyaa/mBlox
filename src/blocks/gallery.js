import { renderImage } from '../components/image.js';
import { BLOCK_GALLERY } from '../core/config.js';

export function render(post, postID, config) {
    const finalType = BLOCK_GALLERY;

    const { imageCode } = renderImage(finalType, postID, config, {
        postSnippet: post.content,
        videoID: post.videoId,
        postTitle: post.title,
        thumbnailUrl: post.thumbnailUrl,
        authorImage: post.authorImage,
        post: post
    });

    // Link wrapper classes
    const linkClasses = ['block', 'relative', 'w-full', config.aspectRatio.trim()].filter(Boolean).join(' ');

    const overflowClass = config.cornerStyle.includes('rounded-none') ? '' : 'overflow-hidden';
        const articleClasses = `@container col-span-1 flex min-w-0 w-full h-full ${config.cornerStyle} ${overflowClass}`;
    return `<article class="${articleClasses}" role="article" itemscope itemtype="https://schema.org/Article"><div class="${linkClasses}"><a href="${post.url}" itemprop="url" class="absolute inset-0 z-10" aria-label="View ${post.title.replace(/"/g, '&quot;')}"></a>${config.showImage ? imageCode : ''}</div></article>`;
}

