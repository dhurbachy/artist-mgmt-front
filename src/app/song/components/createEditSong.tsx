import { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSong, useUpdateSong, useGetSong } from "../hooks/song";
import { useGetArtists } from "@/app/artist/hooks/artist";
import { CreateSongDto } from "@/services/artist-services";
type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

const GENRES: Genre[] = ["rnb", "country", "classic", "rock", "jazz"];

const genreConfig: Record<CreateSongDto.genre, { label: string }> = {
    [CreateSongDto.genre.RNB]: { label: "rnb" },
    [CreateSongDto.genre.COUNTRY]: { label: "country" },
    [CreateSongDto.genre.CLASSIC]: { label: "classic" },
    [CreateSongDto.genre.ROCK]: { label: "rock" },
    [CreateSongDto.genre.JAZZ]: { label: "jazz" },
};

const initialForm = {
    title: "",
    album_name: "",
    genre: "rnb" as Genre,
    artist_id: "",
};

interface CreateEditSongProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    artistId?: string | null;
    songId?: string | null;
}

export default function CreateEditSong({
    dialogOpen,
    setDialogOpen,
    artistId,
    songId,
}: CreateEditSongProps) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: songData } = useGetSong(artistId ?? '', songId ?? "");
    const { data: artists } = useGetArtists();
    const { mutate: createSong } = useCreateSong();
    const { mutate: updateSong } = useUpdateSong(artistId ?? '');

    // Populate form when editing
    // ✅ Populate form when editing
    useEffect(() => {
        if (songId && songData) {
            setForm({
                title: songData.title ?? "",
                album_name: songData.album_name ?? "",
                genre: (songData.genre as Genre) ?? "rnb",
                artist_id: artistId ?? "",  
            });
        } else if (!songId) {
            setForm({ ...initialForm, artist_id: artistId ?? "" });
            setErrors({});
        }
    }, [songId, songData, artistId]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
         if (!form.artist_id) newErrors.artist_id = "Please select an artist";
        if (!form.title.trim()) newErrors.title = "Song title is required";
        if (!form.album_name.trim()) newErrors.album_name = "Album name is required";
        if (!form.genre) newErrors.genre = "Please select a genre";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        if (songId && artistId) {
            updateSong(
                {
                    songId,
                    title: form.title,
                    album_name: form.album_name,
                    genre: form.genre,
                },
                {
                    onSuccess: () => {
                        setDialogOpen(false);
                        setForm(initialForm);
                        setErrors({});
                    },
                    onError: (err: any) => {
                        setErrors(err.response?.data?.errors || { title: "Something went wrong" });
                    },
                }
            );
        } else {
            // ✅ CREATE — artist_id goes in body, rest is DTO
            createSong(
                {
                    title: form.title,
                    album_name: form.album_name,
                    genre: form.genre,
                    artist_id: form.artist_id,
                },
                {
                    onSuccess: () => {
                        setDialogOpen(false);
                        setForm(initialForm);
                        setErrors({});
                    },
                    onError: (err: any) => {
                        setErrors(err.response?.data?.errors || { title: "Something went wrong" });
                    },
                }
            );
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        {songId ? "Edit Song" : "Add New Song"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Artist</Label>
                        <Select
                            value={form.artist_id}
                            onValueChange={(v) => setForm({ ...form, artist_id: v })}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm">
                                <SelectValue placeholder="Select an artist" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                {artists?.data?.map((a) => (
                                    <SelectItem
                                        key={a.id} value={a.id}
                                        className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                                    >
                                        {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         {errors.artist_id &&<p className="text-xs text-red-400">{errors.artist_id}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Song Title</Label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-rose-500"
                            placeholder="e.g. Tum Hi Ho"
                        />
                        {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Album Name</Label>
                        <Input
                            value={form.album_name}
                            onChange={(e) => setForm({ ...form, album_name: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-rose-500"
                            placeholder="e.g. Aashiqui 2"
                        />
                        {errors.album_name && <p className="text-xs text-red-400">{errors.album_name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Genre</Label>
                        <Select
                            value={form.genre}
                            onValueChange={(v) => setForm({ ...form, genre: v as Genre })}
                        >
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                {GENRES.map((g) => (
                                    <SelectItem
                                        key={g} value={g}
                                        className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                                    >
                                        {genreConfig[g].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.genre && <p className="text-xs text-red-400">{errors.genre}</p>}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setDialogOpen(false)}
                        className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-rose-600 hover:bg-rose-500 text-white h-8 text-sm shadow-lg shadow-rose-900/30"
                    >
                        {songId ? "Save Changes" : "Add Song"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}