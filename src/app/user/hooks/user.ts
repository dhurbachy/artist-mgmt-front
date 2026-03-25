import { useQuery } from "@tanstack/react-query";
import { AuthService, } from "@/services/artist-services";

export const useGetMe=()=>{

    return useQuery({
        queryKey:['me'],
        queryFn:()=>AuthService.authControllerGetMe(),
        staleTime:5*60*1000,
    })
}

// export const useGetUsers=()=>{
//     return useQuery({
//         queryKey:['allUser'],
//         queryFn:()=>
//     })
// }