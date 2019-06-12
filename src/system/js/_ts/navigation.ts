/**
 * The Navigation class
 * @class  Navigation
 */
export class Navigation {
    public static navigationItemClick(this: HTMLLIElement, event) {
        if (this.hasAttribute("aria-expanded")) {
            const $this = $(this);

            // Set the aria-expanded attribute
            const currentlyExpanded = $this.attr("aria-expanded") === "true";
            $this.attr("aria-expanded", (!currentlyExpanded).toString());

            // Find the direct child nav (child ul element), and add/remove the expanded/collapsed class
            const nav = event.data as Navigation;
            const $childNav = $this.find("> ul." + nav.childNavClass);
            if (currentlyExpanded) {
                $childNav.addClass(nav.childNavCollapsedClass);
                $childNav.removeClass(nav.childNavExpandedClass);
            } else {
                $childNav.addClass(nav.childNavExpandedClass);
                $childNav.removeClass(nav.childNavCollapsedClass);
            }
        }
    }

    private root: HTMLElement;
    private id: string;
    private format: string;
    private expandAllOnLoad: boolean;
    private itemClass: string;
    private currentItemClass: string;
    private currentItemAncestorClass: string;
    private linkClass: string;
    private currentLinkClass: string;
    private currentLinkAncestorClass: string;
    private childNavClass: string;
    private childNavExpandedClass: string;
    private childNavCollapsedClass: string;

    public constructor(
        id: string,
        format: string,
        expandAllOnLoad: boolean,
        itemClass: string,
        currentItemClass: string,
        currentItemAncestorClass: string,
        linkClass: string,
        currentLinkClass: string,
        currentLinkAncestorClass: string,
        childNavClass: string,
        childNavExpandedClass: string,
        childNavCollapsedClass: string) {

        this.id = id;
        this.root = document.getElementById(this.id) ||
            document.currentScript.ownerDocument.getElementById(this.id);
        this.format = format;
        this.expandAllOnLoad = expandAllOnLoad;
        this.itemClass = itemClass;
        this.currentItemClass = currentItemClass;
        this.currentItemAncestorClass = currentItemAncestorClass;
        this.linkClass = linkClass;
        this.currentLinkClass = currentLinkClass;
        this.currentLinkAncestorClass = currentLinkAncestorClass;
        this.childNavClass = childNavClass;
        this.childNavExpandedClass = childNavExpandedClass;
        this.childNavCollapsedClass = childNavCollapsedClass;

        // Register navigation item click event for tree navigation
        if (this.format === "tree") {
            $("li." + this.itemClass, this.root).on("click", this, Navigation.navigationItemClick);
            $("ul." + this.childNavClass, this.root).on("click", () => { event.stopPropagation(); });
        }
    }

    /**
     * Mark the current page in the navigation.  All ancestor items in the navigation are also marked.
     * For tree navigation, the tree is expanded and scrolled to the current item.
     */
    public markCurrentPage() {
        // Mark the current link and item within the navigation.
        const $currentLink = $('a[href="' + location.pathname + '"].' + this.linkClass, this.root);
        $currentLink.addClass(this.currentLinkClass);
        const $currentItem = $currentLink.closest("li." + this.itemClass, this.root);
        $currentItem.addClass(this.currentItemClass);

        // Mark all ancestor links and items within the navigation.
        const $parentLinks = $currentLink.parentsUntil(this.root, "a[href]." + this.linkClass);
        $parentLinks.addClass(this.currentLinkAncestorClass);
        const $parentItems = $currentItem.parentsUntil(this.root, "li." + this.itemClass);
        $parentItems.addClass(this.currentItemAncestorClass);

        // For tree navigation, expand the tree to the current item
        if (this.format === "tree") {
            if (this.expandAllOnLoad === false) {
                // Add aria-expanded=true to all parent navigation items (<li> elements)
                $parentItems.attr("aria-expanded", "true");

                // Find all parent child navs within the navigation
                const $parentChildNavs = $currentItem.parentsUntil(this.root, "ul." + this.childNavClass);
                $parentChildNavs.addClass(this.childNavExpandedClass);
                $parentChildNavs.removeClass(this.childNavCollapsedClass);
            }
            // Scroll to the current item.
        }
    }
}
