import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { useCreateUser, useGetUser, useUpdateUser } from "../hooks/user"; // adjust path
import { toast } from "sonner"; // or your toast lib

interface CreateUserProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    id?: string | null;
}

type Gender = "m" | "f" | "o";
type Role = "super_admin" | "artist_manager" | "artist";

const initialForm = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "m" as Gender,
    role: "artist" as Role,
    address: "",
};

export default function CreateEditUser({ dialogOpen, setDialogOpen, id }: CreateUserProps) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEdit = !!id;

    const { data: userData } = useGetUser(id ?? "");
    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    // Populate form when editing
    useEffect(() => {
        if (isEdit && userData) {
            setForm({
                first_name: userData.first_name ?? "",
                last_name: userData.last_name ?? "",
                email: userData.email ?? "",
                password: "",
                phone: userData.phone ?? "",
                dob: userData.dob ? userData.dob.split("T")[0] : "",
                gender: userData.gender ?? "m",
                role: userData.role ?? "artist",
                address: userData.address ?? "",
            });
        } else {
            setForm(initialForm);
        }
    }, [isEdit, userData, dialogOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.first_name.trim()) newErrors.first_name = "First name is required";
        if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
        if (!isEdit && !form.password) newErrors.password = "Password is required";
        else if (!isEdit && form.password.length < 6) newErrors.password = "Min 6 characters";
        if (!form.dob) newErrors.dob = "Date of birth is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        if (isEdit) {
            const { password, ...updateData } = form;
            updateUser(
                { id, data: updateData },
                {
                    onSuccess: () => {
                        toast.success("User updated successfully");
                        setDialogOpen(false);
                    },
                    onError: () => toast.error("Failed to update user"),
                }
            );
        } else {
            createUser(form, {
                onSuccess: () => {
                    toast.success("User created successfully");
                    setDialogOpen(false);
                    setForm(initialForm);
                },
                onError: () => toast.error("Failed to create user"),
            });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        {isEdit ? "Edit User" : "Add New User"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">First Name</Label>
                        <Input
                            value={form.first_name}
                            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500"
                            placeholder="First name"
                        />
                        {errors.first_name && <p className="text-xs text-red-400">{errors.first_name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Last Name</Label>
                        <Input
                            value={form.last_name}
                            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500"
                            placeholder="Last name"
                        />
                        {errors.last_name && <p className="text-xs text-red-400">{errors.last_name}</p>}
                    </div>

                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs text-zinc-400">Email</Label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500"
                            placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    </div>

                    {!isEdit && (
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs text-zinc-400">Password</Label>
                            <Input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Phone</Label>
                        <Input
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500"
                            placeholder="9841000000"
                        />
                        {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Date of Birth</Label>
                        <Input
                            type="date"
                            value={form.dob}
                            onChange={(e) => setForm({ ...form, dob: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500"
                        />
                        {errors.dob && <p className="text-xs text-red-400">{errors.dob}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-400">Gender</Label>
                        <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as Gender })}>
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
                        <Input
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-emerald-500"
                            placeholder="City, Country"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setDialogOpen(false)}
                        className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm"
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-sm shadow-lg shadow-emerald-900/30"
                    >
                        {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}