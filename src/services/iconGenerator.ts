import Replicate from 'replicate';

let replicateClient: Replicate | null = null;

function getReplicateClient(): Replicate {
  if (!replicateClient) {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      throw new Error('REPLICATE_API_TOKEN environment variable is not set');
    }
    replicateClient = new Replicate({ auth: token });
  }
  return replicateClient;
}

export const PRESET_STYLES = {
  pastels: {
    name: 'Pastels',
    description: 'Soft, muted colors with gentle gradients and rounded shapes',
    stylePrompt: 'rounded shapes, minimalist, light colored background, cute aesthetic, soft lighting',
    stylePromptWithColor: 'rounded shapes, minimalist, white background, cute aesthetic, soft lighting'
  },
  bubbles: {
    name: 'Bubbles',
    description: 'Glossy, 3D bubble-like appearance with reflections',
    stylePrompt: '3D glossy style, reflective surfaces, glass-like, light reflections, shiny, playful',
    stylePromptWithColor: '3D glossy style, reflective surfaces, shiny, playful, white background'
  },
  flat: {
    name: 'Flat Design',
    description: 'Clean, modern flat design with bold colors and simple shapes',
    stylePrompt: 'flat design, bold solid colors, geometric shapes, clean lines, vector art style, high contrast',
    stylePromptWithColor: 'flat design, geometric shapes, clean lines, vector art style, white background'
  },
  isometric: {
    name: 'Isometric',
    description: '3D isometric perspective with depth and dimension',
    stylePrompt: 'isometric 3D view, 30 degree angle, geometric, depth and dimension, clean edges',
    stylePromptWithColor: 'isometric 3D view, 30 degree angle, geometric, depth and dimension, clean edges, white background'
  },
  handDrawn: {
    name: 'Hand Drawn',
    description: 'Sketchy, hand-drawn illustration style with organic lines',
    stylePrompt: 'hand drawn illustration, sketchy lines, artistic, doodle style, whimsical',
    stylePromptWithColor: 'hand drawn illustration, sketchy lines, artistic, doodle style, whimsical, white background'
  }
} as const;

export type PresetStyle = keyof typeof PRESET_STYLES;

const THEME_POOL: Record<string, string[]> = {
  toys: [
    'cute teddy bear plush toy', 'red toy car', 'yellow rubber duck toy', 'wooden rocking horse',
    'colorful building blocks', 'blue toy train', 'pink stuffed bunny', 'toy robot',
    'toy airplane', 'toy drum', 'red bouncy ball', 'toy sailboat', 'colorful kite',
    'green toy dinosaur', 'toy fire truck', 'toy xylophone', 'toy rocket ship',
    'wooden spinning top', 'toy helicopter', 'stuffed elephant toy'
  ],
  food: [
    'pizza slice', 'hamburger', 'ice cream cone', 'cupcake', 'donut', 'taco',
    'hot dog', 'french fries', 'sushi roll', 'cookie', 'apple', 'banana',
    'watermelon slice', 'birthday cake', 'lollipop', 'pretzel', 'popcorn', 'sandwich',
    'croissant', 'pancakes', 'waffle', 'fried egg', 'avocado', 'strawberry'
  ],
  travel: [
    'airplane', 'suitcase', 'passport', 'globe', 'compass', 'map',
    'camera', 'binoculars', 'tent', 'backpack', 'train', 'cruise ship',
    'hot air balloon', 'luggage tag', 'sunglasses', 'beach umbrella', 'palm tree', 'lighthouse'
  ],
  technology: [
    'smartphone', 'laptop computer', 'headphones', 'camera', 'smartwatch', 'tablet',
    'desktop computer', 'gaming controller', 'USB drive', 'wireless mouse', 'keyboard', 'monitor',
    'VR headset', 'drone', 'robot', 'microchip', 'satellite', 'rocket'
  ],
  sports: [
    'soccer ball', 'basketball', 'tennis racket', 'baseball bat', 'football', 'golf ball',
    'hockey stick', 'volleyball', 'bowling pin', 'skateboard', 'surfboard', 'bicycle',
    'dumbbells', 'boxing gloves', 'medal', 'trophy', 'stopwatch', 'whistle'
  ],
  music: [
    'guitar', 'headphones', 'microphone', 'piano keys', 'drum', 'violin',
    'trumpet', 'saxophone', 'music note', 'vinyl record', 'speaker', 'harmonica',
    'maracas', 'tambourine', 'flute', 'ukulele', 'boombox', 'DJ turntable'
  ],
  nature: [
    'tree', 'flower', 'sun', 'cloud', 'mountain', 'rainbow',
    'leaf', 'mushroom', 'cactus', 'snowflake', 'raindrop', 'lightning bolt',
    'moon', 'star', 'wave', 'campfire', 'pine tree', 'sunflower'
  ],
  animals: [
    'cat', 'dog', 'bird', 'fish', 'rabbit', 'bear',
    'elephant', 'lion', 'penguin', 'owl', 'butterfly', 'ladybug',
    'fox', 'deer', 'whale', 'dolphin', 'turtle', 'bee',
    'frog', 'unicorn', 'panda', 'koala', 'giraffe', 'monkey'
  ],
  office: [
    'pencil', 'notebook', 'coffee cup', 'desk lamp', 'calculator', 'stapler',
    'paperclip', 'folder', 'briefcase', 'calendar', 'clock', 'envelope',
    'scissors', 'ruler', 'sticky note', 'printer', 'desk chair', 'filing cabinet'
  ],
  health: [
    'heart', 'apple', 'dumbbell', 'water bottle', 'stethoscope', 'pill',
    'first aid kit', 'bandage', 'thermometer', 'syringe', 'yoga mat', 'running shoe',
    'smoothie', 'salad bowl', 'meditation pose', 'tooth', 'eye', 'brain'
  ],
  weather: [
    'sun', 'cloud', 'raindrop', 'snowflake', 'lightning bolt', 'rainbow',
    'umbrella', 'thermometer', 'wind', 'tornado', 'fog', 'moon'
  ],
  holidays: [
    'christmas tree', 'pumpkin', 'easter egg', 'firework', 'gift box', 'candy cane',
    'heart balloon', 'party hat', 'birthday cake', 'snowman', 'turkey', 'shamrock'
  ],
  school: [
    'book', 'pencil', 'backpack', 'apple', 'globe', 'ruler',
    'graduation cap', 'school bus', 'chalkboard', 'microscope', 'paint palette', 'calculator'
  ]
};

