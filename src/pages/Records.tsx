import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { getBorrows, returnBook, getDaysOverdue } from "@/lib/libraryStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Clock, RotateCcw } from "lucide-react";

const Records = () => {
  const [, setRefresh] = useState(0);
  const borrows = getBorrows();
  const activeBorrows = borrows.filter((b) => !b.returned);
  const delayedBorrows = activeBorrows.filter(
    (b) => new Date(b.dueDate) < new Date()
  );
  const returnedBorrows = borrows.filter((b) => b.returned);

  const handleReturn = (id: string) => {
    returnBook(id);
    toast.success("Book returned successfully!");
    setRefresh((r) => r + 1);
  };


  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Records & Delays</h1>

      {/* Delayed Alert */}
      {delayedBorrows.length > 0 && (
        <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-5 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <h2 className="font-semibold text-destructive">
                {delayedBorrows.length} Overdue Book{delayedBorrows.length > 1 ? "s" : ""}
              </h2>
              <ul className="mt-2 space-y-1">
                {delayedBorrows.map((b) => (
                  <li key={b.id} className="text-sm text-foreground">
                    <span className="font-medium">{b.facultyName}</span> — "{b.bookTitle}" is overdue by{" "}
                    <span className="font-bold text-destructive">{getDaysOverdue(b.dueDate)} days</span>.
                    Please submit the book immediately!
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Active Borrows */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-secondary" /> Currently Borrowed ({activeBorrows.length})
        </h2>
        {activeBorrows.length === 0 ? (
          <p className="text-muted-foreground text-sm bg-card rounded-xl border border-border p-6 text-center">
            No books currently borrowed.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold">Faculty</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Mobile</th>
                  <th className="text-left px-4 py-3 font-semibold">Book</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Borrowed</th>
                  <th className="text-left px-4 py-3 font-semibold">Due Date</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="text-center px-4 py-3 font-semibold">Action</th>
                  
                </tr>
              </thead>
              <tbody>
                {activeBorrows.map((b) => {
                  const overdue = new Date(b.dueDate) < new Date();
                  return (
                    <tr key={b.id} className={`border-b border-border/50 last:border-0 ${overdue ? "bg-destructive/5" : ""}`}>
                      <td className="px-4 py-3 font-medium">{b.facultyName}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{b.mobile}</td>
                      <td className="px-4 py-3">{b.bookTitle}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{formatDate(b.borrowDate)}</td>
                      <td className="px-4 py-3">{formatDate(b.dueDate)}</td>
                      <td className="px-4 py-3 text-center">
                        {overdue ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                            <AlertTriangle className="h-3 w-3" /> Overdue
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-success">On Time</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReturn(b.id)}
                          className="active:scale-[0.97]"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" /> Return
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Returned Books */}
      <section>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-success" /> Returned Books ({returnedBorrows.length})
        </h2>
        {returnedBorrows.length === 0 ? (
          <p className="text-muted-foreground text-sm bg-card rounded-xl border border-border p-6 text-center">
            No returned books yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold">Faculty</th>
                  <th className="text-left px-4 py-3 font-semibold">Book</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Borrowed</th>
                  <th className="text-left px-4 py-3 font-semibold">Returned</th>
                </tr>
              </thead>
              <tbody>
                {returnedBorrows.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 font-medium">{b.facultyName}</td>
                    <td className="px-4 py-3">{b.bookTitle}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{formatDate(b.borrowDate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.returnDate ? formatDate(b.returnDate) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default Records;
