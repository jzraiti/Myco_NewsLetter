import { Layout } from "@/components/Layout";
import { SubscribePanel } from "@/components/subscription/SubscribePanel";
import { HOME_BACKGROUND_IMAGES, pickDeterministicBackground } from "@/lib/public-data/backgrounds";
import { fetchSubscriberCount } from "@/lib/public-data/subscriptions";

export default async function Home() {
  const initialSubscriberCount = await fetchSubscriberCount();
  const backgroundImage = pickDeterministicBackground("home-hero", HOME_BACKGROUND_IMAGES);

  return (
    <Layout>
      <SubscribePanel
        initialSubscriberCount={initialSubscriberCount}
        backgroundImage={backgroundImage}
        preloadImages={HOME_BACKGROUND_IMAGES}
      />
    </Layout>
  );
}
