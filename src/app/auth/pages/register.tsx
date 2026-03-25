import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // npx shadcn add label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router";
import { useRegister } from "../hooks/auth";
import { ROUTES } from "@/routes/routeConstant";
const registerSchema = z.object({
  first_name: z.string().min(2, "Required"),
  last_name: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 chars"),
  // Remove .default() and use .enum() directly to make it strictly required
  role: z.enum(["artist", "artist_manager"], "Please select a role"),
  gender: z.enum(["m", "f", "o"]).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const {mutate:registerMutate}=useRegister();
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "artist" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    console.log(values);
    registerMutate(values,{
      onSuccess:()=>{
        // navigate(ROUTES.DASHBOARD);
        reset();

      },
      onError:()=>{

      }
    })
  };

  return (
    <div className="min-h-screen bg-[#feffe6] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-6 border rounded-xl bg-card">
          <div className="flex flex-col items-center gap-2 text-center">
            <h5 className="text-xl font-bold">Create New Account</h5>
            <p className="text-balance text-xs text-muted-foreground">
              Already have account ? <Link to="/login" className="underline">click here</Link>
            </p>
          </div>
          {/* Names Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" placeholder="John" {...register("first_name")} />
              {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" placeholder="Doe" {...register("last_name")} />
              {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* Role & Gender (Custom Selects require Controller) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artist">Artist</SelectItem>
                      <SelectItem value="artist_manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">Male</SelectItem>
                      <SelectItem value="f">Female</SelectItem>
                      <SelectItem value="o">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
    </div>
  );
}
