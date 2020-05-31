export interface Post {
    id: number;
    title: string;
    summary?: string;
    content: string;
    tags?: Tag[];
}
export interface Tag {
    id: number;
    name: string;
}
export interface Response<T> {
    success: boolean;
    status?: number;
    data?: T;
}
export default class ApiClient {
    private baseUrl;
    constructor(baseUrl: string);
    getPosts(): Promise<Response<Post[]>>;
    createPost({ title, summary, content, tags, }: Post): Promise<Response<Post>>;
    getPost(id: number): Promise<Response<Post>>;
    deletePost(id: number): Promise<Response<undefined>>;
    getTags(): Promise<Response<Tag[]>>;
    createTag(name: string): Promise<Response<Tag>>;
}
