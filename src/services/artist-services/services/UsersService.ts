/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static userControllerCreate(
        requestBody: CreateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static userControllerFindAll(
        page: number,
        limit: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static userControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static userControllerUpdate(
        id: string,
        requestBody: UpdateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static userControllerRemove(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }
}
