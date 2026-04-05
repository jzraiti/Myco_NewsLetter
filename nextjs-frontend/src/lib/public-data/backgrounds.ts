export const HOME_BACKGROUND_IMAGES = [
  "/backgrounds/angelina-korolchak-FRRZK1ULzRM-unsplash.jpg",
  "/backgrounds/abhijeet-majhi-5y1YGhrsH0c-unsplash.jpg",
  "/backgrounds/alexx-cooper-VB3cvKx9-Hc-unsplash.jpg",
  "/backgrounds/atik-sulianami-xwiO6w6XEiM-unsplash.jpg",
  "/backgrounds/boys-in-bristol-photography-Lo_KNBSCYUQ-unsplash.jpg",
  "/backgrounds/bruno-kelzer-75-aDN68ZJE-unsplash.jpg",
  "/backgrounds/clyde-gravenberch-uj253l7xPFU-unsplash.jpg",
  "/backgrounds/damir-omerovic-UMaGtammiSI-unsplash.jpg",
  "/backgrounds/diana-parkhouse-5prKIX4JLO0-unsplash.jpg",
  "/backgrounds/giorgi-iremadze-10Xp5lIq5wY-unsplash.jpg",
  "/backgrounds/jan-kopriva-y_U0VqiKFFk-unsplash.jpg",
  "/backgrounds/kier-in-sight-archives-0kKBt4dGwN4-unsplash.jpg",
  "/backgrounds/lance-reis-tJHKM92J_yM-unsplash.jpg",
  "/backgrounds/lucas-marulier-o5qGmMRquOg-unsplash.jpg",
  "/backgrounds/mason-unrau-LpAsInS9ctU-unsplash.jpg",
  "/backgrounds/rosie-pritchard-epwBnTgYMAc-unsplash.jpg",
  "/backgrounds/samuel-pWeA162MJ9Q-unsplash.jpg",
  "/backgrounds/shiho-azuma-jbz9h7pWxkg-unsplash.jpg",
  "/backgrounds/timothy-dykes-DyraknirZ84-unsplash.jpg",
  "/backgrounds/timothy-dykes-zpuVzW5rv4Q-unsplash.jpg",
  "/backgrounds/vlad-rudkov-UMAJG4y1mm0-unsplash.jpg",
  "/backgrounds/wyxina-tresse-D74M77fOzyg-unsplash.jpg",
  "/backgrounds/wyxina-tresse-iNfpmebMc4k-unsplash.jpg",
] as const;

export const LANDSCAPE_BACKGROUND_IMAGES = [
  "/landscape_backgrounds/abbie-parks-XA1-J2rRGVw-unsplash.jpg",
  "/landscape_backgrounds/casper-van-battum-icWhBzRNUFw-unsplash.jpg",
  "/landscape_backgrounds/christopher-ott-qdcRECrSppU-unsplash.jpg",
  "/landscape_backgrounds/david-clode-8tZJG2t30fI-unsplash.jpg",
  "/landscape_backgrounds/david-clode-iQi_QFMfBZI-unsplash.jpg",
  "/landscape_backgrounds/david-clode-NugxTvRaQT0-unsplash.jpg",
  "/landscape_backgrounds/emanuel-rodriguez-2hdbY4Xaihw-unsplash.jpg",
  "/landscape_backgrounds/harshal-s-hirve-oZ0xzQFVCWY-unsplash.jpg",
  "/landscape_backgrounds/henry-schneider-s3sJ5j2ml2o-unsplash.jpg",
  "/landscape_backgrounds/james-wainscoat-WJ2ev0gQo4k-unsplash.jpg",
  "/landscape_backgrounds/jason-mitrione-MLAXy8PcGNk-unsplash.jpg",
  "/landscape_backgrounds/matt-seymour-qLvikxzTtWY-unsplash.jpg",
  "/landscape_backgrounds/nyusha-svoboda-_AaHmPTYzig-unsplash.jpg",
  "/landscape_backgrounds/patrick-hendry-_gHLz18DEpE-unsplash.jpg",
  "/landscape_backgrounds/patrick-hendry-hqcxvmNyFyg-unsplash.jpg",
  "/landscape_backgrounds/patrick-hendry-vOFzgDqPh3Y-unsplash (1).jpg",
  "/landscape_backgrounds/peter-neumann-Uofb3of6CCQ-unsplash.jpg",
  "/landscape_backgrounds/phoenix-han-2v_bZYAlKQ4-unsplash.jpg",
  "/landscape_backgrounds/sandra-alekseeva-h4vXoyKX_-Y-unsplash.jpg",
  "/landscape_backgrounds/timothy-dykes-3EUmV_AwKoA-unsplash.jpg",
  "/landscape_backgrounds/timothy-dykes-3JrIpTJ7tkM-unsplash.jpg",
  "/landscape_backgrounds/viktor-talashuk-0_cIDZw6rgc-unsplash.jpg",
  "/landscape_backgrounds/wolfgang-hasselmann-PUcrsXh9V4s-unsplash.jpg",
  "/landscape_backgrounds/zdenek-machacek-DwrVhMZmcaY-unsplash.jpg",
] as const;

export function pickDeterministicBackground(key: string | number, images: readonly string[]): string {
  if (images.length === 0) {
    return "";
  }

  const value = String(key);
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return images[hash % images.length];
}
