import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetUser,useDeleteUser } from "../hooks/user";
interface deleteUserProps {
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    id?: string;
}
export default function DeleteUser({ deleteDialogOpen, setDeleteDialogOpen, id }:deleteUserProps) {
    const {data:userData}=useGetUser(id??'');
    const {mutate:deleteUser}=useDeleteUser();


    const handleDelete = () => {
        if (!id) return;
        deleteUser(id, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
            },
            onError: (error) => {
                console.error("Delete failed:", error);
            }
        });
    };
    return (
        <>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold">Delete User</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-zinc-400 py-2">
                        Remove <span className="text-zinc-100 font-medium">{userData?.first_name} {userData?.last_name}</span> permanently?
                    </p>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm">Cancel</Button>
                        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white h-8 text-sm">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>        </>
    )
}