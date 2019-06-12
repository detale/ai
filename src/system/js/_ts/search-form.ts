import "custom-event-polyfill";

/**
 * The SearchForm class
 * @class  SearchForm
 */
export class SearchForm {

    public static readonly SEARCH_EVENT_NAME: string = "jify.search";
    public static readonly SEARCH_COMPLETE_EVENT_NAME: string = "jify.searchcomplete";
    public static readonly SEARCH_RESET_EVENT_NAME: string = "jify.searchreset";

    public readonly searchField: HTMLInputElement;
    public readonly searchResultContainer: HTMLDivElement;

    protected id: string;
    protected root: HTMLElement;
    protected searchTrigger: SearchTrigger;
    protected minCharsToSearch: number;

    public constructor(
        id: string,
        searchFieldId: string,
        searchResultContainerId: string,
        searchTrigger: SearchTrigger,
        minCharsToSearch: number = 1) {

        this.id = id;
        this.root = (document.getElementById(id) ||
            document.currentScript.ownerDocument.getElementById(id)) as HTMLElement;
        this.searchField = (document.getElementById(searchFieldId) ||
            document.currentScript.ownerDocument.getElementById(searchFieldId)) as HTMLInputElement;
        this.searchResultContainer = (document.getElementById(searchResultContainerId) ||
            document.currentScript.ownerDocument.getElementById(searchResultContainerId)) as HTMLDivElement;
        this.searchTrigger = searchTrigger;
        this.minCharsToSearch = (minCharsToSearch > 0) ? minCharsToSearch : 1;

        // Trigger the "search" custom event based on the provided search trigger option
        $(this.searchField).on("search", () => { this.dispatchSearchEvent(); });
        switch (this.searchTrigger) {
            case SearchTrigger.StopTyping: {
                let timeout = null;
                $(this.searchField).on("keyup", () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        this.dispatchSearchEvent();
                    }, 500);
                });
                break;
            }
            case SearchTrigger.KeyUp: {
                $(this.searchField).on("keyup", () => { this.dispatchSearchEvent(); });
                break;
            }
            case SearchTrigger.PressEnter: {
                $(this.searchField).on("keyup", () => {
                    if (this.searchField.value.length === 0) {
                        this.dispatchSearchEvent();
                    }
                });
                break;
            }
        }
    }

    protected dispatchSearchEvent() {
        const s = this.searchField.value;
        if (s.length >= this.minCharsToSearch) {
            this.root.dispatchEvent(
                new CustomEvent(SearchForm.SEARCH_EVENT_NAME, {
                    bubbles: true,
                    detail: {
                        query: s,
                    },
                }),
            );
        } else if (s.length === 0) {
            this.root.dispatchEvent(new CustomEvent(SearchForm.SEARCH_RESET_EVENT_NAME));
        }
    }

    public set onsearch(listener: (this: HTMLElement, e: CustomEvent) => any) {
        this.root.addEventListener(SearchForm.SEARCH_EVENT_NAME, listener);
    }

    public set onsearchcomplete(listener: (this: HTMLElement, e: CustomEvent) => any) {
        this.root.addEventListener(SearchForm.SEARCH_COMPLETE_EVENT_NAME, listener);
    }

    public set onsearchreset(listener: (this: HTMLElement, e: CustomEvent) => any) {
        this.root.addEventListener(SearchForm.SEARCH_RESET_EVENT_NAME, listener);
    }
}

export enum SearchTrigger {
    StopTyping,
    KeyUp,
    PressEnter,
}
