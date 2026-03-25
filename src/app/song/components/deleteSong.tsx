import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteSong } from "../hooks/song";

interface DeleteSongProps {
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    artistId?: string | null;
    songId?: string | null;
    songTitle?: string | null;  
}

export default function DeleteSong({
    deleteDialogOpen,
    setDeleteDialogOpen,
    artistId,
    songId,
    songTitle,
}: DeleteSongProps) {
    const { mutate: deleteSong, isPending } = useDeleteSong(artistId ?? "");

    const handleDelete = () => {
        if (!artistId || !songId) return;

        deleteSong(songId, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
            },
            onError: (err: any) => {
                console.error("Failed to delete song:", err);
            },
        });
    };

    return (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">Delete Song</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-zinc-400 py-2">
                    Remove{" "}
                    <span className="text-zinc-100 font-medium">"{songTitle ?? "this song"}"</span>{" "}
                    permanently? This action cannot be undone.
                </p>
                <DialogFooter className="gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={isPending}
                        className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-500 text-white h-8 text-sm"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}