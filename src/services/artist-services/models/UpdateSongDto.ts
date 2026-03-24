/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateSongDto = {
    title?: string;
    album_name?: string;
    genre?: UpdateSongDto.genre;
};
export namespace UpdateSongDto {
    export enum genre {
        RNB = 'rnb',
        COUNTRY = 'country',
        CLASSIC = 'classic',
        ROCK = 'rock',
        JAZZ = 'jazz',
    }
}

