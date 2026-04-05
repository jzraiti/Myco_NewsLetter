import { Layout } from "@/components/Layout";
import { UnsubscribePanel } from "@/components/subscription/UnsubscribePanel";

export default function Unsubscribe() {
  return (
    <Layout>
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('/backgrounds/shiho-azuma-jbz9h7pWxkg-unsplash.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 " />
        </div>
      </div>

      <UnsubscribePanel />
    </Layout>
  );
}
