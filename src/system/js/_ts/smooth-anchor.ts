
/**
 * The SmoothAnchor class enables smooth scrolling for anchors in the document
 * @class  SmoothAnchor
 */
export class SmoothAnchor {

    public static topOffsetSelector = "";
    public static additionalTopOffset = 0;
    public static smoothScrollDuration = 0;

    /**
     * Enable smooth scrolling for anchors in the document
     */
    public static enable(smoothScrollDuration: number, topOffsetSelector: string, additionalTopOffset: number) {
        SmoothAnchor.smoothScrollDuration = smoothScrollDuration;
        SmoothAnchor.topOffsetSelector = topOffsetSelector;
        SmoothAnchor.additionalTopOffset = additionalTopOffset;
        if (!SmoothAnchor.enabled) {
            SmoothAnchor.enabled = true;
            // If the current URL has hash, smooth scroll to the anchor
            if (location.hash) {
                const $target = $(
                    location.hash.lastIndexOf("#!", 0) === 0 ?
                    location.hash.replace("#!", "#") :
                    location.hash);
                if ($target.length) {
                    SmoothAnchor.smoothScrollTo($target[0], 100);
                }
            }
            // Select all links with hashes (remove links that don't actually link to anything),
            // and verwrite the default anchor click behavior
            $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').on("click", SmoothAnchor.anchorClick);
        }
    }

    public static isEnabled() {
        return SmoothAnchor.enabled;
    }

    private static enabled = false;

    private static anchorClick(this: HTMLAnchorElement, event) {
        if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
            location.hostname === this.hostname) {
            // Figure out element to scroll to
            let $target = $(this.hash);
            $target = $target.length ? $target : $("[name=' + this.hash.slice(1) + ']");
            // Does a scroll target exist?
            if ($target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                SmoothAnchor.smoothScrollTo($target[0], SmoothAnchor.smoothScrollDuration);
                // Add hash (#) to URL when done scrolling (default click behavior)
                if (history.pushState) {
                    history.pushState(null, null, this.hash);
                } else {
                    location.hash = this.hash.replace("#", "#!");
                }
            }
        }
    }

    private static smoothScrollTo(target: HTMLElement, duration: number) {
        let topOffset = this.additionalTopOffset;
        if (this.topOffsetSelector !== "" && $(this.topOffsetSelector).length) {
            topOffset += $(this.topOffsetSelector).height();
        }
        $("html, body").animate({
            scrollTop: $(target).offset().top - topOffset,
        }, duration, () => {
            // Callback after animation, and we must change focus.
            target.focus();
            // If the target somehow is not focused
            if (target !== document.activeElement) {
                // Adding tabindex for elements not focusable and set focus again.
                target.setAttribute("tabindex", "-1");
                target.focus();
            }
        });
    }

    private constructor() { /* noop */ }
}
