// Sajal & Aditi's Premium Birthday Surprise Website Configuration
const CONFIG = {
  // Names
  partnerName: "Sajal Patil",
  userName: "Aditi Pore",
  
  // Custom Background Music (Elegant, romantic acoustic streaming stream)
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  
  // Classy Romantic Quiz Questions
  quiz: [
    {
      id: 1,
      question: "When did our beautiful story begin? (Our Special Anniversary):",
      options: [
        "10th June 2025",
        "12th July 2025",
        "15th August 2025",
        "20th May 2025"
      ],
      correctAnswer: "12th July 2025",
      hint: "Think of a warm July summer day... the 12th! 😉"
    },
    {
      id: 2,
      question: "Where did we share our very first date?",
      options: [
        "Cafeteria",
        "Katha",
        "Meridian"
      ],
      correctAnswer: "Katha",
      hint: "It starts with a K... where we had our first beautiful moments! ☕"
    },
    {
      id: 3,
      question: "What is the sweet sport/interest that brought us closer together?",
      options: [
        "Being in one batch",
        "Biology presentation",
        "Badminton"
      ],
      correctAnswer: "Badminton",
      hint: "It involves a racket, a shuttlecock, and a lot of sweet competitive energy! 🏸"
    },
    {
      id: 4,
      question: "What is the thing that I adore the most about you?",
      options: [
        "Patience",
        "Looks",
        "Skills"
      ],
      isSpecial: true,
      
      // ==========================================
      // CUSTOMIZE YOUR SPECIAL Q4 MODAL REVEAL HERE:
      // You can edit both the Title and the Answer text below!
      // ==========================================
      specialTitle: "Well Mr. Sajal Patil", 
      specialReveal: "I love everything about you❤️",
      
      hint: "Is it really just one of these? Try picking any option to find out!"
    }
  ],

  // Polaroid Photo Gallery Memories (Points to your local .jpeg files in the root folder)
  memories: [
    {
      image: "photo1.jpeg",
      placeholderText: "Memory 1: Our First Chapter",
      caption: "Where our beautiful story started... every second became precious. ✨"
    },
    {
      image: "photo2.jpeg",
      placeholderText: "Memory 2: Perfect Matches",
      caption: "Our first date❤️"
    },
    {
      image: "photo3.jpeg",
      placeholderText: "Memory 3: Conversations",
      caption: "The first time we held hands💕"
    },
    {
      image: "photo4.jpeg",
      placeholderText: "Memory 4: My Anchor",
      caption: "You know this photo😉"
    },
    {
      image: "photo5.jpeg",
      placeholderText: "Memory 5: That Perfect Smile",
      caption: "I would do anything to keep that gorgeous smile on your face forever."
    }
  ],

  // Birthday Message (Typed typewriter effect)
  letter: {
    salutation: "To Mr. Sajal Patil,",
    paragraphs: [
      "You probably know me, well I am a vichitra person who is also known as Aditi. I was in a bad bad state of mind when I met you and since then I have turned your state of mind as bad as mine😅,",
      "I met a Man who took so much care of me even though I hurt him soooo much, always loved me understood me and held me at my worst like an anchor,",
      "thank you soooo much love for understanding me for making my days better when I didn't even feel like eating even food, thank you sooo much love for everything,",
      "I love you sooooo sooooo much that I can't describe it in words. I want to spend my rest of my life with you and keep you happy and would die for that one smile on your face."
    ],
    signature: "With all my love,\nAditi"
  }
};
