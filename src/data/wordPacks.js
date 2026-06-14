/**
 * IMPOSTER — Word Packs (India & Bangalore Special Edition)
 * Each entry: [civilianWord, imposterWord]
 * Organized by category and content tier.
 */

const wordPacks = {
  safe: {
    bangalore: {
      name: "🌳 Bangalore Life",
      words: [
        ["Indiranagar", "Koramangala"],
        ["Auto Driver", "Uber Driver"],
        ["Filter Coffee", "Starbucks Latte"],
        ["Techie", "Founder"],
        ["RCB", "CSK"],
        ["Toit", "Arbor Brewing Company"],
        ["Silk Board Junction", "Hebbal Flyover"],
        ["HSR Layout", "Outer Ring Road"],
        ["PG Accommodation", "Co-Living Space"],
        ["Corner House", "Polar Bear"],
        ["Metro Route", "One-Way Street"],
        ["Work from Home", "Office Cab"],
      ],
    },
    indian_food: {
      name: "🍛 Indian Food",
      words: [
        ["Biryani", "Pulao"],
        ["Masala Dosa", "Idli"],
        ["Samosa", "Kachori"],
        ["Gulab Jamun", "Rasgulla"],
        ["Pani Puri", "Sev Puri"],
        ["Butter Chicken", "Paneer Butter Masala"],
        ["Jalebi", "Imarti"],
        ["Chai", "Lassi"],
        ["Naan", "Roti"],
        ["Pav Bhaji", "Vada Pav"],
      ],
    },
    food: {
      name: "🍕 General Food",
      words: [
        ["Pizza", "Burger"],
        ["Pasta", "Noodles"],
        ["Coffee", "Tea"],
        ["Sushi", "Dumpling"],
        ["Ice Cream", "Frozen Yogurt"],
        ["Tacos", "Burritos"],
      ],
    },
    movies: {
      name: "🎬 Movies & Shows",
      words: [
        ["Avengers", "Justice League"],
        ["Interstellar", "Gravity"],
        ["Titanic", "The Notebook"],
        ["Harry Potter", "Lord of the Rings"],
        ["The Dark Knight", "Spider-Man"],
        ["Inception", "The Matrix"],
        ["3 Idiots", "Munna Bhai"],
        ["Bahubali", "RRR"],
      ],
    },
    tech: {
      name: "💻 Tech Life",
      words: [
        ["iPhone", "Samsung Galaxy"],
        ["React", "Angular"],
        ["Python", "JavaScript"],
        ["ChatGPT", "Google Gemini"],
        ["Docker", "Kubernetes"],
        ["AWS", "Azure"],
        ["VS Code", "Sublime Text"],
        ["Slack", "Teams"],
      ],
    },
    bollywood: {
      name: "🎭 Bollywood",
      words: [
        ["Shah Rukh Khan", "Salman Khan"],
        ["Deepika Padukone", "Priyanka Chopra"],
        ["DDLJ", "Kuch Kuch Hota Hai"],
        ["Arijit Singh", "Atif Aslam"],
        ["Gangs of Wasseypur", "Sacred Games"],
        ["Hera Pheri", "Phir Hera Pheri"],
      ],
    },
    office: {
      name: "💼 Office Life",
      words: [
        ["Standup", "Retro"],
        ["Deadline", "EOD"],
        ["Manager", "Team Lead"],
        ["Meeting", "Zoom Call"],
        ["Promotion", "Appraisal"],
        ["PR Review", "Code Review"],
        ["Excel", "Google Sheets"],
        ["Salary Hike", "Bonus"],
        ["Offsite", "Team Outing"],
        ["Production Bug", "Hotfix"],
      ],
    },
  },
  casual: {
    dating: {
      name: "💕 Dating & Relationships",
      words: [
        ["First Date", "Blind Date"],
        ["Crush", "Secret Admirer"],
        ["Ghosting", "Breadcrumbing"],
        ["Situationship", "Friends with Benefits"],
        ["Red Flag", "Deal Breaker"],
        ["Swipe Right", "Super Like"],
      ],
    },
    awkward: {
      name: "😬 Awkward Moments",
      words: [
        ["Caught Staring", "Eye Contact"],
        ["Wrong Name", "Memory Blank"],
        ["Accidental Text", "Wrong Group"],
        ["Unmuted on Zoom", "Camera On"],
        ["Snoring in Meeting", "Yawning"],
      ],
    },
  },
  spicy: {
    desi_spicy: {
      name: "🌶️ 18+ Desi / Bangalore",
      words: [
        ["Arranged Marriage", "Tinder Date"],
        ["Kingfisher Premium", "Bira 91"],
        ["Indiranagar Pub Crawl", "HSR House Party"],
        ["Sneaky Link", "Office Romance"],
        ["Netflix and Chill", "Oyo Room Booking"],
        ["Double Meaning Jokes", "Corporate HR Policy"],
        ["Happy Hours", "BYOB Farmhouse"],
        ["Drunk Confession", "HR Mail"],
        ["Hookup", "One Night Stand"],
        ["Safe Word", "Code Word"],
      ],
    },
    romance: {
      name: "🔥 Spicy Romance",
      words: [
        ["Flirting", "Seducing"],
        ["Lingerie", "Swimwear"],
        ["Neck Kiss", "Love Bite"],
        ["Strip Poker", "Spin the Bottle"],
        ["Roleplay", "Acting"],
      ],
    },
  },
  unhinged: {
    chaos: {
      name: "💀 Unhinged Chaos",
      words: [
        ["OnlyFans", "Patreon"],
        ["Handcuffs", "Chains"],
        ["Walk of Shame", "Uber of Shame"],
        ["Body Count", "Kill Count"],
        ["Sext", "DM"],
        ["Thirst Trap", "Bait"],
      ],
    },
  },
};

export default wordPacks;
