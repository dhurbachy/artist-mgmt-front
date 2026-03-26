import { useParams, useNavigate } from "react-router";
import { useGetAllSongs } from "@/app/song/hooks/song";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {Music2,
    ArrowLeft, Headphones,
} from "lucide-react";
export default function ArtistSongs() {
    const navigate = useNavigate();
    const { artistId } = useParams();
    const { data: songs,isLoading } = useGetAllSongs(artistId ?? '');
    console.log(songs);
    return (
        <>
            <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
                {/* Header */}
                <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                                onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="w-px h-6 bg-zinc-800" />
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg shadow-rose-900/40">
                                <Headphones className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-semibold tracking-tight text-zinc-100">Songs</h4>
                                    <span className="text-zinc-600 text-xs">—</span>
                                    <span className="text-sm text-zinc-400">
                                        {/* {artists.find((item:any)=>item.id===selectedArtist)?.name??'Loading ...'} */}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500">{songs?.total} tracks in collection</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-500 text-xs font-medium py-3 px-4 w-10">#</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-medium">Title</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-medium">Album</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-medium">Genre</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-medium">Added</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-medium">Updated</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-medium w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-16 text-zinc-600">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                songs?.data.map((song, idx) => {
                                    return (
                                        <TableRow key={song.id} className="border-zinc-800/60 hover:bg-zinc-800/40 transition-colors group">
                                            <TableCell className="py-3 px-4 text-zinc-600 text-sm font-mono">
                                                {/* {(page - 1) * PAGE_SIZE + idx + 1} */}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-orange-600/20 border border-rose-500/20 flex items-center justify-center">
                                                        <Music2 className="w-3.5 h-3.5 text-rose-400" />
                                                    </div>
                                                    <span className="text-sm font-medium text-zinc-100">{song.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-zinc-400 text-sm">{song.album_name}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-xs font-medium 
                                                    `}
                                                    >
                                                    {/* {cfg.label} */}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-zinc-500 text-xs">
                                                {new Date(song.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-zinc-500 text-xs">
                                                {new Date(song.updated_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                               
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}