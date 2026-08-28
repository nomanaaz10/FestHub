import { collection, doc, writeBatch, getDocs } from "firebase/firestore";

export const initialFests = [
  {
    id: "republic-day-fest-2027",
    title: "Republic Day Fest 2027",
    subtitle: "Celebrating Unity, Culture, Patriotism & Innovation",
    description: "The annual Republic Day Festival brings together students across all departments for a week of electrifying competitions, cultural showcases, debates, and tech innovations. Join over 2,000+ students in commemorating India's heritage and modern achievements.",
    bannerImage: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1400&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80"
    ],
    startDate: "2027-01-20",
    endDate: "2027-01-26",
    venue: "Main Campus Grounds & Multi-Purpose Auditorium",
    likesCount: 142,
    createdBy: "system-admin",
    createdByName: "Festival Directorate",
    category: "National & Cultural",
    createdAt: new Date().toISOString()
  },
  {
    id: "ignite-cultural-fest-2027",
    title: "Ignite: Annual Cultural Fest 2027",
    subtitle: "The Ultimate 4-Day Extravaganza of Music, Dance, Arts & Drama",
    description: "Ignite 2027 is our college's flagship cultural extravaganza, featuring celebrity guest performances, inter-college band wars, dance battles, photography sprints, and theatre productions. Experience the energy and unleash your passion.",
    bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
    ],
    startDate: "2027-02-18",
    endDate: "2027-02-22",
    venue: "Central Open-Air Amphitheatre & North Arena",
    likesCount: 289,
    createdBy: "system-admin",
    createdByName: "Student Cultural Council",
    category: "Cultural & Arts",
    createdAt: new Date().toISOString()
  }
];

