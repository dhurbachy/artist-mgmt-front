import { LoginForm } from "@/components/login-form"

export default function Login() {
    return (
        <div className="min-h-screen bg-[#feffe6] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}