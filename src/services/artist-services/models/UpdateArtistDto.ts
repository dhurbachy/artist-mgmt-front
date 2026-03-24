/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateArtistDto = {
    user_id?: string;
    name?: string;
    dob?: string;
    gender?: UpdateArtistDto.gender;
    address?: string;
    first_release_year?: number;
    no_of_albums_released?: number;
};
export namespace UpdateArtistDto {
    export enum gender {
        M = 'm',
        F = 'f',
        O = 'o',
    }
}

