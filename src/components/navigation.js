import { BLOCK_COVER } from '../core/config.js';

export function renderNavigationControls(config, response) {
  if (!config.showNav) return '';

  const verticalOffset = (config.isCarousel && config.blockType !== BLOCK_COVER) ? "-mt-2" : "";
  const baseClass = `absolute top-1/2 -translate-y-1/2 ${verticalOffset} z-10 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full backdrop-blur-md cursor-pointer opacity-50 hover:opacity-100 ${config.chipUI}`;

  const isCarousel = config.isCarousel;
  const isOutside = config.navPosition === 'outside';
  const prevClass = isCarousel ? "js-carousel-prev" : "nav-prev";
  const nextClass = isCarousel ? "js-carousel-next" : "nav-next";

  const leftPos = isOutside ? "left-0" : "left-2";
  const rightPos = isOutside ? "right-0" : "right-2";

  const prevBtn = `<button class="${baseClass} ${leftPos} ${prevClass}" type="button" title="Previous" aria-label="Previous">
            <svg class='w-4 h-4' viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><use href="#icon-caret-left"></use></svg>
          </button>`;
  const nextBtn = `<button class="${baseClass} ${rightPos} ${nextClass}" title="Next" type="button" aria-label="Next">
            <svg class='w-4 h-4' viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><use href="#icon-caret-right"></use></svg>
          </button>`;

  if (isCarousel) {
    return `${prevBtn}${nextBtn}`;
  }

  const totalStages = response ? Math.ceil(response.totalResults / config.postsPerBlock) : 1;

  return [
    config.stageID > 1 ? prevBtn : '',
    config.stageID < totalStages ? nextBtn : ''
  ].join('');
}
