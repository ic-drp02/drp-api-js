export interface NewPost {
    title: string;
    summary?: string;
    content: string;
    tags?: string[];
}
export interface PostData {
    id: number;
    title: string;
    summary: string;
    content: string;
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
export interface Response<T> {
    success: boolean;
    status?: number;
    data?: T;
}
export default class ApiClient {
    baseUrl: string;
    constructor(baseUrl: string);
    getPosts(): Promise<Response<Post[]>>;
    createPost({ title, summary, content, tags, names, files, onUploadedFraction, }: PostData): Promise<Response<Post>>;
    getPost(id: number): Promise<Response<Post>>;
    deletePost(id: number): Promise<Response<never>>;
    getTags(): Promise<Response<Tag[]>>;
    createTag(name: string): Promise<Response<Tag>>;
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
    registerForNotifications(expo_token: string): Promise<Response<never>>;
    private getListResource;
    private createResource;
    private getResourceById;
    private deleteResource;
}
