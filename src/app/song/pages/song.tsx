import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal, Plus, Search, ChevronLeft, ChevronRight,
  Music2, ArrowLeft, Headphones,
} from "lucide-react";

type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

interface Song {
  id: number;
  artist_id: number;
  title: string;
  album_name: string;
  genre: Genre;
  created_at: string;
  updated_at: string;
}

const MOCK_SONGS: Song[] = [
  { id: 1, artist_id: 1, title: "Tum Hi Ho", album_name: "Aashiqui 2", genre: "rnb", created_at: "2013-04-26", updated_at: "2024-01-10" },
  { id: 2, artist_id: 1, title: "Ae Dil Hai Mushkil", album_name: "ADHM", genre: "classic", created_at: "2016-10-28", updated_at: "2024-01-11" },
  { id: 3, artist_id: 1, title: "Raabta", album_name: "Agent Sai Srinivasa", genre: "rnb", created_at: "2017-09-07", updated_at: "2024-01-12" },
  { id: 4, artist_id: 1, title: "Gerua", album_name: "Dilwale", genre: "country", created_at: "2015-12-15", updated_at: "2024-01-13" },
  { id: 5, artist_id: 1, title: "Channa Mereya", album_name: "Ae Dil Hai Mushkil", genre: "classic", created_at: "2016-10-28", updated_at: "2024-01-14" },
];

const GENRES: Genre[] = ["rnb", "country", "classic", "rock", "jazz"];

const genreConfig: Record<Genre, { label: string; badge: string }> = {
  rnb: { label: "R&B", badge: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  country: { label: "Country", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  classic: { label: "Classic", badge: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  rock: { label: "Rock", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
  jazz: { label: "Jazz", badge: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
};

const MOCK_ARTIST = { id: 1, name: "Arijit Singh" };

const EMPTY_FORM = { title: "", album_name: "", genre: "rnb" as Genre };

export default function Song() {
  const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<Genre | "all">("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const PAGE_SIZE = 4;
  const filtered = songs.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.album_name.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genreFilter === "all" || s.genre === genreFilter;
    return matchSearch && matchGenre;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.album_name.trim()) e.album_name = "Album name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => {
    setSelectedSong(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (song: Song) => {
    setSelectedSong(song);
    setForm({ title: song.title, album_name: song.album_name, genre: song.genre });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    const now = new Date().toISOString().split("T")[0];
    if (selectedSong) {
      setSongs((prev) =>
        prev.map((s) => s.id === selectedSong.id ? { ...s, ...form, updated_at: now } : s)
      );
    } else {
      setSongs((prev) => [...prev, {
        id: Date.now(), artist_id: MOCK_ARTIST.id, ...form,
        created_at: now, updated_at: now,
      }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    setSongs((prev) => prev.filter((s) => s.id !== selectedSong?.id));
    setDeleteDialogOpen(false);
  };

  const genreCounts: Record<string, number> = { all: songs.length };
  GENRES.forEach((g) => { genreCounts[g] = songs.filter((s) => s.genre === g).length; });

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
                <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Songs</h1>
                <span className="text-zinc-600 text-xs">—</span>
                <span className="text-sm text-zinc-400">{MOCK_ARTIST.name}</span>
              </div>
              <p className="text-xs text-zinc-500">{songs.length} tracks in collection</p>
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
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              genreFilter === "all"
                ? "bg-zinc-700 border-zinc-600 text-zinc-100"
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            }`}
          >
            All <span className="opacity-60">{genreCounts.all}</span>
          </button>
          {GENRES.map((g) => {
            const cfg = genreConfig[g];
            return (
              <button
                key={g}
                onClick={() => { setGenreFilter(g); setPage(1); }}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  genreFilter === g
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
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search songs or albums..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm focus:border-rose-500"
          />
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
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-zinc-600">No songs found</TableCell>
                </TableRow>
              ) : (
                paginated.map((song, idx) => {
                  const cfg = genreConfig[song.genre];
                  return (
                    <TableRow key={song.id} className="border-zinc-800/60 hover:bg-zinc-800/40 transition-colors group">
                      <TableCell className="py-3 px-4 text-zinc-600 text-sm font-mono">
                        {(page - 1) * PAGE_SIZE + idx + 1}
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
                      <TableCell className="text-zinc-500 text-xs">{song.created_at}</TableCell>
                      <TableCell className="text-zinc-500 text-xs">{song.updated_at}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300 w-36">
                            <DropdownMenuItem onClick={() => openEdit(song)} className="hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer text-sm">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedSong(song); setDeleteDialogOpen(true); }}
                              className="hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer text-sm"
                            >
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
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant="ghost" size="sm" onClick={() => setPage(p)} className={`h-7 w-7 text-xs ${page === p ? "bg-rose-600 text-white hover:bg-rose-500" : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"}`}>
                {p}
              </Button>
            ))}
            <Button variant="ghost" size="icon" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {selectedSong ? "Edit Song" : "Add New Song"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
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
              <Select value={form.genre} onValueChange={(v) => setForm({ ...form, genre: v as Genre })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g} className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">
                      {genreConfig[g].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm">Cancel</Button>
            <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-500 text-white h-8 text-sm shadow-lg shadow-rose-900/30">
              {selectedSong ? "Save Changes" : "Add Song"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Delete Song</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400 py-2">
            Remove <span className="text-zinc-100 font-medium">"{selectedSong?.title}"</span> permanently?
          </p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white h-8 text-sm">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}