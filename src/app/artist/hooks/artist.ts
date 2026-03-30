import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ArtistService } from "@/services/artist-services";
import { CreateArtistDto } from "@/services/artist-services/models/CreateArtistDto";
import { UpdateArtistDto } from "@/services/artist-services/models/UpdateArtistDto";
import { toast } from "sonner";
import { handleApiError } from "@/services/handleError";
// GET /api/artist
export const useGetArtists = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["artists", page, limit],
    queryFn: () => ArtistService.artistControllerFindAll(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

// GET /api/artist/:id
export const useGetArtist = (id: string) => {
  return useQuery({
    queryKey: ["artists", id],
    queryFn: () => ArtistService.artistControllerFindOne(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// POST /api/artist
export const useCreateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateArtistDto) =>
      ArtistService.artistControllerCreate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success("Artist created successfully!");
    },
    onError: (error: ApiError) => handleApiError(error, "Create Failed"),
  });
};

// PATCH /api/artist/:id
export const useUpdateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateArtistDto) =>
      ArtistService.artistControllerUpdate(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["artists", variables.id] });
      toast.success("Artist updated successfully!");
    },
    onError: (error: ApiError) => handleApiError(error, "Update Failed"),
  });
};

// DELETE /api/artist/:id
export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ArtistService.artistControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success("Artist deleted successfully!");
    },
  });
};

// hooks/artist.ts

export const useImportArtists = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      ArtistService.artistControllerImportCsv({ file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success("Artists imported successfully!");
    },
    onError: (error: ApiError) => {
      // 1. Extract the main message (Check for NestJS/OpenAPI standard body)
      const message =
        error.body?.message || error.statusText || "Something went wrong.";

      // 2. Handle specific status codes if needed
      const title =
        error.status === 413
          ? "File Too Large"
          : error.status === 401
            ? "Unauthorized"
            : "Action Failed";

      // 3. Fire the toast
      toast.error(title, {
        description: Array.isArray(message)
          ? message[0] // If validation returns an array of strings, show the first one
          : message,
        // Optional: Add a button to retry or view details if the error is complex
        action:
          error.status >= 500
            ? {
                label: "Support",
                onClick: () => window.open("/support"),
              }
            : undefined,
      });

      console.error(`[API Error ${error.status}]:`, error.body);
    },
  });
};

export const useExportArtists = () => {
  return useMutation({
    mutationFn: async () => {
      const csvBlob = await ArtistService.artistControllerExportCsv();

      const url = URL.createObjectURL(
        new Blob([csvBlob], { type: "text/csv" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `artists_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });
};
