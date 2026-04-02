import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { getBooks } from "@/lib/libraryStore";
import { Input } from "@/components/ui/input";
import { Search, BookCopy } from "lucide-react";

const BooksInfo = () => {
  const books = getBooks();
  const [search, setSearch] = useState("");

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Books Collection</h1>
          <p className="text-muted-foreground mt-1">{books.length} books in the library</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-foreground">#</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Author</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Category</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">Total</th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">Available</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((book, i) => (
              <tr
                key={book.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <BookCopy className="h-4 w-4 text-secondary shrink-0" />
                    {book.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{book.author}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-secondary/10 text-secondary">
                    {book.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">{book.totalCopies}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      book.availableCopies === 0
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {book.availableCopies}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  No books found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default BooksInfo;
