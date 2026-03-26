import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  MoreHorizontal, Plus, Search, ChevronLeft, ChevronRight,
  Music2, ArrowLeft, Headphones,
} from "lucide-react";
import DeleteSong from "../components/deleteSong";
import CreateEditSong from "../components/createEditSong";
import { useGetAllSongs } from "../hooks/song";
import { useGetArtists } from "../../artist/hooks/artist";

type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

interface Song {
  id: string;
  artist_id: string;
  title: string;
  album_name: string;
  genre: Genre;
  created_at: string;
  updated_at: string;
}

const GENRES: Genre[] = ["rnb", "country", "classic", "rock", "jazz"];

const genreConfig: Record<Genre, { label: string; badge: string }> = {
  rnb: { label: "R&B", badge: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  country: { label: "Country", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  classic: { label: "Classic", badge: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  rock: { label: "Rock", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
  jazz: { label: "Jazz", badge: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
};

export default function Song() {
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<Genre | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const { data: artistsResponse } = useGetArtists(page,99);
  const artists = artistsResponse?.data ?? [];
  const firstArtist = artists[0] ?? null;
  const [selectedArtist, setSelectedArtist] = useState<string | null>(artists[0]?.id ?? null);

  const activeArtistId = selectedArtist ?? artists[0]?.id ?? "";

  const { data: songsResponse, isLoading } = useGetAllSongs(
    activeArtistId ?? "",
    page,
    10,
  );

  const songs: Song[] = songsResponse?.data ?? [];
  const total: number = songsResponse?.total ?? 0;
  const totalPages: number = songsResponse?.lastPage ?? 1;

  const filtered = songs.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.album_name.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genreFilter === "all" || s.genre === genreFilter;
    return matchSearch && matchGenre;
  });

  const genreCounts: Record<string, number> = { all: songs.length };
  GENRES.forEach((g) => { genreCounts[g] = songs.filter((s) => s.genre === g).length; });

  const openCreate = () => {
    setSelectedSong(null);
    setDialogOpen(true);
  };

  const openEdit = (song: Song) => {
    setSelectedSong(song);
    setDialogOpen(true);
  };

  const selectValue=artists.map((artist)=>({
    label: artist.name,
  value: artist.id,
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
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
                  {artists.find((item: any) => item.id === selectedArtist)?.name ?? 'Loading ...'}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{total} tracks in collection</p>
            </div>
          </div>
          <Button
            size="sm" onClick={openCreate}
            className="bg-rose-600 hover:bg-rose-500 text-white gap-2 h-8 text-xs shadow-lg shadow-rose-900/30"
          >
            <Plus className="w-3.5 h-3.5" /> Add Song
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Genre filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setGenreFilter("all"); setPage(1); }}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${genreFilter === "all"
              ? "bg-zinc-700 border-zinc-600 text-zinc-100"
              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
          >
            All <span className="opacity-60">{genreCounts.all}</span>
          </button>
          {GENRES.map((g) => {
            const cfg = genreConfig[g];
            return (
              <button key={g} onClick={() => { setGenreFilter(g); setPage(1); }}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${genreFilter === g
                  ? `${cfg.badge} border-current`
                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
              >
                {cfg.label} <span className="opacity-60">{genreCounts[g] || 0}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="grid grid-cols-2 gap-2">


          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search songs or albums..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm focus:border-rose-500"
            />

          </div>
          <div className="relative max-w-sm">
            {/* <Select onValueChange={(value) => { setSelectedArtist(value); console.log(value) }}>
              <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-zinc-100 h-9 text-sm focus:ring-rose-500">
                <SelectValue placeholder="Filter by Artist" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                {artists.map((item: any) => (
                  <SelectItem value={item.id}>{item?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Combobox
              items={selectValue}
              itemToStringValue={(selectValue) => selectValue.label}
              onValueChange={(selectValue)=>setSelectedArtist(selectValue.value)}
            >
              <ComboboxInput placeholder="Select a Artist" />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(framework) => (
                    <ComboboxItem key={framework.value} value={framework}>
                      {framework.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

          </div>
        </div>

        {/* Table */}
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
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-zinc-600">
                    No songs found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((song, idx) => {
                  const cfg = genreConfig[song.genre];
                  return (
                    <TableRow key={song.id} className="border-zinc-800/60 hover:bg-zinc-800/40 transition-colors group">
                      <TableCell className="py-3 px-4 text-zinc-600 text-sm font-mono">
                        {(page - 1) * limit + idx + 1}
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
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full border text-xs font-medium ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-xs">
                        {new Date(song.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-zinc-500 text-xs">
                        {new Date(song.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300 w-36">
                            <DropdownMenuItem onClick={() => openEdit(song)}
                              className="hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer text-sm">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedSong(song); setDeleteDialogOpen(true); }}
                              className="hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer text-sm">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing {total === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant="ghost" size="sm" onClick={() => setPage(p)}
                className={`h-7 w-7 text-xs ${page === p ? "bg-rose-600 text-white hover:bg-rose-500" : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"}`}>
                {p}
              </Button>
            ))}
            <Button variant="ghost" size="icon" disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <CreateEditSong
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        artistId={firstArtist?.id ?? null}
        songId={selectedSong?.id ?? null}
      />

      <DeleteSong
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        artistId={firstArtist?.id ?? null}
        songId={selectedSong?.id ?? null}
        songTitle={selectedSong?.title ?? null}
      />
    </div>
  );
}