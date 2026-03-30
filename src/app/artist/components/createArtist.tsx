import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import {
  useCreateArtist,
  useGetArtist,
  useUpdateArtist,
} from "../hooks/artist";
import type { ApiError } from "@/services/artist-services";

interface CreateArtistProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId?: string | null;
}

type Gender = "m" | "f" | "o";

const initialForm = {
  name: "",
  dob: "",
  gender: "m" as Gender,
  address: "",
  first_release_year: new Date().getFullYear(),
  no_of_albums_released: 0,
};

export default function CreateArtist({
  open,
  onOpenChange,
  artistId,
}: CreateArtistProps) {
  const { data: artistData } = useGetArtist(artistId ?? "");

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createArtist } = useCreateArtist();
  const { mutate: updateArtist } = useUpdateArtist();

  useEffect(() => {
    if (artistId && artistData) {
      setForm({
        name: artistData.name ?? "",
        dob: artistData.dob ? artistData.dob.split("T")[0] : "",
        gender: (artistData.gender as Gender) ?? "m",
        address: artistData.address ?? "",
        first_release_year:
          artistData.first_release_year ?? new Date().getFullYear(),
        no_of_albums_released: artistData.no_of_albums_released ?? 0,
      });
    } else if (!artistId) {
      setForm(initialForm);
    }
  }, [artistId, artistData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (
      form.first_release_year < 1900 ||
      form.first_release_year > new Date().getFullYear()
    ) {
      newErrors.first_release_year = `Year must be between 1900 and ${new Date().getFullYear()}`;
    }
    if (!form.address.trim()) newErrors.address = "Address is required";

    if (form.no_of_albums_released < 0) {
      newErrors.no_of_albums_released = "Albums released cannot be negative";
    }
    if (!form.gender) newErrors.gender = "Please select a gender";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (artistId) {
      updateArtist(
        { id: artistId, ...form },
        {
          onSuccess: () => {
            onOpenChange(false);
            setForm(initialForm);
            setErrors({});
          },
         
        },
      );
    } else {
      createArtist(form, {
        onSuccess: () => {
          onOpenChange(false);
          setForm(initialForm);
          setErrors({});
        },
        onError: (err: any) => {
          setErrors(
            err.response?.data?.errors || { name: "Something went wrong" },
          );
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {artistId ? "Edit Artist" : "Add New Artist"}
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
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Date of Birth</Label>
            <Input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
            />
            {errors.dob && <p className="text-xs text-red-400">{errors.dob}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Gender</Label>
            <Select
              value={form.gender}
              onValueChange={(v) => setForm({ ...form, gender: v as Gender })}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="m">Male</SelectItem>
                <SelectItem value="f">Female</SelectItem>
                <SelectItem value="o">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-xs text-red-400">{errors.gender}</p>
            )}
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs text-zinc-400">Address</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
              placeholder="City, Country"
            />
            {errors.address && (
              <p className="text-xs text-red-400">{errors.address}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">First Release Year</Label>
            <Input
              type="number"
              value={form.first_release_year}
              onChange={(e) =>
                setForm({ ...form, first_release_year: Number(e.target.value) })
              }
              className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
            />
            {errors.first_release_year && (
              <p className="text-xs text-red-400">
                {errors.first_release_year}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Albums Released</Label>
            <Input
              type="number"
              value={form.no_of_albums_released}
              onChange={(e) =>
                setForm({
                  ...form,
                  no_of_albums_released: Number(e.target.value),
                })
              }
              className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm focus:border-violet-500"
            />
            {errors.no_of_albums_released && (
              <p className="text-xs text-red-400">
                {errors.no_of_albums_released}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-violet-600 hover:bg-violet-500 text-white h-8 text-sm"
          >
            {artistId ? "Save Changes" : "Create Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
