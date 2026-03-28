import { useState, useRef } from "react";
import { useGetArtists, useImportArtists, useExportArtists } from "../hooks/artist"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  Download,
  Music,
  User,
  Disc,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import CreateArtist from "../components/createArtist";
import DeleteArtist from "../components/deleteArtist";
import { ROUTES } from "@/routes/routeConstant";
import { useNavigate } from "react-router";
const GENDERS = ["m", "f", "o"] as const;
type Gender = (typeof GENDERS)[number];

interface Artist {
  id: string;
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: string;
}

const genderLabel: Record<Gender, string> = { m: "Male", f: "Female", o: "Other" };
const genderColor: Record<Gender, string> = {
  m: "bg-blue-100 text-blue-700 border-blue-200",
  f: "bg-pink-100 text-pink-700 border-pink-200",
  o: "bg-amber-100 text-amber-700 border-amber-200",
};



export default function Artist() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data: artistsResponse } = useGetArtists(page, 10);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const limit = 10;
  const openCreate = () => {
    setSelectedArtist(null);

    setDialogOpen(true);
  };

  const openEdit = (artist: Artist) => {
    setSelectedArtist(artist);

    setDialogOpen(true);
  };

  const openDelete = (artist: Artist) => {
    setSelectedArtist(artist);
    setDeleteDialogOpen(true);
  };

  // const handleCSVExport = () => {
  //   const headers = "id,name,dob,gender,address,first_release_year,no_of_albums_released";
  //   const rows = artists.map((a) =>
  //     `${a.id},"${a.name}",${a.dob},${a.gender},"${a.address}",${a.first_release_year},${a.no_of_albums_released}`
  //   );
  //   const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "artists.csv";
  //   link.click();
  // };
  const artists = artistsResponse?.data ?? [];
  const totalItems = artistsResponse?.total ?? 0;
  const totalPages = Math.ceil(totalItems / limit);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: importCsv, isPending: importing } = useImportArtists();
  const { mutate: exportCsv, isPending: exporting } = useExportArtists();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importCsv(file, {
      // onSuccess: (res) => toast.success(`Imported ${res.imported} artists`),
      // onError: () => toast.error('Import failed. Check your CSV format.'),
    });
    e.target.value = '';
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h5 className="text-lg font-semibold tracking-tight text-zinc-100">Artists</h5>
              <p className="text-xs text-zinc-500">{totalItems} total records</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="sm"
              onClick={() => exportCsv()}
              disabled={exporting}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2 h-8 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            <Button
              variant="ghost" size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2 h-8 text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              {importing ? 'Importing...' : 'Import CSV'}
            </Button>
            <Button
              size="sm"
              onClick={openCreate}
              className="bg-violet-600 hover:bg-violet-500 text-white gap-2 h-8 text-xs shadow-lg shadow-violet-900/30"
            >
              <Plus className="w-3.5 h-3.5" /> Add Artist
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search artists..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm focus:border-violet-500 focus:ring-violet-500/20"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-500 text-xs font-medium py-3 px-4">Artist</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">DOB</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Gender</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Location</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">First Release</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Albums</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Songs</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                artists?.map((artist: any) => (
                  <TableRow
                    key={artist.id}
                    className="border-zinc-800/60 hover:bg-zinc-800/40 transition-colors group"
                  >
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-semibold">
                          {artist.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-zinc-100">{artist.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">{artist.dob}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${genderColor[artist?.gender]}`}>
                        {genderLabel[artist?.gender]}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">{artist.address}</TableCell>
                    <TableCell className="text-zinc-400 text-sm">{artist.first_release_year}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-zinc-300">
                        <Disc className="w-3.5 h-3.5 text-zinc-600" />
                        {artist.no_of_albums_released}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 opacity-100 group-hover:opacity-100 transition-opacity"
                        onClick={() => { navigate(ROUTES.ARTIST_SONGS.replace(':artistId', artist.id)) }}
                      >
                        <Music className="w-3 h-3" /> View Songs
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300 w-36">
                          <DropdownMenuItem onClick={() => openEdit(artist)} className="hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer text-sm">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDelete(artist)} className="hover:bg-red-950 text-red-400 hover:text-red-300 cursor-pointer text-sm">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing {totalItems === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, totalItems)} of {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="ghost" size="sm"
                onClick={() => setPage(p)}
                className={`h-7 w-7 text-xs ${page === p
                  ? "bg-violet-600 text-white hover:bg-violet-500"
                  : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
                  }`}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="ghost" size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>


      <CreateArtist open={dialogOpen} onOpenChange={setDialogOpen} artistId={selectedArtist?.id ?? ''} />
      <DeleteArtist deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} artistId={selectedArtist?.id ?? ''} />
    </div>
  );
}