export type RootElement = {
    tagName: string;
    id?: string;
    classes?: string[];
    attributes?: Record<string, string>;
    identifiedBy: 'id' | 'class' | 'attribute' | 'tagName';
}


