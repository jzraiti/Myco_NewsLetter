import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import type { PaginatedJufoResult } from "@/lib/public-data/types";

import { JufoSearchControls } from "./JufoSearchControls";

type JufoExplorerProps = {
  pageResult: PaginatedJufoResult;
};

export function JufoExplorer({ pageResult }: JufoExplorerProps) {
  return (
    <>
      <JufoSearchControls pageResult={pageResult} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)]">
      <Card className="border-white/15 bg-slate-950/36 shadow-xl shadow-black/25 backdrop-blur-xl">
        <div className="p-6 pb-0">
          <h2 className="mb-3 font-[family-name:var(--font-figtree)] text-2xl font-semibold text-white">Publication Rankings</h2>
          <p className="text-white/80">Showing {pageResult.items.length} of {pageResult.totalCount} publications</p>
        </div>

        {pageResult.items.length > 0 ? (
          <div className="grid gap-4 px-6 pt-6 md:hidden">
            {pageResult.items.map((publication) => (
              <div key={`mobile-${publication.id}`} className="rounded-[1.5rem] border border-white/12 bg-white/10 p-5 text-white shadow-lg shadow-black/15">
                <div className="space-y-4">
                  <div>
                    <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.28em] text-white/55">
                      Publication name
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-figtree)] text-xl font-semibold text-white">
                      {publication.name}
                    </h3>
                  </div>

                  <dl className="grid gap-3 text-sm text-white/82 sm:grid-cols-2">
                    <div>
                      <dt className="text-white/55">JUFO Level</dt>
                      <dd className="mt-1 text-white">{publication.level ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/55">Publisher</dt>
                      <dd className="mt-1 text-white">{publication.publisher || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/55">Country</dt>
                      <dd className="mt-1 text-white">{publication.country || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/55">Language</dt>
                      <dd className="mt-1 text-white">{publication.language || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/55">Started</dt>
                      <dd className="mt-1 text-white">{publication.yearStart ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-white/55">Panels</dt>
                      <dd className="mt-1 text-white">{publication.panels ?? "—"}</dd>
                    </div>
                  </dl>

                  {publication.website ? (
                    <a
                      href={publication.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/12 px-4 text-sm font-medium text-white hover:bg-white/20"
                    >
                      Website
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="hidden overflow-x-auto p-6 md:block">
          <Table>
            <caption className="mb-4 text-left text-sm text-white/68">
              Ranked publication results with website, publisher, country, language, panels, and JUFO level.
            </caption>
            <TableHeader>
              <TableRow className="border-white/20">
                <TableHead className="text-white/80">Publication Name</TableHead>
                <TableHead className="text-white/80">Website</TableHead>
                <TableHead className="text-white/80">Country</TableHead>
                <TableHead className="text-white/80">Publisher</TableHead>
                <TableHead className="text-white/80">Language</TableHead>
                <TableHead className="text-white/80">Started</TableHead>
                <TableHead className="text-white/80">Panel</TableHead>
                <TableHead className="text-white/80 text-center">JUFO Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageResult.items.length > 0 ? (
                pageResult.items.map((publication) => (
                  <TableRow key={publication.id} className="border-white/10">
                    <TableCell className="text-white/80 whitespace-nowrap">{publication.name}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {publication.website ? (
                        <a
                          href={publication.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Link
                        </a>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell className="text-white/80 whitespace-nowrap">{publication.country}</TableCell>
                    <TableCell className="text-white/80 whitespace-nowrap">{publication.publisher}</TableCell>
                    <TableCell className="text-white/80 whitespace-nowrap">{publication.language}</TableCell>
                    <TableCell className="text-white/80 whitespace-nowrap">{publication.yearStart ?? ""}</TableCell>
                    <TableCell className="text-white/80 whitespace-nowrap">{publication.panels ?? ""}</TableCell>
                    <TableCell className="text-white/80 text-center whitespace-nowrap">{publication.level ?? ""}</TableCell>
                  </TableRow>
                ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-white/80">
                      No publications match this search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
          </Table>
        </div>
      </Card>
      </div>
    </>
  );
}
