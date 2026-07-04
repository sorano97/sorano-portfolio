export type WorkCategory = "Art & Design" | "Software & Hardware";

export interface Work {
  id: string;
  category: WorkCategory;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  url?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  body: string;
  url?: string;
}

export interface ContactLink {
  label: "Instagram" | "GitHub" | "Mail";
  href: string;
  enabled: boolean;
}

export interface Profile {
  name: string;
  role: string;
  focus: string[];
  about: string;
  dream: string;
  favorites: string[];
  skills: Array<{
    name: string;
    level: number;
  }>;
  tools: string[];
}

export interface RandomMessage {
  id: string;
  text: string;
}

export interface CharacterQuestionOption {
  label: string;
  response: string;
}

export interface CharacterQuestion {
  id: string;
  question: string;
  options: CharacterQuestionOption[];
  rare?: boolean;
}

export const profile: Profile = {
  name: "sorano",
  role: "Student Creator",
  about: "I'm a student creator who enjoys making software, hardware and cute designs.",
  focus: ["Software", "Hardware", "Design", "Pixel Art"],
  dream: 'Spread "cute" to the world.',
  favorites: ["🍊 Oranges", "🎮 Games", "☕ Tea", "🐈 Cats"],
  skills: [
    {
      name: "Software",
      level: 4
    },
    {
      name: "Hardware",
      level: 3
    },
    {
      name: "Design",
      level: 5
    },
    {
      name: "Pixel Art",
      level: 4
    }
  ],
  tools: ["VS Code", "Figma", "Fusion360", "Illustrator", "Photoshop", "Blender"]
};

export const news: NewsItem[] = [
  {
    id: "portfolio-started",
    date: "2025.01.01",
    title: "Portfolio site started.",
    body: "Portfolio site started."
  },
  {
    id: "new-works",
    date: "2025.01.15",
    title: "Added new works.",
    body: "Added new works."
  },
  {
    id: "profile-updated",
    date: "2025.02.01",
    title: "Updated profile.",
    body: "Updated profile."
  }
];

export const works: Work[] = [
  {
    id: "pixel-room",
    category: "Art & Design",
    title: "Pixel Room",
    description: "A soft pixel-art room design with small cute details.",
    tags: ["Pixel Art", "Illustration", "Design"]
  },
  {
    id: "kawaii-logo",
    category: "Art & Design",
    title: "Kawaii Logo Study",
    description: "Logo and visual identity sketches for a cute product world.",
    tags: ["Logo", "Branding", "Design"]
  },
  {
    id: "character-sheets",
    category: "Art & Design",
    title: "Character Sheets",
    description: "Character expressions and simple pose explorations.",
    tags: ["Character", "Art", "Pixel"]
  },
  {
    id: "portfolio-system",
    category: "Software & Hardware",
    title: "Portfolio System",
    description: "A game-like web portfolio built with Next.js.",
    tags: ["Next.js", "TypeScript", "UI"]
  },
  {
    id: "tiny-device",
    category: "Software & Hardware",
    title: "Tiny Device Prototype",
    description: "A hardware concept that connects cute visuals and interaction.",
    tags: ["Hardware", "Prototype", "Interaction"]
  },
  {
    id: "creative-tool",
    category: "Software & Hardware",
    title: "Creative Tool",
    description: "A small software tool for organizing creative ideas.",
    tags: ["Software", "Tool", "Design"]
  }
];

export const contacts: ContactLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/sorano_28",
    enabled: true
  },
  {
    label: "GitHub",
    href: "https://github.com/sorano97",
    enabled: true
  },
  {
    label: "Mail",
    href: "tsorano.0528@gmail.com",
    enabled: true
  }
];

export const randomMessages: RandomMessage[] = [
  {
    id: "hello",
    text: "Hello!"
  },
  {
    id: "welcome",
    text: "Welcome!"
  },
  {
    id: "take-your-time",
    text: "Take your time!"
  },
  {
    id: "explore",
    text: "Let's explore!"
  },
  {
    id: "sorano",
    text: "I'm sorano."
  },
  {
    id: "student",
    text: "I'm a student creator."
  },
  {
    id: "pixel-art",
    text: "I love pixel art."
  },
  {
    id: "cute",
    text: "Cute makes people smile."
  },
  {
    id: "profile",
    text: "Check my profile!"
  },
  {
    id: "works",
    text: "Look at my works!"
  },
  {
    id: "contact",
    text: "Feel free to contact me!"
  },
  {
    id: "thanks",
    text: "Thanks for visiting."
  }
];

export const characterQuestions: CharacterQuestion[] = [
  {
    id: "oranges",
    question: "Do you like oranges?",
    options: [
      {
        label: "YES",
        response: "Me too! 🍊"
      },
      {
        label: "NO",
        response: "Oh...\nMaybe someday."
      }
    ]
  },
  {
    id: "pixel-art",
    question: "Do you like pixel art?",
    options: [
      {
        label: "YES",
        response: "Yay!\nI'm happy to hear that!"
      },
      {
        label: "NO",
        response: "That's okay.\nEveryone has their own taste!"
      }
    ]
  },
  {
    id: "making-things",
    question: "Do you enjoy making things?",
    options: [
      {
        label: "YES",
        response: "That's awesome!\nLet's keep creating!"
      },
      {
        label: "NO",
        response: "Maybe you'll find\nsomething you enjoy someday."
      }
    ]
  },
  {
    id: "cute-things",
    question: "Do you like cute things?",
    options: [
      {
        label: "YES",
        response: "Me too!\n\"Cute\" makes\npeople smile."
      },
      {
        label: "NO",
        response: "Hmm...\nReally?"
      }
    ]
  },
  {
    id: "coffee-tea",
    question: "Coffee or Tea?",
    options: [
      {
        label: "Coffee",
        response: "Nice choice!"
      },
      {
        label: "Tea",
        response: "Tea is relaxing."
      }
    ]
  },
  {
    id: "cats-dogs",
    question: "Cats or Dogs?",
    options: [
      {
        label: "Cats",
        response: "Cats are adorable!"
      },
      {
        label: "Dogs",
        response: "Dogs are wonderful too!"
      }
    ]
  },
  {
    id: "having-fun",
    question: "Are you having fun?",
    options: [
      {
        label: "YES",
        response: "I'm glad!"
      },
      {
        label: "NO",
        response: "I'll try harder..."
      }
    ]
  },
  {
    id: "come-back",
    question: "Will you come back again?",
    options: [
      {
        label: "YES",
        response: "I'll be waiting!"
      },
      {
        label: "NO",
        response: "I'll miss you..."
      }
    ]
  },
  {
    id: "secret",
    question: "Can you keep a secret?",
    rare: true,
    options: [
      {
        label: "YES",
        response: "...\nThank you."
      },
      {
        label: "NO",
        response: "Then I'll keep it myself."
      }
    ]
  }
];