export const initialCompetitions = [
  {
    id: "quiz-championship-2027",
    festId: "republic-day-fest-2027",
    festTitle: "Republic Day Fest 2027",
    title: "Inter-College Grand Quiz 2027",
    subtitle: "Test your wits across History, Science, Pop Culture & Current Affairs",
    description: "Battle it out against the sharpest minds from across colleges. 4 rounds including Audio-Visual, Rapid Fire, and Buzzer round. Teams of 2 or individual entries are welcome.",
    bannerImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80"
    ],
    category: "Academic",
    competitionDate: "2027-01-22",
    registrationDeadline: "2027-01-20",
    venue: "Main Seminar Hall A (Block 3)",
    prizePool: "₹25,000 Cash + Trophies",
    rules: "1. Team of up to 2 participants. 2. Mobile phones strictly prohibited during the rounds. 3. Quizmaster decision will be final.",
    likesCount: 88,
    createdBy: "system-admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "poster-making-2027",
    festId: "republic-day-fest-2027",
    festTitle: "Republic Day Fest 2027",
    title: "Visions of India: Poster Making & Digital Art",
    subtitle: "Illustrate your vision of India's future, sustainable growth and cultural pride",
    description: "Bring your creativity to life on canvas or screen. Both traditional medium (acrylic/watercolor/sketch) and digital illustration categories are available.",
    bannerImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80"
    ],
    category: "Fine Arts",
    competitionDate: "2027-01-23",
    registrationDeadline: "2027-01-21",
    venue: "Design & Fine Arts Studio (Block 1)",
    prizePool: "₹15,000 + Art Kit Hampers",
    rules: "1. Drawing sheets provided. 2. Time limit: 2 hours. 3. Digital artists must bring their own graphic tablet.",
    likesCount: 64,
    createdBy: "system-admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "debate-challenge-2027",
    festId: "republic-day-fest-2027",
    festTitle: "Republic Day Fest 2027",
    title: "Voice of Youth: National Debate Challenge",
    subtitle: "Parliamentary style debate on geopolitical ethics, tech sovereignty and democracy",
    description: "Engage in fiery, structured discourse. Test your oratorical prowess, counter-arguments, and persuasion skills before an esteemed panel of judges.",
    bannerImage: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80"
    ],
    category: "Literary",
    competitionDate: "2027-01-24",
    registrationDeadline: "2027-01-22",
    venue: "Moot Court Hall (Law Block)",
    prizePool: "₹20,000 + Best Speaker Trophies",
    rules: "1. 3 minutes for opening, 2 minutes rebuttal. 2. Parliamentary decorum is mandatory. 3. Topics announced 1 hour prior.",
    likesCount: 95,
    createdBy: "system-admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "singing-idol-2027",
    festId: "ignite-cultural-fest-2027",
    festTitle: "Ignite: Annual Cultural Fest 2027",
    title: "Aaroh: Solo & Duet Singing Idol",
    subtitle: "Captivate the crowd with Eastern, Classical, Bollywood or Western vocals",
    description: "Step into the limelight! Sing your heart out with live backing accompaniment or karaoke tracks on our main concert stage.",
    bannerImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80"
    ],
    category: "Music",
    competitionDate: "2027-02-19",
    registrationDeadline: "2027-02-16",
    venue: "Central Open-Air Amphitheatre",
    prizePool: "₹35,000 + Studio Recording Contract",
    rules: "1. Max performance time 4 mins. 2. Backing tracks to be submitted 24h prior. 3. Live instruments permitted.",
    likesCount: 156,
    createdBy: "system-admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "photography-sprint-2027",
    festId: "ignite-cultural-fest-2027",
    festTitle: "Ignite: Annual Cultural Fest 2027",
    title: "ShutterSpeed: On-Campus Photo Marathon",
    subtitle: "Capture the raw emotions, lights, and vibrant moments of the fest",
    description: "A 6-hour theme-based photography sprint. Roam the campus, frame unforgettable moments, and submit your top 3 captures for exhibition and judging.",
    bannerImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=80"
    ],
    category: "Photography",
    competitionDate: "2027-02-20",
    registrationDeadline: "2027-02-18",
    venue: "Media Center & Campus Wide",
    prizePool: "₹18,000 + Professional Camera Lens Kit",
    rules: "1. RAW + JPEG submission required. 2. Heavy digital manipulation not allowed. 3. Timestamp verification enforced.",
    likesCount: 112,
    createdBy: "system-admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "short-film-fest-2027",
    festId: "ignite-cultural-fest-2027",
    festTitle: "Ignite: Annual Cultural Fest 2027",
    title: "Spotlight: Student Short Film Festival",
    subtitle: "Screen your cinematic stories on the big screen before industry filmmakers",
    description: "Calling all student directors, screenwriters, and editors! Submit your 5-15 minute narrative, documentary, or animation film for festival screening.",
    bannerImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1000&q=80"
    ],
    category: "Film & Media",
    competitionDate: "2027-02-21",
    registrationDeadline: "2027-02-17",
    venue: "College Cinema Auditorium (Block 2)",
    prizePool: "₹40,000 + Festival Laurels",
    rules: "1. Duration between 5 to 15 minutes. 2. High-resolution MP4/MOV submission. 3. Must have student ID proof for cast/crew.",
    likesCount: 174,
    createdBy: "system-admin",
    createdAt: new Date().toISOString()
  }
];

export const initialAnnouncements = [
  {
    id: "notice-physics-lab-rescheduled",
    title: "📢 Physics & Electronics Practical Examination Rescheduled",
    description: "The Physics and Electronics practical examination previously scheduled for 28 January has been officially moved to 30 January 2027 (10:00 AM) due to the State Education Conference hosted on campus. All batch timings remain identical.",
    date: "2027-01-25",
    important: true,
    category: "Academics",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
    createdBy: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "notice-fest-early-bird-extension",
    title: "🎉 Fest Early-Bird Registration Deadline Extended",
    description: "In response to overwhelming student demand, the organizing committee has extended early-bird registrations for all Republic Day and Cultural competitions until 20 January 2027 with zero late fees. Register now from the Competitions tab!",
    date: "2027-01-18",
    important: true,
    category: "Events",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    createdBy: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "notice-campus-holiday-prep",
    title: "🏛️ Campus Infrastructure Prep & Restricted Parking Notice",
    description: "In preparation for Republic Day Fest setup, the central grounds and North parking arena will be cordoned off starting 19 January. Students are advised to use the South Gate multistory parking facility.",
    date: "2027-01-15",
    important: false,
    category: "Campus Notice",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
    createdBy: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "notice-ignite-volunteer-call",
    title: "🌟 Call for Volunteers: Join the Ignite 2027 Core Crew",
    description: "Want to lead event management, public relations, stage lighting, or hospitality for Ignite 2027? Volunteer applications are open for 2nd and 3rd-year students. Certificate of excellence and fest merchandise will be provided.",
    date: "2027-01-12",
    important: false,
    category: "Volunteering",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
    createdBy: "admin",
    createdAt: new Date().toISOString()
  }
];

