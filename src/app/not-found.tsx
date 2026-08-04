import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24 md:py-32">
      <Container className="max-w-2xl text-center flex flex-col gap-6 items-center">
        <p className="font-display text-7xl text-accent">404</p>
        <h1 className="text-h1 text-ink">Page Not Found</h1>
        <p className="text-muted">
          The page you are looking for may have been moved or no longer exists.
        </p>
        <div className="flex gap-4 mt-2">
          <Button href="/">Return Home</Button>
          <Button href="/shop" variant="outline">Browse Shop</Button>
        </div>
      </Container>
    </div>
  );
}
