export interface Book {
  id: string;
  title: string;
  author: string;
  tags: string[];
  genre: string; // New field
  available: number;
  total: number;
  description: string;
  coverColor: string;
  reviews?: Review[]; // New field
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
}

export interface Loan {
  id: string;
  book: Book;
  dueDate: Date;
  isOverdue: boolean;
}

export interface ReturnedLoan {
  id: string;
  book: Book;
  returnedDate: Date;
}

export interface BookQuote {
  text: string;
  author: string;
  book: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  password: string; // In a real app, this would be hashed
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  status: "pending" | "approved" | "ready" | "denied" | "expired";
  queuePosition?: number;
  requestedAt: Date;
  pickupDeadline?: Date;
}

export interface AdminNote {
  id: string;
  userId: string;
  adminId: string;
  loanId: string;
  rating: "excellent" | "good" | "warning" | "bad";
  note: string;
  tags: string[];
  date: Date;
}

export interface UserStats {
  totalLoans: number;
  lateReturns: number;
  avgReturnDelay: number;
  cancellations: number;
  reliabilityScore: number; // 0-100
}

export const bookQuotes: BookQuote[] = [
  {
    text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
    book: "A Dance with Dragons"
  },
  {
    text: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    book: ""
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
    book: "On Writing"
  },
  {
    text: "The only thing that you absolutely have to know is the location of the library.",
    author: "Albert Einstein",
    book: ""
  },
  {
    text: "I have always imagined that Paradise will be a kind of library.",
    author: "Jorge Luis Borges",
    book: ""
  },
  {
    text: "A room without books is like a body without a soul.",
    author: "Marcus Tullius Cicero",
    book: ""
  }
];

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Midnight Garden",
    author: "Eleanor Hayes",
    tags: ["fantasy", "magic", "adventure"],
    genre: "fantasy",
    available: 3,
    total: 5,
    description: "A young botanist discovers a garden that only exists at midnight, where magical plants hold the key to saving her dying grandmother. As she delves deeper into the garden's mysteries, she uncovers a family secret that spans generations.",
    coverColor: "#2C5F2D",
    reviews: [
      {
        id: "rev1",
        userId: "u1",
        userName: "Alice Johnson",
        rating: 5,
        comment: "A beautifully written story with enchanting descriptions. I couldn't put it down!",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: "rev2",
        userId: "u2",
        userName: "Bob Smith",
        rating: 4,
        comment: "Great book! The magical garden was wonderfully imagined.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "2",
    title: "Whispers in the Archive",
    author: "Marcus Chen",
    tags: ["mystery", "historical", "thriller"],
    genre: "mystery",
    available: 0,
    total: 4,
    description: "An archivist stumbles upon coded documents that reveal a conspiracy dating back to the Cold War. As she races to decode the messages, she realizes someone is willing to kill to keep these secrets buried.",
    coverColor: "#8B4513",
    reviews: [
      {
        id: "rev3",
        userId: "u1",
        userName: "Alice Johnson",
        rating: 5,
        comment: "A gripping thriller that kept me guessing until the very end. Highly recommend!",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "3",
    title: "The Last Lighthouse Keeper",
    author: "Ingrid Larsson",
    tags: ["literary fiction", "drama", "solitude"],
    genre: "literary fiction",
    available: 2,
    total: 3,
    description: "Set on a remote island, this contemplative novel follows an aging lighthouse keeper who must confront his past when a mysterious stranger arrives during a violent storm.",
    coverColor: "#6B1F3D",
    reviews: []
  },
  {
    id: "4",
    title: "Echoes of Tomorrow",
    author: "Adrian Park",
    tags: ["sci-fi", "dystopian", "thriller"],
    genre: "sci-fi",
    available: 1,
    total: 6,
    description: "In a world where memories can be bought and sold, a memory thief begins to question the nature of identity when she experiences someone else's life and can't let go.",
    coverColor: "#2C5F2D",
    reviews: [
      {
        id: "rev4",
        userId: "u2",
        userName: "Bob Smith",
        rating: 4,
        comment: "Fascinating concept and well-executed. Made me think about identity in new ways.",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "5",
    title: "The Cartographer's Daughter",
    author: "Yasmin Al-Rahman",
    tags: ["historical fiction", "adventure", "family"],
    genre: "historical fiction",
    available: 4,
    total: 4,
    description: "Following her father's death, a young woman discovers his unfinished map that leads to a lost city. Her journey across continents reveals not just ancient secrets, but the truth about her own heritage.",
    coverColor: "#C19A6B",
    reviews: []
  },
  {
    id: "6",
    title: "Breaking Bread",
    author: "Sofia Moretti",
    tags: ["contemporary", "romance", "culinary"],
    genre: "romance",
    available: 2,
    total: 5,
    description: "A burnt-out chef returns to her grandmother's village in Tuscany to rediscover her passion for cooking, finding unexpected love and healing in the process.",
    coverColor: "#D4AF37",
    reviews: [
      {
        id: "rev5",
        userId: "u1",
        userName: "Alice Johnson",
        rating: 5,
        comment: "Heartwarming and delicious! This book made me want to visit Tuscany immediately.",
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: "7",
    title: "The Quantum Paradox",
    author: "Dr. Sarah Mitchell",
    tags: ["sci-fi", "mystery", "thriller"],
    genre: "sci-fi",
    available: 0,
    total: 3,
    description: "A physicist discovers that her research into quantum entanglement is creating ripples in parallel universes. When versions of herself from other realities start dying mysteriously, she must solve her own murder before it happens.",
    coverColor: "#2C5F2D",
    reviews: []
  },
  {
    id: "8",
    title: "Songs of the Steppe",
    author: "Bataar Erdene",
    tags: ["historical fiction", "epic", "classic"],
    genre: "historical fiction",
    available: 3,
    total: 3,
    description: "An epic tale of the Mongolian Empire, following three generations of a nomadic family as they navigate war, love, and the changing landscape of their homeland.",
    coverColor: "#8B4513",
    reviews: []
  },
  {
    id: "9",
    title: "The Bookmark Murders",
    author: "Detective Clara Finch",
    tags: ["mystery", "thriller", "crime"],
    genre: "mystery",
    available: 1,
    total: 4,
    description: "A serial killer leaves cryptic bookmarks at crime scenes, each one a clue to the next victim. A librarian-turned-detective must use her knowledge of literature to crack the code before time runs out.",
    coverColor: "#6B1F3D",
    reviews: []
  },
  {
    id: "10",
    title: "Wild Honey",
    author: "Nneka Okafor",
    tags: ["contemporary", "family", "drama"],
    genre: "drama",
    available: 5,
    total: 5,
    description: "Three sisters reunite at their childhood home in rural Nigeria after their mother's death, confronting long-buried resentments and rediscovering the bonds that hold them together.",
    coverColor: "#C19A6B",
    reviews: []
  },
  {
    id: "11",
    title: "The Glass Theorem",
    author: "Prof. James Whitmore",
    tags: ["sci-fi", "philosophy", "adventure"],
    genre: "sci-fi",
    available: 2,
    total: 4,
    description: "When a mathematician proves that reality is just one of infinite simulations, she must decide whether to share her discovery with the world or protect humanity from an existential crisis.",
    coverColor: "#2C5F2D",
    reviews: []
  },
  {
    id: "12",
    title: "Beneath the Cherry Blossoms",
    author: "Kenji Tanaka",
    tags: ["romance", "historical fiction", "drama"],
    genre: "romance",
    available: 1,
    total: 3,
    description: "Set in 1950s Kyoto, a forbidden love blooms between a geisha and a foreign correspondent as Japan rebuilds itself after the war.",
    coverColor: "#D4AF37",
    reviews: []
  }
];

export const mockLoans: Loan[] = [
  {
    id: "l1",
    book: mockBooks[0],
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    isOverdue: false
  },
  {
    id: "l2",
    book: mockBooks[3],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    isOverdue: false
  },
  {
    id: "l3",
    book: mockBooks[5],
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    isOverdue: true
  }
];

export const mockReturnedLoans: ReturnedLoan[] = [
  {
    id: "r1",
    book: mockBooks[7],
    returnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: "r2",
    book: mockBooks[9],
    returnedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  },
  {
    id: "r3",
    book: mockBooks[2],
    returnedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  }
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "user",
    password: "password123" // In a real app, this would be hashed
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "user",
    password: "password456" // In a real app, this would be hashed
  },
  {
    id: "u3",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "admin",
    password: "admin789" // In a real app, this would be hashed
  }
];

export const mockReservations: Reservation[] = [
  {
    id: "res1",
    userId: "u1",
    userName: "Alice Johnson",
    userEmail: "alice.johnson@example.com",
    bookId: "1",
    bookTitle: "The Midnight Garden",
    status: "pending",
    requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "res2",
    userId: "u2",
    userName: "Bob Smith",
    userEmail: "bob.smith@example.com",
    bookId: "2",
    bookTitle: "Whispers in the Archive",
    status: "approved",
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    pickupDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  }
];

export const mockAdminNotes: AdminNote[] = [
  {
    id: "an1",
    userId: "u1",
    adminId: "u3",
    loanId: "l1",
    rating: "excellent",
    note: "Alice returned the book in perfect condition and on time.",
    tags: ["on time", "perfect condition"],
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: "an2",
    userId: "u2",
    adminId: "u3",
    loanId: "l2",
    rating: "good",
    note: "Bob returned the book a day late but in good condition.",
    tags: ["late", "good condition"],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
];

export const mockUserStats: UserStats[] = [
  {
    totalLoans: 5,
    lateReturns: 1,
    avgReturnDelay: 1.2,
    cancellations: 0,
    reliabilityScore: 85
  },
  {
    totalLoans: 3,
    lateReturns: 0,
    avgReturnDelay: 0,
    cancellations: 1,
    reliabilityScore: 90
  }
];