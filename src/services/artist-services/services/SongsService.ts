/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSongDto } from '../models/CreateSongDto';
import type { UpdateSongDto } from '../models/UpdateSongDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SongsService {
    /**
     * @param artistId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static songsControllerCreate(
        artistId: string,
        requestBody: CreateSongDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/artists/{artistId}/songs',
            path: {
                'artistId': artistId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param artistId
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static songsControllerFindAll(
        artistId: string,
        page: number,
        limit: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/artists/{artistId}/songs',
            path: {
                'artistId': artistId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param artistId
     * @param songId
     * @returns any
     * @throws ApiError
     */
    public static songsControllerFindOne(
        artistId: string,
        songId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/artists/{artistId}/songs/{songId}',
            path: {
                'artistId': artistId,
                'songId': songId,
            },
        });
    }
    /**
     * @param artistId
     * @param songId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static songsControllerUpdate(
        artistId: string,
        songId: string,
        requestBody: UpdateSongDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/artists/{artistId}/songs/{songId}',
            path: {
                'artistId': artistId,
                'songId': songId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param artistId
     * @param songId
     * @returns any
     * @throws ApiError
     */
    public static songsControllerRemove(
        artistId: string,
        songId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/artists/{artistId}/songs/{songId}',
            path: {
                'artistId': artistId,
                'songId': songId,
            },
        });
    }
}
