import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetArtist, useDeleteArtist } from "../hooks/artist";

interface deleteArtistProps {
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    artistId?: string | null;
}
export default function DeleteArtist({ deleteDialogOpen, setDeleteDialogOpen, artistId }: deleteArtistProps) {
    const { data: artistData } = useGetArtist(artistId ?? '');
    const { mutate: deleteArtist } = useDeleteArtist();
    const handleDelete = () => {
        if (!artistId) return;
        deleteArtist(artistId, {
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
                        <DialogTitle className="text-base font-semibold">Delete Artist</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-zinc-400 py-2">
                        Are you sure you want to delete <span className="text-zinc-100 font-medium">{artistData?.name}</span>? This action cannot be undone.
                    </p>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white h-8 text-sm">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}