import { Layout } from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function OurTeam() {
  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage:
              "url('/backgrounds/bruno-kelzer-75-aDN68ZJE-unsplash.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 relative">
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg font-display mt-8">
          Meet Our Team
        </h1>

        <p className="text-xl text-center text-white/90 max-w-2xl mb-8">
          We are passionate about making mycology research accessible to
          everyone.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {[
            {
              name: "Andrew Chen",
              role: "Full Stack Developer",
              image: "/chen.jpeg",
              description:
                "Building and maintaining our platform's infrastructure.",
              github: "https://github.com/ach968",
              linkedin: "https://www.linkedin.com/in/andrewkkchen/",
            },
            {
              name: "Jason Raiti",
              role: "Research Lead",
              image: "/jason.png",
              description: "Curating and analyzing mycology research papers.",
              github: "https://github.com/jzraiti",
              linkedin: "https://www.linkedin.com/in/jason-raiti/",
            },
          ].map((member) => (
            <div
              key={member.name}
              className="backdrop-blur-md bg-white/10 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover shadow-lg"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {member.name}
              </h2>
              <h3 className="text-lg text-white/80 mb-3">{member.role}</h3>
              <p className="text-white/70 mb-4">{member.description}</p>
              <div className="flex items-center">
                <Link
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors px-2 py-2 rounded-md hover:bg-white/20"
                >
                  <Image
                    src="/github_logo.svg"
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="invert"
                  />
                </Link>
                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors px-2 py-2 rounded-md hover:bg-white/20"
                >
                  <Image
                    src="/linkedin_logo.png"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="invert"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
