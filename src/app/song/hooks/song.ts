import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, SongsService } from "@/services/artist-services";
import { CreateSongDto } from "@/services/artist-services/models/CreateSongDto";
import { UpdateSongDto } from "@/services/artist-services/models/UpdateSongDto";
import { toast } from "sonner";
import { handleApiError } from "@/services/handleError";

// GET /api/artists/:artistId/songs
export const useGetAllSongs = (artistId: string, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["songs", artistId, page, limit], // ✅ artistId in key so cache is per-artist
        queryFn: () => SongsService.songsControllerFindAll(artistId, page, limit),
        enabled: !!artistId,                        // ✅ don't fetch without artistId
        staleTime: 5 * 60 * 1000,
    });
};

// GET /api/artists/:artistId/songs/:songId
export const useGetSong = (artistId: string, songId: string) => {
    return useQuery({
        queryKey: ["songs", artistId, songId],
        queryFn: () => SongsService.songsControllerFindOne(artistId, songId),
        enabled: !!artistId && !!songId,           
        staleTime: 0,                              
    });
};

// POST /api/artists/:artistId/songs
export const useCreateSong = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ artist_id, ...formData }: CreateSongDto & { artist_id: string }) =>
            SongsService.songsControllerCreate(artist_id, {
                // ✅ Explicitly pass only what the DTO expects — nothing extra
                title: formData.title,
                album_name: formData.album_name,
                genre: formData.genre,
            } as CreateSongDto),
            
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ 
                queryKey: ["songs", variables.artist_id] 
            });
            toast.success("Song created successfully!");
        },
        onError: (error: ApiError) => handleApiError(error, "Failed to create song"),
    });
};


// PATCH /api/artists/:artistId/songs/:songId
export const useUpdateSong = (artistId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ songId, ...payload }: { songId: string } & UpdateSongDto) =>
            SongsService.songsControllerUpdate(artistId, songId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["songs", artistId] });
            queryClient.invalidateQueries({ queryKey: ["songs", artistId, variables.songId] });
            toast.success("Song updated successfully!");
        },
        onError: (error: ApiError) => handleApiError(error, "Update Failed"),
    });
};

// DELETE /api/artists/:artistId/songs/:songId
export const useDeleteSong = (artistId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (songId: string) =>
            SongsService.songsControllerRemove(artistId, songId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["songs", artistId] });
            toast.success("Song deleted successfully!");
        },
        onError: (error: ApiError) => handleApiError(error, "Delete Failed"),
    });
};