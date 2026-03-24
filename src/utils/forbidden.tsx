import { Link } from "react-router" 
import { ShieldAlert, Home, MoveLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Forbidden() {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-md border-dashed border-destructive/20 bg-destructive/5 shadow-none">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-background ring-1 ring-destructive/20 shadow-sm">
            <ShieldAlert className="h-10 w-10 text-destructive animate-pulse" />
            <Lock className="absolute -bottom-1 -right-1 h-6 w-6 text-muted-foreground bg-background rounded-full p-1 border" />
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight text-destructive/80">403</CardTitle>
          <CardDescription className="text-balance text-lg font-medium text-foreground">
            Access Denied
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          You don't have the required permissions to access this resource. Please contact your administrator if you believe this is an error.
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="default" className="gap-2 px-8">
            <Link to="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-sm text-muted-foreground text-center max-w-[300px]">
        Log in with a different account? <Link to="/login" className="font-medium text-primary underline underline-offset-4">Sign Out</Link>
      </p>
    </div>
  )
}
