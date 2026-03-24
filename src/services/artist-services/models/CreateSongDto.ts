/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSongDto = {
    title: string;
    album_name?: string;
    genre?: CreateSongDto.genre;
};
export namespace CreateSongDto {
    export enum genre {
        RNB = 'rnb',
        COUNTRY = 'country',
        CLASSIC = 'classic',
        ROCK = 'rock',
        JAZZ = 'jazz',
    }
}

