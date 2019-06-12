export class SearchResult {
    public type: string;
    public url: string;
    public title: string;
    public excerpt: string;

    public constructor(type: string, url: string, title: string, excerpt: string) {
        this.type = type;
        this.url = url;
        this.title = title;
        this.excerpt = excerpt;
    }
}
