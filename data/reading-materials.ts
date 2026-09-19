import type {
  Grade,
  Level,
  ReadingMaterial,
  ReadingPage,
  Subject,
  ThumbnailTheme,
} from "@/types/reading-material";

function shortPages(
  title: string,
  lines: string[],
  illustration?: ThumbnailTheme,
): ReadingPage[] {
  return [
    {
      pageNumber: 1,
      title,
      content: lines.slice(0, 2),
      illustration,
    },
    {
      pageNumber: 2,
      title: "Let's Practice",
      content: lines.slice(2).length > 0 ? lines.slice(2) : [
        "Talk about what you learned with a classmate.",
        "Great job reading today!",
      ],
    },
  ];
}

const littleRedHenPages: ReadingPage[] = [
  {
    pageNumber: 1,
    title: "The Little Red Hen",
    content: [
      "Once upon a time, a little red hen lived on a quiet farm.",
      "She had three neighbors: a sleepy dog, a playful cat, and a busy duck.",
      "Every morning, the little red hen woke up early and looked for good things to do.",
    ],
    illustration: "hen",
  },
  {
    pageNumber: 2,
    title: "Grains of Wheat",
    content: [
      "One sunny morning, she found some grains of wheat near the barn.",
      '"Who will help me plant these seeds?" she asked.',
      '"Not I," said the dog. "Not I," said the cat. "Not I," said the duck.',
    ],
    illustration: "hen",
  },
  {
    pageNumber: 3,
    title: "Planting Day",
    content: [
      '"Then I will plant them myself," said the little red hen.',
      "She dug soft holes in the soil and carefully placed each seed.",
      "She watered the ground and waited for the wheat to grow.",
    ],
  },
  {
    pageNumber: 4,
    title: "Growing Tall",
    content: [
      "Week after week, the wheat grew tall and golden under the bright sun.",
      '"Who will help me cut the wheat?" asked the little red hen.',
      'Again, the dog, the cat, and the duck all said, "Not I."',
    ],
    illustration: "plant",
  },
  {
    pageNumber: 5,
    title: "Making Flour",
    content: [
      "So the little red hen cut the wheat and took it to the mill.",
      "She ground the wheat into soft, white flour all by herself.",
      '"Who will help me bake the bread?" she asked once more.',
    ],
  },
  {
    pageNumber: 6,
    title: "Fresh Bread",
    content: [
      '"Not I," said her friends again. So she baked a warm loaf of bread.',
      "The kitchen filled with a wonderful smell of fresh bread.",
      "When the bread was ready, her friends suddenly wanted to help eat it!",
    ],
    illustration: "hen",
  },
  {
    pageNumber: 7,
    title: "A Fair Share",
    content: [
      '"I planted, cut, and baked alone," said the little red hen kindly.',
      '"Next time, if we work together, we can share the bread together."',
      "The dog, cat, and duck felt sorry and promised to help next time.",
    ],
  },
  {
    pageNumber: 8,
    title: "Working Together",
    content: [
      "From that day on, the friends helped one another on the farm.",
      "They learned that hard work and sharing make everyone happier.",
      "And the little red hen smiled, because teamwork made the farm brighter.",
    ],
    illustration: "community",
  },
];

function material(partial: {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  grade: Grade;
  week: number;
  level: Level;
  thumbnail: ThumbnailTheme;
  featured?: boolean;
  pages?: ReadingPage[];
}): ReadingMaterial {
  return {
    ...partial,
    pages:
      partial.pages ??
      shortPages(partial.title, [
        partial.description,
        "Read slowly and look for the main idea.",
        "Share one new thing you learned today.",
      ], partial.thumbnail),
  };
}