export const initialWebinars = [
  {
    id: "webinar-ai-modern-science",
    title: "AI in Modern Science & Engineering",
    subtitle: "From Large Foundation Models to Autonomous Discovery and Real-World Robotics",
    description: "An interactive deep-dive into how cutting-edge Generative AI and Machine Learning are transforming modern science, coding, and industrial automation. Followed by a 30-minute live Q&A.",
    speaker: "Dr. Aarav Mehta",
    speakerDesignation: "Chief AI Researcher at DeepTech Labs | ex-Google Brain",
    speakerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    date: "2027-02-15",
    time: "4:00 PM – 6:00 PM IST",
    venue: "Main Auditorium & Live Zoom Stream",
    meetingLink: "https://meet.google.com/abc-fest-demo",
    bannerImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80"
    ],
    createdBy: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "webinar-cloud-web3-careers",
    title: "Career Roadmap in Modern Cloud Systems & DevOps",
    subtitle: "Building Resilient Distributed Architectures and Landing Top Engineering Roles",
    description: "Learn what modern tech companies look for in college graduates. Covers Kubernetes, microservices architecture, serverless pipelines, and resume-building strategies.",
    speaker: "Priya Sen",
    speakerDesignation: "Director of Cloud Engineering at CloudScale Global",
    speakerPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    date: "2027-02-25",
    time: "5:00 PM – 6:30 PM IST",
    venue: "Virtual Tech Stage (Zoom Webcast)",
    meetingLink: "https://meet.google.com/dev-fest-scale",
    bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
    ],
    createdBy: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "webinar-cybersecurity-era",
    title: "Cybersecurity & Threat Intelligence in 2027",
    subtitle: "Defending Next-Gen Networks Against Zero-Day Exploits and Social Engineering",
    description: "Explore the modern battleground of ethical hacking, defensive security, cryptanalysis, and practical security safeguards for web and cloud applications.",
    speaker: "Vikramaditya Rao",
    speakerDesignation: "Lead Security Architect at CyberFort Security",
    speakerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    date: "2027-03-05",
    time: "3:30 PM – 5:00 PM IST",
    venue: "Seminar Hall B & Google Meet",
    meetingLink: "https://meet.google.com/sec-fest-shield",
    bannerImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
    ],
    createdBy: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: "webinar-startup-founders",
    title: "From Campus Project to High-Growth Startup",
    subtitle: "Fundraising, Product-Market Fit, and Scaling Your Tech Product",
    description: "Hear from a college alumnus who turned a final-year project into a venture-backed tech company with over $5M in seed funding.",
    speaker: "Ananya Iyer",
    speakerDesignation: "Founder & CEO of Apex Seed Ventures",
    speakerPhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    date: "2027-03-12",
    time: "4:00 PM – 5:30 PM IST",
    venue: "Incubation Center Auditorium",
    meetingLink: "https://meet.google.com/startup-fest-apex",
    bannerImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
    ],
    createdBy: "admin",
    createdAt: new Date().toISOString()
  }
];

export async function seedFirestoreDatabase(db, adminUid = "superadmin") {
  const batch = writeBatch(db);

  // Seed Festivals
  for (const fest of initialFests) {
    const ref = doc(db, "fests", fest.id);
    batch.set(ref, { ...fest, createdBy: adminUid }, { merge: true });
  }

  // Seed Competitions
  for (const comp of initialCompetitions) {
    const ref = doc(db, "competitions", comp.id);
    batch.set(ref, { ...comp, createdBy: adminUid }, { merge: true });
  }

  // Seed Announcements
  for (const ann of initialAnnouncements) {
    const ref = doc(db, "announcements", ann.id);
    batch.set(ref, { ...ann, createdBy: adminUid }, { merge: true });
  }

  // Seed Webinars
  for (const web of initialWebinars) {
    const ref = doc(db, "webinars", web.id);
    batch.set(ref, { ...web, createdBy: adminUid }, { merge: true });
  }

  await batch.commit();
  return { success: true, count: initialFests.length + initialCompetitions.length + initialAnnouncements.length + initialWebinars.length };
}
