export interface Post {
    id: number;
    title: string;
    summary?: string;
    content: string;
    tags?: Tag[];
    files?: File[];
}
export interface Tag {
    id: number;
    name: string;
}
export interface FileEntity {
    id: number;
    name: string;
    post: number;
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
    createPost({ title, summary, content, tags, files, }: Post): Promise<Response<Post>>;
    getPost(id: number): Promise<Response<Post>>;
    deletePost(id: number): Promise<Response<undefined>>;
    getTags(): Promise<Response<Tag[]>>;
    createTag(name: string): Promise<Response<Tag>>;
    getFiles(): Promise<Response<FileEntity[]>>;
    createFile(file: File, name: string, post: number): Promise<Response<FileEntity>>;
    deleteFile(id: number): Promise<Response<undefined>>;
    getFile(id: number): Promise<Response<FileEntity>>;
}
