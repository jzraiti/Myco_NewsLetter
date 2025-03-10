"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Publication = {
  Name: string;
  Website: string;
  Country: string;
  Publisher: string;
  Language: string;
  Year_Start: number;
  panels: string;
  Level: string | number;
};

export default function JufoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublications() {
      try {
        const response = await fetch("/jfp-export-cleaned-twice.csv");
        const data = await response.text();
        const rows = data.split("\n");

        const parsedPublications: Publication[] = [];

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].trim();
          if (row === "") continue; // Skip empty rows

          // Handle CSV parsing more robustly to account for quoted fields with commas
          const parsedRow = parseCSVRow(row);

          if (parsedRow.length >= 8) {
            parsedPublications.push({
              Name: parsedRow[0] || "",
              Website: parsedRow[1] || "",
              Country: parsedRow[2] || "",
              Publisher: parsedRow[3] || "",
              Language: parsedRow[4] || "",
              Year_Start: Number(parsedRow[5]) || 0,
              panels: parsedRow[6] || "",
              Level: parsedRow[7] || "",
            });
          }
        }

        setPublications(parsedPublications);
      } catch (error) {
        console.error("Error loading publications:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPublications();
  }, []);

  // Function to parse CSV properly, handling quoted fields with commas
  function parseCSVRow(row: string): string[] {
    const result = [];
    let insideQuotes = false;
    let currentField = "";

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        result.push(currentField.trim());
        currentField = "";
      } else {
        currentField += char;
      }
    }

    // Don't forget to push the last field
    result.push(currentField.trim());

    return result;
  }

  const filteredPublications = publications.filter(
    (pub) =>
      pub.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.Publisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/diana-parkhouse-5prKIX4JLO0-unsplash.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      </div>

      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col p-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mt-10 mb-8 flex items-center justify-center gap-4 text-white font-display">
              JUFO Publication Rankings
            </h1>

            <Card className="bg-white/10 border-white/20 mb-8 mx-auto">
              <CardContent className="pt-6">
                <p className="text-white/80 mb-4">
                  The Publication Forum (JUFO) is a Finnish rating system for
                  research publications, classifying academic journals,
                  conferences, and book publishers. The rating levels are:
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-2 text-white/80">
                  <li>Level 3: Leading publication channels</li>
                  <li>Level 2: Leading publications within their field</li>
                  <li>Level 1: Basic level publications</li>
                  <li>Level 0: Publications not meeting Level 1 criteria</li>
                </ul>

                <p className="text-white/80">
                  In our article selection process, we prioritize articles from
                  publications rated Level 2 or higher to ensure high-quality,
                  peer-reviewed research content.
                </p>
              </CardContent>
            </Card>

            <Separator className="mb-6 bg-white/20" />

            <div className="flex justify-center mb-6">
              <Input
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <Card className="bg-white/10 border-white/20">
              {loading ? (
                <div className="p-8 text-center text-white/80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                      {filteredPublications.length > 0 ? (
                        filteredPublications.map((pub, index) => (
                          <TableRow key={index} className="border-white/10">
                            <TableCell className="text-white/80 whitespace-nowrap">{pub.Name}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              {pub.Website && pub.Website !== "http://" ? (
                                <a
                                  href={pub.Website}
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
                            <TableCell className="text-white/80 whitespace-nowrap">{pub.Country}</TableCell>
                            <TableCell className="text-white/80 whitespace-nowrap">{pub.Publisher}</TableCell>
                            <TableCell className="text-white/80 whitespace-nowrap">{pub.Language}</TableCell>
                            <TableCell className="text-white/80 whitespace-nowrap">{pub.Year_Start}</TableCell>
                            <TableCell className="text-white/80 whitespace-nowrap">{pub.panels}</TableCell>
                            <TableCell className="text-white/80 text-center whitespace-nowrap">{pub.Level}</TableCell>
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
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
