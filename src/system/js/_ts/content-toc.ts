import { SmoothAnchor } from "./smooth-anchor";

/**
 * The ContentTOC class
 * @class  ContentTOC
 */
export class ContentTOC {

    // ID of the Content TOC
    public id: string;

    // CSS class applied to highlighted anchor in Content TOC
    private highlightClass = "active";

    // Indicate whether the scroll highlight feature is enabled on the Content TOC or not.
    private scrollHighlightEnabled = false;

    // Headings linked by the Content TOC
    private headings: HTMLHeadingElement[];

    // Anchors in the Content TOC that link to the Headings
    private anchors: HTMLAnchorElement[];

    public constructor(
        id: string,
        contentId?: string,
        minHeading?: number,
        maxHeading?: number) {
        this.id = id;

        // Generate the content TOC from content
        if (contentId) {
            // TODO:
        } else {
            // If the Content TOC is already there, grab the headings and anchors
            this.anchors = $("#" + this.id + ' a[href*="#"]').not('[href="#"]').not('[href="#0"]')
                .toArray() as HTMLAnchorElement[];
            this.headings = [];
            for (const anchor of this.anchors) {
                this.headings.push.apply(this.headings,
                    $(anchor.hash).filter(":header").toArray() as HTMLHeadingElement[]);
            }
        }
    }

    /**
     * Enable the scroll highlight feature for the current Content TOC
     */
    public enableScrollHighlight(highlightClass?: string) {
        if (highlightClass) {
            this.highlightClass = highlightClass;
        }

        if (!this.scrollHighlightEnabled) {
            this.scrollHighlightEnabled = true;
            // Register the scroll event
            $(window).scroll(() => {
                for (const heading of this.headings) {
                    const position = heading.getBoundingClientRect().top;
                    if (position > 0 && position < 200) {
                        this.highlightHeadingAnchor("#" + heading.id);
                        break;
                    }
                }
            });

            // Register the anchor click event. When an anchor is clicked, the anchor gets highlighted.
            $(this.anchors).on("click", this, function(this: HTMLAnchorElement, event) {
                const toc = event.data as ContentTOC;
                if (SmoothAnchor.isEnabled()) {
                    setTimeout(() => { toc.highlightHeadingAnchor(this.hash); },
                        SmoothAnchor.smoothScrollDuration + 10);
                } else {
                    toc.highlightHeadingAnchor(this.hash);
                }
            });
        }
    }

    private highlightHeadingAnchor(hash: string) {
        for (const anchor of this.anchors) {
            if (anchor.hash === hash) {
                anchor.classList.add(this.highlightClass);
            } else {
                anchor.classList.remove(this.highlightClass);
            }
        }
    }
}