function hexToColorName(hex: string): string {
  const cleanHex = hex.replace('#', '').toLowerCase();

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;

  if (l < 0.15) return 'black';
  if (l > 0.85) return 'white';

  if (max - min < 30) {
    if (l < 0.4) return 'dark gray';
    if (l > 0.6) return 'light gray';
    return 'gray';
  }

  if (r >= g && r >= b) {
    if (r - g < 50 && g > b + 30) return 'yellow';
    if (r - g < 50 && r - b < 50) return 'orange';
    if (g < 100 && b < 100) return 'red';
    if (b > g) return 'pink';
    if (g > 150) return 'orange';
    return 'red';
  }

  if (g >= r && g >= b) {
    if (g - r < 50 && b < 100) return 'yellow';
    if (b > r + 30) return 'teal';
    if (r > 150) return 'lime green';
    return 'green';
  }

  if (b >= r && b >= g) {
    if (r > g + 30) return 'purple';
    if (r > 150 && g > 150) return 'light blue';
    if (g > r + 30) return 'cyan';
    return 'blue';
  }

  return 'colorful';
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getIconSubjects(theme: string): string[] {
  const lowerTheme = theme.toLowerCase();

  for (const [key, pool] of Object.entries(THEME_POOL)) {
    if (lowerTheme.includes(key) || key.includes(lowerTheme)) {
      const shuffled = shuffleArray(pool);
      return shuffled.slice(0, 4);
    }
  }

  return [
    `${theme} object`,
    `different ${theme} item`,
    `another ${theme} thing`,
    `unique ${theme} element`
  ];
}

export interface GeneratedIcon {
  id: number;
  url: string;
  prompt: string;
}

async function generateSingleIcon(
  subject: string,
  stylePrompt: string,
  colorDescription: string,
  index: number
): Promise<GeneratedIcon> {
  let fullPrompt: string;

  if (colorDescription) {
    fullPrompt = `${subject}, ${colorDescription} color, ${stylePrompt}, white background, digital illustration`;
  } else {
    fullPrompt = `${subject}, ${stylePrompt}, white background, digital illustration`;
  }

  console.log(`Generating icon ${index + 1}: ${subject}`);

  const replicate = getReplicateClient();
  const output = await replicate.run(
    "black-forest-labs/flux-schnell",
    {
      input: {
        prompt: fullPrompt,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "png",
        output_quality: 100,
        num_inference_steps: 4,
        go_fast: false
      }
    }
  );

  const urls = output as string[];
  if (!urls || urls.length === 0) {
    throw new Error('No image generated');
  }

  return {
    id: index + 1,
    url: urls[0],
    prompt: subject
  };
}

function buildColorDescription(brandColors?: string[]): string {
  if (!brandColors || brandColors.length === 0) return '';

  const colorNames = brandColors.map(hex => hexToColorName(hex));
  const uniqueColors = [...new Set(colorNames)];

  if (uniqueColors.length === 1) {
    return uniqueColors[0];
  }
  return uniqueColors.join(' and ');
}

export async function generateIconSet(
  prompt: string,
  presetStyle: PresetStyle,
  brandColors?: string[]
): Promise<GeneratedIcon[]> {
  const style = PRESET_STYLES[presetStyle];
  const colorDescription = buildColorDescription(brandColors);
  const subjects = getIconSubjects(prompt);

  const styleToUse = colorDescription ? style.stylePromptWithColor : style.stylePrompt;

  console.log(`Selected subjects: ${subjects.join(', ')}`);
  if (colorDescription) {
    console.log(`Using colors: ${colorDescription}`);
  }

  const iconPromises = subjects.map((subject, index) =>
    generateSingleIcon(subject, styleToUse, colorDescription, index)
  );

  return Promise.all(iconPromises);
}

export async function regenerateIconWithColor(
  subject: string,
  presetStyle: PresetStyle,
  color: string,
  index: number
): Promise<GeneratedIcon> {
  const style = PRESET_STYLES[presetStyle];
  const colorName = hexToColorName(color);

  console.log(`Regenerating icon ${index + 1} with color: ${colorName}`);

  return generateSingleIcon(subject, style.stylePromptWithColor, colorName, index);
}
