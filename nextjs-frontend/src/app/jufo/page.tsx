import { Layout } from "@/components/Layout";
import { JufoExplorer } from "@/components/jufo/JufoExplorer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchJufoPage } from "@/lib/public-data/jufo";

type JufoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function JufoPage(props: JufoPageProps) {
  const resolvedSearchParams = await props.searchParams;
  const query = getSingleSearchParam(resolvedSearchParams.q);
  const rawPage = Number(getSingleSearchParam(resolvedSearchParams.page));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const pageResult = await fetchJufoPage({ query, page });

  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: "url('/backgrounds/diana-parkhouse-5prKIX4JLO0-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-white/15 bg-slate-950/38 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <h1 className="mb-6 text-center font-[family-name:var(--font-space)] text-4xl font-semibold text-white sm:text-5xl">
              Publication Rankings
              </h1>

              <Card className="mx-auto border-white/15 bg-white/10 shadow-xl shadow-black/20">
                <CardContent className="pt-6">
                  <div className="mb-6 space-y-3 text-center sm:text-left">
                    <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-[0.34em] text-white/58">
                      Editorial context
                    </p>
                  </div>

                  <p className="text-white/80 mb-4 leading-7">
                  Mycoweekly adheres to the JUFO ranking system. The team at
                  mycoweekly has decided to move away from traditional indices
                  of importance such as impact factor or citation counts, due to concerns surrounding
                  the accuracy and reliability of these metrics and the proliferation of predatory journals.
                  </p>

                  <p className="text-white/80 mb-4 leading-7">
                    For more information on the JUFO system, please visit their website: <a href="https://julkaisufoorumi.fi/en" target="_blank" rel="noopener noreferrer" className="text-[#8FAF6B] underline underline-offset-4 hover:text-[#a6c67e]">
                    https://julkaisufoorumi.fi/en
                    </a>
                  </p>

                  <p className="text-white/80 mb-4 leading-7">
                    For more information on predatory journals, you can read this wonderful (and reliable) article from Nature: <a href="https://www.nature.com/articles/d41586-019-03759-y" target="_blank" rel="noopener noreferrer" className="text-[#8FAF6B] underline underline-offset-4 hover:text-[#a6c67e]">
                    https://www.nature.com/articles/d41586-019-03759-y
                    </a>
                  </p>

                  <p className="text-white/80 mb-4 leading-7">
                  In Mycoweekly each article's publication channel is given a rating level. The rating levels are:
                  </p>

                  <ul className="mb-4 grid gap-3 text-white/80 sm:grid-cols-2">
                    <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Level 3: Leading publication channels</li>
                    <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Level 2: Leading publications within their field</li>
                    <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Level 1: Basic level publications</li>
                    <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Level 0: Publications not meeting Level 1 criteria</li>
                  </ul>

                  <p className="text-white/80 leading-7">
                  In our article selection process, we prioritize articles from
                  publications rated Level 2 or higher to ensure high-quality, relevant, and
                  peer-reviewed research content.
                  </p>
                </CardContent>
              </Card>
            </section>

            <Separator className="mb-6 bg-white/20" />

            <JufoExplorer pageResult={pageResult} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
