import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArtistService } from "@/services/artist-services";
import { CreateArtistDto } from "@/services/artist-services/models/CreateArtistDto";
import { UpdateArtistDto } from "@/services/artist-services/models/UpdateArtistDto";

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
    },
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
    },
  });
};

// DELETE /api/artist/:id
export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      ArtistService.artistControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
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
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
  });
};

export const useExportArtists = () => {
  return useMutation({
    mutationFn: async () => {
      const csvBlob = await ArtistService.artistControllerExportCsv();

      const url = URL.createObjectURL(new Blob([csvBlob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `artists_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });
};