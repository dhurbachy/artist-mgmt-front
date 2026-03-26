/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserDto = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    /**
     * ISO8601 Date string
     */
    dob?: string;
    gender?: CreateUserDto.gender;
    address?: string;
    role?: CreateUserDto.role;
};
export namespace CreateUserDto {
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

