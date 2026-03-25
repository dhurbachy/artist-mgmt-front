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
  ShieldCheck, UserCog, Mic2,
} from "lucide-react";
import {useGetMe} from "../hooks/user"
type Role = "super_admin" | "artist_manager" | "artist";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "m" | "f" | "o";
  address: string;
  role: Role;
  created_at: string;
}

const MOCK_USERS: User[] = [
  { id: 1, first_name: "Rajan", last_name: "Shrestha", email: "rajan@example.com", phone: "9841000001", dob: "1985-06-12", gender: "m", address: "Kathmandu", role: "super_admin", created_at: "2024-01-05" },
  { id: 2, first_name: "Priya", last_name: "Thapa", email: "priya@example.com", phone: "9841000002", dob: "1990-03-22", gender: "f", address: "Pokhara", role: "artist_manager", created_at: "2024-01-08" },
  { id: 3, first_name: "Bipin", last_name: "Karki", email: "bipin@example.com", phone: "9841000003", dob: "1995-11-01", gender: "m", address: "Lalitpur", role: "artist", created_at: "2024-01-10" },
  { id: 4, first_name: "Sanu", last_name: "Gurung", email: "sanu@example.com", phone: "9841000004", dob: "1992-07-18", gender: "f", address: "Bhaktapur", role: "artist", created_at: "2024-01-12" },
  { id: 5, first_name: "Milan", last_name: "Rai", email: "milan@example.com", phone: "9841000005", dob: "1988-09-30", gender: "m", address: "Biratnagar", role: "artist_manager", created_at: "2024-01-15" },
];

const roleConfig: Record<Role, { label: string; icon: React.ElementType; color: string; badge: string }> = {
  super_admin: {
    label: "Super Admin", icon: ShieldCheck,
    color: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  artist_manager: {
    label: "Artist Manager", icon: UserCog,
    color: "text-sky-400",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  artist: {
    label: "Artist", icon: Mic2,
    color: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

const EMPTY_FORM = {
  first_name: "", last_name: "", email: "", phone: "",
  dob: "", gender: "m" as const, address: "", role: "artist" as Role, password: "",
};

export default function User() {
  const {data}=useGetMe();
  console.log(data,'Data');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const PAGE_SIZE = 4;
  const filtered = users.filter((u) => {
    const matchSearch =
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit phone required";
    if (!form.dob) e.dob = "Required";
    if (!selectedUser && !form.password) e.password = "Password required for new users";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => {
    setSelectedUser(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setForm({
      first_name: user.first_name, last_name: user.last_name,
      email: user.email, phone: user.phone, dob: user.dob,
      gender: user.gender, address: user.address, role: user.role, password: "",
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    if (selectedUser) {
      setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? { ...u, ...form } : u));
    } else {
      setUsers((prev) => [...prev, { id: Date.now(), ...form, created_at: new Date().toISOString().split("T")[0] }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser?.id));
    setDeleteDialogOpen(false);
  };

  const roleCounts = { all: users.length, super_admin: 0, artist_manager: 0, artist: 0 };
  users.forEach((u) => roleCounts[u.role]++);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold tracking-tight text-zinc-100">Users</h4>
              <p className="text-xs text-zinc-500">{users.length} total accounts</p>
            </div>
          </div>
          <Button
            size="sm" onClick={openCreate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 h-8 text-xs shadow-lg shadow-emerald-900/30"
          >
            <Plus className="w-3.5 h-3.5" /> Add User
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
        {/* Stats chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "super_admin", "artist_manager", "artist"] as const).map((r) => {
            const cfg = r === "all" ? null : roleConfig[r];
            const Icon = cfg?.icon;
            return (
              <button
                key={r}
                onClick={() => { setRoleFilter(r); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  roleFilter === r
                    ? r === "all"
                      ? "bg-zinc-700 border-zinc-600 text-zinc-100"
                      : `${cfg?.badge} border-current`
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {r === "all" ? "All" : cfg?.label}
                <span className="ml-0.5 opacity-60">{roleCounts[r]}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-9 text-sm focus:border-emerald-500"
          />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-500 text-xs font-medium py-3 px-4">User</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Contact</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">DOB</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Address</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Role</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Joined</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-zinc-600">No users found</TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => {
                  const cfg = roleConfig[user.role];
                  const Icon = cfg.icon;
                  return (
                    <TableRow key={user.id} className="border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${cfg.badge}`}>
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-100">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">{user.phone}</TableCell>
                      <TableCell className="text-zinc-400 text-sm">{user.dob}</TableCell>
                      <TableCell className="text-zinc-400 text-sm">{user.address}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.badge}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-xs">{user.created_at}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300 w-36">
                            <DropdownMenuItem onClick={() => openEdit(user)} className="hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer text-sm">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedUser(user); setDeleteDialogOpen(true); }}
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
          <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="h-7 w-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant="ghost" size="sm" onClick={() => setPage(p)} className={`h-7 w-7 text-xs ${page === p ? "bg-emerald-600 text-white hover:bg-emerald-500" : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"}`}>
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
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {selectedUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">First Name</Label>
              <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500" placeholder="First name" />
              {errors.first_name && <p className="text-xs text-red-400">{errors.first_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Last Name</Label>
              <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500" placeholder="Last name" />
              {errors.last_name && <p className="text-xs text-red-400">{errors.last_name}</p>}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs text-zinc-400">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500" placeholder="email@example.com" />
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>
            {!selectedUser && (
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-zinc-400">Password</Label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500" placeholder="••••••••" />
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500" placeholder="9841000000" />
              {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Date of Birth</Label>
              <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500" />
              {errors.dob && <p className="text-xs text-red-400">{errors.dob}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as any })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="m" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Male</SelectItem>
                  <SelectItem value="f" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Female</SelectItem>
                  <SelectItem value="o" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="super_admin" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Super Admin</SelectItem>
                  <SelectItem value="artist_manager" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Artist Manager</SelectItem>
                  <SelectItem value="artist" className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100">Artist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs text-zinc-400">Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500" placeholder="City, Country" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm">Cancel</Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-sm shadow-lg shadow-emerald-900/30">
              {selectedUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400 py-2">
            Remove <span className="text-zinc-100 font-medium">{selectedUser?.first_name} {selectedUser?.last_name}</span> permanently?
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