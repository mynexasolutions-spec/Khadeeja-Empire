import type { InstagramPost } from "@/types";

const img = (id: string) => `/assets/images/${id}.jpg`;
const vid = (id: string) => `/assets/videos/${id}.mp4`;

function cleanCaption(text: string): string {
  return text
    .replace(/[\uFFFD]/g, "")
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u2600-\u27BF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const instagramPosts: InstagramPost[] = [
  {
    id: "3942701400028659556",
    caption: cleanCaption("Packing for your next getaway? Make sure this is the first thing in your suitcase. Nothing says vacation mode quite like a dreamy, tiered white dress."),
    hashtags: ["KhadeejaEmpire", "VacationOOTD", "ResortWear", "TravelStyle", "whitedress"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3942701400028659556"),
    video: vid("3942701400028659556"),
    timestamp: "2026-07-20",
  },
  {
    id: "3897412631952592325",
    caption: cleanCaption("The Luxury Transition. From casual to Khadeeja Empire elegance. This floral sheer overlay set is the ultimate mood for summer. Handcrafted details meet effortless style."),
    hashtags: ["khadeejaempire", "banaras", "fashion", "coordset", "treding"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3897412631952592325"),
    video: vid("3897412631952592325"),
    timestamp: "2026-06-10",
  },
  {
    id: "3895371692098630743",
    caption: cleanCaption("The Vibe. From the streets of Banaras to your summer mood board. This floral embroidered set is the ultimate OOTD for those who love colour and craft."),
    hashtags: ["khadeejaempire", "ootd", "summerstyle", "banarasifashion", "coordset"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3895371692098630743"),
    video: vid("3895371692098630743"),
    timestamp: "2026-06-05",
  },
  {
    id: "3911022349174249793",
    caption: cleanCaption("Mountain breeze and the perfect outfit to match. Absolutely loving this white and black floral co-ord set from Khadeeja Empire. Super soft, breathable, and effortlessly stylish."),
    hashtags: ["KhadeejaEmpire", "CoOrdSet", "FloralVibes", "TravelOOTD", "EffortlessStyle"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3911022349174249793"),
    video: vid("3911022349174249793"),
    timestamp: "2026-06-25",
  },
  {
    id: "3920746353986469456",
    caption: cleanCaption("From basic lounge layers to the ultimate confidence boost. Absolutely obsessed with the deep chocolate brown tone and effortless flow of this halter dress."),
    hashtags: ["KhadeejaEmpire", "OutfitTransition", "GlowUpReel", "BrownDress", "HalterDress"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3920746353986469456"),
    video: vid("3920746353986469456"),
    timestamp: "2026-07-05",
  },
  {
    id: "3945260404659568172",
    caption: cleanCaption("Elegance that speaks before you do. A timeless top designed for effortless style and all-day comfort."),
    hashtags: ["Khadeeja", "KhadeejaEmpire", "WomenFashion", "EverydayStyle", "FashionReel"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3945260404659568172"),
    video: vid("3945260404659568172"),
    timestamp: "2026-07-22",
  },
  {
    id: "3932554101906649932",
    caption: cleanCaption("Premium quality should not come with a premium price tag. If you are tired of kurtis that shrink after one wash or lose their colour in the sun, it is time to upgrade."),
    hashtags: ["KhadeejaEmpire", "ShortKurti", "AffordableFashion", "CottonKurtis", "EthnicWear"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3932554101906649932"),
    video: vid("3932554101906649932"),
    timestamp: "2026-07-15",
  },
  {
    id: "3952741041305855070",
    caption: cleanCaption("Serving looks you cannot ignore. This statement corset tunic is giving all the right vibes. Perfect for turning heads."),
    hashtags: ["khadeejaempire", "fashionista", "newcollection", "fyp", "sustainablefashion"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3952741041305855070"),
    video: vid("3952741041305855070"),
    timestamp: "2026-07-25",
  },
  {
    id: "3923512320514713148",
    caption: cleanCaption("Absolutely in love with this crisp white halter top from Khadeeja Empire. Minimal, beautifully structured, and gives that effortless look without trying too hard."),
    hashtags: ["KhadeejaEmpire", "OutfitCheck", "TransitionReel", "Whitetop", "summerstyles"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Video",
    image: img("3923512320514713148"),
    video: vid("3923512320514713148"),
    timestamp: "2026-07-08",
  },
  {
    id: "3923476630602737800",
    caption: cleanCaption("Sweet florals and effortless summer silhouettes. Keep it cool and classic with this white halter-style top from Khadeeja Empire."),
    hashtags: ["KhadeejaEmpire", "FloralTop", "SummerStyle", "OOTDInspiration", "effortlesschic"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Sidecar",
    image: img("3923476630602737800"),
    timestamp: "2026-07-08",
  },
  {
    id: "3944875503212557962",
    caption: cleanCaption("Minimal effort, maximum elegance. For the days when you want to look instantly put-together without trying too hard. The beautifully smocked waist white dress."),
    hashtags: ["CleanGirlAesthetic", "MinimalistFashion", "AllWhiteEverything", "SummerEssentials", "ClassyOutfits"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Sidecar",
    image: img("3944875503212557962"),
    timestamp: "2026-07-21",
  },
  {
    id: "3912472252555175961",
    caption: cleanCaption("Keeping it classic, elegant, and incredibly comfortable. This gorgeous floral co-ord set from Khadeeja Empire is a total summer and travel essential."),
    hashtags: ["KhadeejaEmpire", "TravelStyle", "SummerOutfits", "CoOrdSets", "FloralPrint"],
    shortCode: "",
    sourceUrl: "https://www.instagram.com/khadeejaempire/",
    type: "Sidecar",
    image: img("3912472252555175961"),
    timestamp: "2026-06-28",
  },
];

export function getInstagramFeed(limit = 12): InstagramPost[] {
  return instagramPosts.slice(0, limit);
}