import {Link} from "react-router" 
import { FileQuestion, Home, MoveLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-md border-dashed bg-muted/40 shadow-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-background ring-1 ring-border shadow-sm">
            <FileQuestion className="h-10 w-10 text-muted-foreground animate-pulse" />
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tight">404</CardTitle>
          <CardDescription className="text-balance text-lg font-medium text-foreground">
            Oops! This page has vanished.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          The link you followed might be broken, or the page may have been moved or deleted.
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
      
      <p className="mt-8 text-sm text-muted-foreground">
        Need help? <a href="/support" className="underline underline-offset-4 hover:text-primary">Contact Support</a>
      </p>
    </div>
  )
}
