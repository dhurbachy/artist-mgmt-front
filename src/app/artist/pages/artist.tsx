import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  Download,
  Music,
  ChevronLeft,
  ChevronRight,
  User,
  Disc,
} from "lucide-react";

const GENDERS = ["m", "f", "o"] as const;
type Gender = (typeof GENDERS)[number];

interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: string;
}

const MOCK_ARTISTS: Artist[] = [
  { id: 1, name: "Arijit Singh", dob: "1987-04-25", gender: "m", address: "Mumbai, India", first_release_year: 2010, no_of_albums_released: 8, created_at: "2024-01-10" },
  { id: 2, name: "Lata Mangeshkar", dob: "1929-09-28", gender: "f", address: "Mumbai, India", first_release_year: 1942, no_of_albums_released: 42, created_at: "2024-01-11" },
  { id: 3, name: "A.R. Rahman", dob: "1967-01-06", gender: "m", address: "Chennai, India", first_release_year: 1992, no_of_albums_released: 20, created_at: "2024-01-12" },
  { id: 4, name: "Shreya Ghoshal", dob: "1984-03-12", gender: "f", address: "Kolkata, India", first_release_year: 2002, no_of_albums_released: 11, created_at: "2024-01-13" },
  { id: 5, name: "Kumar Sanu", dob: "1957-10-20", gender: "m", address: "Kolkata, India", first_release_year: 1989, no_of_albums_released: 30, created_at: "2024-01-14" },
];

const genderLabel: Record<Gender, string> = { m: "Male", f: "Female", o: "Other" };
const genderColor: Record<Gender, string> = {
  m: "bg-blue-100 text-blue-700 border-blue-200",
  f: "bg-pink-100 text-pink-700 border-pink-200",
  o: "bg-amber-100 text-amber-700 border-amber-200",
};

const EMPTY_FORM = {
  name: "", dob: "", gender: "m" as Gender,
  address: "", first_release_year: new Date().getFullYear(), no_of_albums_released: 0,
};

export default function Artist() {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const PAGE_SIZE = 4;
  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.address.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.first_release_year || form.first_release_year < 1900)
      e.first_release_year = "Enter a valid year";
    if (form.no_of_albums_released < 0)
      e.no_of_albums_released = "Cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => {
    setSelectedArtist(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (artist: Artist) => {
    setSelectedArtist(artist);
    setForm({
      name: artist.name, dob: artist.dob, gender: artist.gender,
      address: artist.address, first_release_year: artist.first_release_year,
      no_of_albums_released: artist.no_of_albums_released,
    });
    setErrors({});
    setDialogOpen(true);
  };

  const openDelete = (artist: Artist) => {
    setSelectedArtist(artist);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    if (selectedArtist) {
      setArtists((prev) =>
        prev.map((a) => a.id === selectedArtist.id ? { ...a, ...form } : a)
      );
    } else {
      setArtists((prev) => [
        ...prev,
        { id: Date.now(), ...form, created_at: new Date().toISOString().split("T")[0] },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    setArtists((prev) => prev.filter((a) => a.id !== selectedArtist?.id));
    setDeleteDialogOpen(false);
  };

  const handleCSVExport = () => {
    const headers = "id,name,dob,gender,address,first_release_year,no_of_albums_released";
    const rows = artists.map((a) =>
      `${a.id},"${a.name}",${a.dob},${a.gender},"${a.address}",${a.first_release_year},${a.no_of_albums_released}`
    );
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "artists.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Artists</h1>
              <p className="text-xs text-zinc-500">{artists.length} total records</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCSVExport}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2 h-8 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2 h-8 text-xs"
            >
              <Upload className="w-3.5 h-3.5" /> Import CSV
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
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16 text-zinc-600">
                    No artists found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((artist) => (
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
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${genderColor[artist.gender]}`}>
                        {genderLabel[artist.gender]}
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
                        className="h-7 px-2.5 text-xs gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
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
                className={`h-7 w-7 text-xs ${page === p ? "bg-violet-600 text-white hover:bg-violet-500" : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"}`}
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {selectedArtist ? "Edit Artist" : "Add New Artist"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs text-zinc-400">Full Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
                placeholder="e.g. Arijit Singh"
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Date of Birth</Label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
              />
              {errors.dob && <p className="text-xs text-red-400">{errors.dob}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as Gender })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="m" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Male</SelectItem>
                  <SelectItem value="f" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Female</SelectItem>
                  <SelectItem value="o" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs text-zinc-400">Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
                placeholder="City, Country"
              />
              {errors.address && <p className="text-xs text-red-400">{errors.address}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">First Release Year</Label>
              <Input
                type="number"
                value={form.first_release_year}
                onChange={(e) => setForm({ ...form, first_release_year: Number(e.target.value) })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
              />
              {errors.first_release_year && <p className="text-xs text-red-400">{errors.first_release_year}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Albums Released</Label>
              <Input
                type="number"
                value={form.no_of_albums_released}
                onChange={(e) => setForm({ ...form, no_of_albums_released: Number(e.target.value) })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
              />
              {errors.no_of_albums_released && <p className="text-xs text-red-400">{errors.no_of_albums_released}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-500 text-white h-8 text-sm shadow-lg shadow-violet-900/30">
              {selectedArtist ? "Save Changes" : "Create Artist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Delete Artist</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400 py-2">
            Are you sure you want to delete <span className="text-zinc-100 font-medium">{selectedArtist?.name}</span>? This action cannot be undone.
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
    </div>
  );
}