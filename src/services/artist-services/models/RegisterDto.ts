/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterDto = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    dob?: string;
    gender?: RegisterDto.gender;
    address?: string;
    role?: RegisterDto.role;
};
export namespace RegisterDto {
    export enum gender {
        M = 'm',
        F = 'f',
        O = 'o',
    }
    export enum role {
        SUPER_ADMIN = 'super_admin',
        ARTIST_MANAGER = 'artist_manager',
        ARTIST = 'artist',
    }
}