export const readingMaterials: ReadingMaterial[] = [
  // Grade 1
  material({
    id: "g1-w1-l1-abc-sounds",
    title: "ABC Letter Sounds",
    description: "Learn the sounds of letters A, B, and C with fun examples.",
    subject: "English",
    grade: 1,
    week: 1,
    level: 1,
    thumbnail: "phonics",
    featured: true,
  }),
  material({
    id: "g1-w1-l2-my-family",
    title: "My Family",
    description: "Read short sentences about the people in your family.",
    subject: "English",
    grade: 1,
    week: 1,
    level: 2,
    thumbnail: "community",
  }),
  material({
    id: "g1-w2-l1-counting-10",
    title: "Counting to 10",
    description: "Practice counting objects from 1 to 10.",
    subject: "Science",
    grade: 1,
    week: 2,
    level: 1,
    thumbnail: "operations",
  }),
  material({
    id: "g1-w3-l1-colors-around-us",
    title: "Colors Around Us",
    description: "Name colors you see at home and in school.",
    subject: "Science",
    grade: 1,
    week: 3,
    level: 1,
    thumbnail: "plant",
  }),
  material({
    id: "g1-w4-l2-mga-hayop",
    title: "Mga Hayop sa Bukid",
    description: "Alamin ang mga hayop na makikita sa bukid.",
    subject: "Filipino",
    grade: 1,
    week: 4,
    level: 2,
    thumbnail: "hen",
  }),

  // Grade 2
  material({
    id: "phonics-and-word-families",
    title: "Phonics and Word Families",
    description:
      "Practice letter sounds and word families to become a confident young reader.",
    subject: "English",
    grade: 2,
    week: 1,
    level: 1,
    thumbnail: "phonics",
    featured: true,
    pages: shortPages(
      "Letter Sounds",
      [
        "Phonics helps us connect letters with the sounds they make.",
        "When we know sounds, we can blend them into words.",
        "Cat, hat, and mat belong to the -at family.",
        "Great job! Practice makes reading easier every day.",
      ],
      "phonics",
    ),
  }),
  material({
    id: "g2-w1-l2-short-vowels",
    title: "Short Vowel Friends",
    description: "Practice short a, e, i, o, and u in simple words.",
    subject: "English",
    grade: 2,
    week: 1,
    level: 2,
    thumbnail: "phonics",
  }),
  material({
    id: "g2-w2-l1-addition-stories",
    title: "Addition Stories",
    description: "Solve addition problems told as short stories.",
    subject: "Science",
    grade: 2,
    week: 2,
    level: 1,
    thumbnail: "operations",
  }),
  material({
    id: "g2-w3-l2-weather-watch",
    title: "Weather Watch",
    description: "Observe sunny, rainy, and cloudy days.",
    subject: "Science",
    grade: 2,
    week: 3,
    level: 2,
    thumbnail: "water",
  }),
  material({
    id: "g2-w4-l3-tulong-sa-bahay",
    title: "Tulong sa Bahay",
    description: "Basahin kung paano tumutulong ang bata sa bahay.",
    subject: "Filipino",
    grade: 2,
    week: 4,
    level: 3,
    thumbnail: "community",
  }),

  // Grade 3
  material({
    id: "the-little-red-hen",
    title: "The Little Red Hen",
    description:
      "A kind hen learns the value of hard work and sharing with her farm friends.",
    subject: "English",
    grade: 3,
    week: 1,
    level: 2,
    thumbnail: "hen",
    featured: true,
    pages: littleRedHenPages,
  }),
  material({
    id: "my-community",
    title: "My Community",
    description:
      "Explore people, places, and helpers that make a community strong and kind.",
    subject: "Filipino",
    grade: 3,
    week: 2,
    level: 1,
    thumbnail: "community",
    featured: true,
    pages: shortPages(
      "Where We Live",
      [
        "A community is a place where people live, work, and help one another.",
        "It may include homes, schools, parks, markets, and clinics.",
        "Teachers, doctors, and firefighters are community helpers.",
        "A caring community is a happy place for children.",
      ],
      "community",
    ),
  }),
  material({
    id: "basic-operations",
    title: "Basic Operations",
    description:
      "Build confidence with addition, subtraction, multiplication, and division.",
    subject: "Science",
    grade: 3,
    week: 3,
    level: 2,
    thumbnail: "operations",
    pages: shortPages(
      "Add and Subtract",
      [
        "Addition puts numbers together. Subtraction takes some away.",
        "Example: 12 + 5 = 17. Example: 20 − 8 = 12.",
        "Multiplication is repeated addition. Division splits into equal groups.",
        "Math gets easier with practice and patience!",
      ],
      "operations",
    ),
  }),
  material({
    id: "g3-w4-l3-healthy-habits",
    title: "Healthy Habits",
    description: "Learn daily habits that keep your body strong.",
    subject: "Science",
    grade: 3,
    week: 4,
    level: 3,
    thumbnail: "plant",
  }),

  // Grade 4
  material({
    id: "parts-of-a-plant",
    title: "Parts of a Plant",
    description:
      "Discover roots, stems, leaves, flowers, and how plants grow and stay healthy.",
    subject: "Science",
    grade: 4,
    week: 1,
    level: 1,
    thumbnail: "plant",
    featured: true,
    pages: shortPages(
      "Meet a Plant",
      [
        "Plants are living things that need sunlight, water, air, and soil.",
        "Roots hold the plant in the ground and take in water and nutrients.",
        "Leaves make food for the plant using sunlight.",
        "When we care for plants, we care for our Earth too.",
      ],
      "plant",
    ),
  }),
  material({
    id: "understanding-fractions",
    title: "Understanding Fractions",
    description:
      "Learn how to read, write, and compare simple fractions with clear examples.",
    subject: "Science",
    grade: 4,
    week: 2,
    level: 2,
    thumbnail: "fractions",
    featured: true,
    pages: shortPages(
      "What Is a Fraction?",
      [
        "A fraction shows equal parts of a whole.",
        "If a pizza is cut into 4 equal slices, each slice is 1/4.",
        "Count the colored parts and write the fraction.",
        "Remember: equal parts make fair fractions!",
      ],
      "fractions",
    ),
  }),
  material({
    id: "the-water-cycle",
    title: "The Water Cycle",
    description:
      "Follow water as it evaporates, forms clouds, and returns as rain.",
    subject: "Science",
    grade: 4,
    week: 3,
    level: 2,
    thumbnail: "water",
    pages: shortPages(
      "Water on the Move",
      [
        "Water travels in a never-ending journey called the water cycle.",
        "The sun warms oceans, rivers, and lakes.",
        "When clouds get heavy, water falls back as rain or snow.",
        "The water cycle keeps our planet alive.",
      ],
      "water",
    ),
  }),
  material({
    id: "mga-bayaning-pilipino",
    title: "Mga Bayaning Pilipino",
    description:
      "Alamin ang mga kuwento ng mga bayaning Pilipino na may tapang at dangal.",
    subject: "Filipino",
    grade: 4,
    week: 4,
    level: 3,
    thumbnail: "heroes",
    pages: shortPages(
      "Sino ang Bayani?",
      [
        "Ang bayani ay taong may tapang, dangal, at pagmamahal sa bayan.",
        "Si Jose Rizal ay nagsulat upang gisingin ang isipan ng mga tao.",
        "Maaari ring maging bayani ang isang bata.",
        "Ang maliliit na mabubuting gawa ay mahalaga sa ating bayan.",
      ],
      "heroes",
    ),
  }),

  // Grade 5
  material({
    id: "g5-w1-l1-main-idea",
    title: "Finding the Main Idea",
    description: "Identify the main idea and supporting details in a paragraph.",
    subject: "English",
    grade: 5,
    week: 1,
    level: 1,
    thumbnail: "phonics",
  }),
  material({
    id: "g5-w2-l2-decimals",
    title: "Introduction to Decimals",
    description: "Read and compare tenths and hundredths.",
    subject: "Science",
    grade: 5,
    week: 2,
    level: 2,
    thumbnail: "fractions",
  }),
  material({
    id: "g5-w3-l1-ecosystems",
    title: "Living in Ecosystems",
    description: "Explore how plants and animals depend on each other.",
    subject: "Science",
    grade: 5,
    week: 3,
    level: 1,
    thumbnail: "plant",
  }),
  material({
    id: "g5-w4-l3-regions",
    title: "Regions of the Philippines",
    description: "Learn about major regions and their communities.",
    subject: "Filipino",
    grade: 5,
    week: 4,
    level: 3,
    thumbnail: "community",
  }),

  // Grade 6
  {
    id: "cyber-attack",
    title: "Cyber Attack",
    description:
      "Grade 6 Week 1 Level 1 Science reading about cyber attacks and staying safe online.",
    subject: "Science",
    grade: 6,
    week: 1,
    level: 1,
    thumbnail: "water",
    coverImageUrl: "/materials/cyber-attack.pdf",
    downloadUrl: "/materials/cyber-attack.pdf",
    featured: true,
    pages: [
      {
        pageNumber: 1,
        content: [],
        imageUrl: "/materials/cyber-attack.pdf",
        mediaType: "pdf",
      },
    ],
  },
  material({
    id: "g6-w1-l2-persuasive-reading",
    title: "Reading Persuasive Texts",
    description: "Notice opinions, reasons, and evidence in short articles.",
    subject: "English",
    grade: 6,
    week: 1,
    level: 2,
    thumbnail: "phonics",
  }),
  {
    id: "facts-about-the-sun",
    title: "Facts About the Sun",
    description:
      "Grade 6 Week 2 Level 1 reading worksheet about the Sun.",
    subject: "Science",
    grade: 6,
    week: 2,
    level: 1,
    thumbnail: "water",
    coverImageUrl: "/materials/facts-about-the-sun.jpg",
    downloadUrl: "/materials/facts-about-the-sun.jpg",
    featured: true,
    pages: [
      {
        pageNumber: 1,
        content: [],
        imageUrl: "/materials/facts-about-the-sun.jpg",
      },
    ],
  },
  {
    id: "our-moon",
    title: "Our Moon: The Earth's Closest Neighbor",
    description:
      "Grade 6 Week 2 Level 2 reading worksheet about the Moon.",
    subject: "Science",
    grade: 6,
    week: 2,
    level: 2,
    thumbnail: "water",
    coverImageUrl: "/materials/our-moon.jpg",
    downloadUrl: "/materials/our-moon.jpg",
    pages: [
      {
        pageNumber: 1,
        content: [],
        imageUrl: "/materials/our-moon.jpg",
      },
    ],
  },
  {
    id: "our-unique-earth",
    title: "Our Unique Earth: Dynamic and Alive",
    description:
      "Grade 6 Week 2 Level 3 reading worksheet about Earth.",
    subject: "Science",
    grade: 6,
    week: 2,
    level: 3,
    thumbnail: "plant",
    coverImageUrl: "/materials/our-unique-earth.jpg",
    downloadUrl: "/materials/our-unique-earth.jpg",
    pages: [
      {
        pageNumber: 1,
        content: [],
        imageUrl: "/materials/our-unique-earth.jpg",
      },
    ],
  },
  material({
    id: "g6-w3-l2-energy-forms",
    title: "Forms of Energy",
    description: "Compare light, heat, sound, and motion energy.",
    subject: "Science",
    grade: 6,
    week: 3,
    level: 2,
    thumbnail: "water",
  }),
  material({
    id: "g6-w4-l1-panitikan",
    title: "Maikling Kwento",
    description: "Basahin ang isang maikling kwento at sagutin ang mga tanong.",
    subject: "Filipino",
    grade: 6,
    week: 4,
    level: 1,
    thumbnail: "heroes",
  }),
];

export function getReadingMaterialById(
  id: string,
): ReadingMaterial | undefined {
  return readingMaterials.find((material) => material.id === id);
}

export function getFeaturedMaterials(limit = 4): ReadingMaterial[] {
  const featured = readingMaterials.filter((material) => material.featured);
  return (featured.length > 0 ? featured : readingMaterials).slice(0, limit);
}

export function getMaterialsByGrade(
  grade: Grade,
  materials: ReadingMaterial[] = readingMaterials,
): ReadingMaterial[] {
  return materials
    .filter((material) => material.grade === grade)
    .sort((a, b) => a.week - b.week || a.level - b.level || a.title.localeCompare(b.title));
}
