import { BLOCK_COVER } from '../core/config.js';
export function renderBlockFooter(config, response) {
    if (config.moreText === "" && config.blockType === BLOCK_COVER) return '';
    let moreLinkHTML = '';
    if (config.moreText !== "") {
        if (response.feedUrl !== undefined) {
            let targetUrl = config.siteURL;
            if (config.contentType === 'label' || config.contentType === 'labels') {
                targetUrl = `${config.siteURL}search/label/${encodeURIComponent(config.labelName)}?max-results=9`;
            } else if (config.contentType === 'recent') {
                targetUrl = `${config.siteURL}search?max-results=9`;
            } else if (response.feedUrl) {
                targetUrl = response.feedUrl;
            }
            moreLinkHTML = `<a class="inline-block text-label-lg transition-opacity duration-300 opacity-50 hover:opacity-100" href="${targetUrl}" title="View all">
                            ${config.moreText} <svg class="inline-block align-text-bottom" fill="currentColor" height="1.2em" viewBox="0 0 16 16" width="1.2em" xmlns="http://www.w3.org/2000/svg"><use href="#icon-caret-right"></use></svg></a>`;
        }
    }
    return `<div class="st${config.stageID} mblox-footer w-full py-6 text-right">${moreLinkHTML}</div>`;
}
