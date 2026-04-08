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

      <Card className="bg-white/10 border-white/20">
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-semibold text-white mb-3 font-display">Publication Rankings</h2>
          <p className="text-white/80">Showing {pageResult.items.length} of {pageResult.totalCount} publications</p>
        </div>

        <div className="overflow-x-auto p-6">
          <Table>
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
                    No publications found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}
