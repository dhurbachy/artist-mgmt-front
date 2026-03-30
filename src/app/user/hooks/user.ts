import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService, UsersService } from "@/services/artist-services";
import type { ApiError, CreateUserDto, UpdateUserDto } from "@/services/artist-services";
import { handleApiError } from "@/services/handleError";
import { toast } from "sonner";
export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => AuthService.authControllerGetMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["allUser", page, limit],
    queryFn: () => UsersService.userControllerFindAll(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["allUser", id],
    queryFn: () => UsersService.userControllerFindOne(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (id: string) => UsersService.userControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUser"] });
      toast.success("User deleted successfully!");
    },
    onError: (error: ApiError) => handleApiError(error, "Delete Failed"),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: (data: CreateUserDto) =>
      UsersService.userControllerCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUser"] });
      toast.success("User created successfully!");
    },
    onError: (error: ApiError) => handleApiError(error, "Creation Failed"),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      UsersService.userControllerUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUser"] });
      toast.success("User updated successfully!");
      // queryClient.invalidateQueries({ queryKey: ['allUser', variables.id] });
    },
    onError: (error: ApiError) => handleApiError(error, "Update Failed"),
  });
};
