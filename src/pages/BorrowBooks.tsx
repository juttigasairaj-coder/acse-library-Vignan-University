import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import PageLayout from "@/components/PageLayout";
import { getBooks, borrowBook } from "@/lib/libraryStore";
import { toast } from "sonner";
import { BookOpen, UserRound, Phone, CheckCircle2, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const BorrowBooks = () => {
  const [facultyName, setFacultyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [bookSearchOpen, setBookSearchOpen] = useState(false);
  const books = getBooks();
  const availableBooks = books.filter((b) => b.availableCopies > 0);

  const selectedBook = useMemo(
    () => availableBooks.find((b) => b.id.toString() === selectedBookId),
    [availableBooks, selectedBookId]
  );

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim() || !mobile.trim() || !selectedBookId) {
      toast.error("Please fill all fields");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const success = borrowBook(facultyName.trim(), mobile.trim(), parseInt(selectedBookId));
    if (success) {
      toast.success("Book borrowed successfully!", {
        description: `Due date: ${new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
        icon: <CheckCircle2 className="h-5 w-5 text-success" />,
      });
      setFacultyName("");
      setMobile("");
      setSelectedBookId("");
    } else {
      toast.error("Book is not available");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground text-balance">Borrow a Book</h1>
          <p className="text-muted-foreground mt-1">
            Faculty can borrow books for up to 28 days.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
          <form onSubmit={handleBorrow} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="faculty-name" className="flex items-center gap-1.5 text-sm font-medium">
                <UserRound className="h-4 w-4 text-muted-foreground" /> Faculty Name
              </Label>
              <Input
                id="faculty-name"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                placeholder="Enter faculty name"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-1.5 text-sm font-medium">
                <Phone className="h-4 w-4 text-muted-foreground" /> Mobile Number
              </Label>
              <Input
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-muted-foreground" /> Select Book
              </Label>
              <Popover open={bookSearchOpen} onOpenChange={setBookSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={bookSearchOpen}
                    className="w-full h-11 justify-between font-normal"
                  >
                    {selectedBook
                      ? `${selectedBook.title} — ${selectedBook.availableCopies} left`
                      : "Search and select a book..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Type book title, author or category..." />
                    <CommandList>
                      <CommandEmpty>No books found.</CommandEmpty>
                      <CommandGroup>
                        {availableBooks.map((book) => (
                          <CommandItem
                            key={book.id}
                            value={`${book.title} ${book.author} ${book.category}`}
                            onSelect={() => {
                              setSelectedBookId(book.id.toString());
                              setBookSearchOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedBookId === book.id.toString() ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{book.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {book.author} · {book.category} · {book.availableCopies} left
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {availableBooks.length === 0 && (
                <p className="text-sm text-destructive">No books available at the moment.</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold active:scale-[0.97] transition-transform"
              disabled={availableBooks.length === 0}
            >
              Borrow Book
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default BorrowBooks;
