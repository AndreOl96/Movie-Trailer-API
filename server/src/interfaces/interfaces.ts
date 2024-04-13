export interface IMovie {
    id: number;
    title: string;
    releaseDate: string;
    trailerLink: string;
    poster: string;
    genres: string[];
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: UserRole;
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}