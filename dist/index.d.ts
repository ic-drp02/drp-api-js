export interface NewPost {
    id: number;
    title: string;
    summary: string;
    content: string;
    is_guideline?: boolean;
    updates?: number;
    tags?: Tag[];
    files?: File[];
    names?: string[];
    onUploadedFraction?: Function;
}
export interface Post {
    id: number;
    title: string;
    summary: string;
    content: string;
    is_guideline: boolean;
    is_current: boolean;
    revision_id: number;
    created_at: string;
    tags: Tag[];
    files: File[];
}
export interface Search {
    searched: string;
    page?: number;
    results_per_page?: number;
    guidelines_only?: boolean;
    include_old?: boolean;
    tag?: string;
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
export interface FileWithPost {
    file: FileEntity;
    post: Post;
}
export interface NewQuestion {
    site: string;
    grade: Grade;
    specialty: string;
    questions: {
        subject: string;
        text: string;
    }[];
}
export interface Question {
    id: number;
    site: Site;
    grade: Grade;
    specialty: string;
    subject: Subject;
    text: string;
}
export interface Site {
    id: number;
    name: string;
}
export declare enum Grade {
    Consultant = "consultant",
    SpR = "spr",
    CoreTrainee = "core_trainee",
    FY2 = "fy2",
    FY1 = "fy1",
    FiY1 = "fiy1"
}
export interface Subject {
    id: number;
    name: string;
}
export declare type UserRole = "user" | "admin";
export interface Token {
    id: number;
    token: string;
    role: UserRole;
    expires: number;
}
export interface User {
    id: number;
    email: string;
    role: UserRole;
    confirmed: boolean;
}
export interface Error {
    type?: string;
    message?: string;
}
export interface Response<T, E = Error> {
    success: boolean;
    status?: number;
    data?: T;
    error?: E;
}
export default class ApiClient {
    baseUrl: string;
    private token?;
    constructor(baseUrl: string);
    setAuthToken(token?: string): void;
    authenticate(email: string, password: string): Promise<Response<Token>>;
    registerUser(email: string, password: string): Promise<Response<never>>;
    getUsers(): Promise<Response<User[]>>;
    getUser(id: number): Promise<Response<User>>;
    updateUser(id: number, model: {
        password?: string;
        role?: UserRole;
    }): Promise<Response<User>>;
    deleteUser(id: number): Promise<Response<User>>;
    addAttributes(tag?: number, include_old?: boolean, per_page?: number, page?: number): string;
    getPosts(tag?: number, include_old?: boolean, per_page?: number, page?: number): Promise<Response<Post[]>>;
    getMultiplePosts(ids: number[]): Promise<Response<Post[]>>;
    getGuidelines(tag?: number, include_old?: boolean): Promise<Response<Post[]>>;
    getRevisions(id: number, reverse?: boolean): Promise<Response<Post[]>>;
    createPost({ title, summary, content, is_guideline, updates, tags, names, files, onUploadedFraction, }: NewPost): Promise<Response<Post>>;
    getPost(id: number): Promise<Response<Post>>;
    deletePost(id: number): Promise<Response<never>>;
    deleteRevision(id: number): Promise<Response<never>>;
    searchPosts({ searched, page, results_per_page, guidelines_only, include_old, tag, }: Search): Promise<Response<Post[]>>;
    getTags(): Promise<Response<Tag[]>>;
    createTag(name: string): Promise<Response<Tag>>;
    deleteTag(id: number): Promise<Response<never>>;
    renameTag(id: number, name: string): Promise<Response<Tag>>;
    getFiles(): Promise<Response<FileEntity[]>>;
    createFile(file: File, name: string, post: number): Promise<Response<FileEntity>>;
    deleteFile(id: number): Promise<Response<undefined>>;
    getFile(id: number): Promise<Response<FileEntity>>;
    getSites(): Promise<Response<Site[]>>;
    createSite(name: string): Promise<Response<Site>>;
    deleteSite(id: number): Promise<Response<never>>;
    getQuestionSubjects(): Promise<Response<Subject[]>>;
    createQuestionSubject(name: string): Promise<Response<Subject>>;
    deleteQuestionSubject(id: number): Promise<Response<never>>;
    getQuestions(): Promise<Response<Question[]>>;
    getQuestion(id: number): Promise<Response<Question>>;
    createQuestions(question: NewQuestion): Promise<Response<Question>>;
    deleteQuestion(id: number): Promise<Response<never>>;
    updateQuestion(id: number, text: string): Promise<Response<Question>>;
    resolveQuestion(id: number): Promise<Response<Question>>;
    registerForNotifications(expo_token: string): Promise<Response<never>>;
    private getListResource;
    private createResource;
    private getResourceById;
    private deleteResource;
}
