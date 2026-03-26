import { useQuery } from "@tanstack/react-query";
import { AuthService,UsersService } from "@/services/artist-services";

export const useGetMe=()=>{

    return useQuery({
        queryKey:['me'],
        queryFn:()=>AuthService.authControllerGetMe(),
        staleTime:5*60*1000,
    })
}

export const useGetUsers=(page: number = 1, limit: number = 10)=>{
    return useQuery({
        queryKey:['allUser',page,limit],
        queryFn:()=>UsersService.userControllerFindAll(page,limit),
    })
}