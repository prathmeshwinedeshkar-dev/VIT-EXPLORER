/* data.js — all content lives here. Edit freely; no other file needs to change.
   To add more data WITHOUT editing this file: use data-extra.js or the in-page "Import data" button. */
(function () {
  const OFFICIAL = "https://www.vit.edu";
  // Club helper: c(id, name, categories, description, activities, bestFor, instagram, website)
  const c = (id, name, category, description, activities, bestFor, instagram = "", website = "") =>
    ({ id, name, category, description, activities, bestFor, instagram, website, tags: [] });

  const D = {
    config: {
      // Change PRN rule if your PRN format differs (regex string)
      prnPattern: "^[0-9A-Za-z]{8,12}$",
      author: "Prathmesh",
      github: "https://github.com/prathmeshwinedeshkar-dev/vit-pune-campus-explorer",
      linkedin: "https://www.linkedin.com/in/prathmesh-winedeshkar",
      siteUrl: "https://prathmeshwinedeshkar-dev.github.io/vit-pune-campus-explorer/",
      officialSite: OFFICIAL,
      // Central feature switches. Set false to disable cleanly (nav, sections and copy are removed).
      // import is OFF by default: it only changes the visitor's own browser, so it does not help other students.
      features: { quiz: true, pwa: true, import: false }
    },

    // Instagram/website left blank where not verified — fill in only what you have confirmed.
    clubs: [
      c("gdg-vit", "Google Developer Groups on Campus VIT", ["Technical", "Coding", "AI/ML"], "Student community around Google technologies: app dev, cloud and AI, learned through peer-led sessions.", ["Workshops", "Study jams", "Hackathons"], "Students curious about Android, web, cloud and community building"),
      c("csi-vit", "Computer Society of India VIT", ["Technical", "Coding"], "Student chapter of the CSI professional body, running tech talks and competitions.", ["Tech talks", "Contests", "Workshops"], "Students who want an industry-linked computing community"),
      c("acm-vit", "ACM VIT", ["Technical", "Coding"], "Chapter focused on computing, problem solving and technical learning.", ["Coding contests", "Seminars", "Projects"], "Competitive programming and CS-fundamentals fans"),
      c("ieee-cs", "IEEE Computer Society VIT Pune", ["Technical", "Coding", "AI/ML"], "Computing-focused IEEE chapter for talks, skill-building and networking.", ["Expert sessions", "Workshops", "Competitions"], "Students aiming for research-flavoured computing exposure"),
      c("ieee-sb", "IEEE Student Branch", ["Technical", "IoT"], "Campus branch of the global IEEE student network spanning engineering fields.", ["Technical events", "Paper contests", "Outreach"], "Students interested in engineering research and professional networking"),
      c("mlsc", "Microsoft Learn Students Club", ["Technical", "Coding", "AI/ML"], "Peer learning around Microsoft tools, cloud and AI.", ["Learning sessions", "Cloud labs", "Hack events"], "Beginners exploring Azure, AI and dev tools"),
      c("gfg", "GeeksforGeeks Student Chapter", ["Technical", "Coding"], "Chapter for DSA practice, interview prep and coding culture.", ["DSA sessions", "Contests", "Mock interviews"], "Placement-minded coders starting early"),
      c("cyber-cell", "Cyber Cell VIT", ["Technical", "Cybersecurity"], "Security-minded group exploring ethical hacking and safe computing.", ["CTFs", "Security workshops", "Awareness drives"], "Students curious about cybersecurity and CTFs"),
      c("vicsta", "VICSTA", ["Technical", "Coding"], "Department student association for Computer Science students.", ["Department events", "Tech sessions", "Contests"], "CS students wanting department-level involvement"),
      c("aisa", "AISA", ["Technical", "AI/ML"], "Student association for Artificial Intelligence and related fields.", ["AI workshops", "Projects", "Talks"], "Future ML/AI builders"),
      c("dssa", "DSSA", ["Technical", "AI/ML"], "Student association for Data Science.", ["Data workshops", "Competitions", "Talks"], "Students who like data, stats and visualisation"),
      c("sesa", "SESA", ["Technical", "Coding"], "Student association linked to Software Engineering topics.", ["Seminars", "Dev sessions", "Contests"], "Aspiring software engineers"),
      c("itsa", "ITSA", ["Technical", "Coding"], "Student association for the Information Technology department.", ["Department events", "Workshops", "Contests"], "IT students seeking a department community"),
      c("compsa", "COMPSA", ["Technical", "Coding"], "Student association for the Computer Engineering department.", ["Department events", "Workshops", "Hack nights"], "Computer Engineering students"),
      c("cesa", "CESA", ["Technical"], "Student association for the Civil Engineering department.", ["Site talks", "Contests", "Workshops"], "Civil Engineering students"),
      c("mesa", "MESA", ["Technical", "Robotics"], "Student association for the Mechanical Engineering department.", ["Design contests", "Workshops", "Industry talks"], "Mechanical students who like hands-on work"),
      c("iot-club", "IoT Club", ["Technical", "IoT", "Robotics"], "Hardware-meets-software club for connected devices and sensors.", ["Sensor builds", "Workshops", "Mini-projects"], "Tinkerers who enjoy Arduino/ESP-style builds"),
      c("robotics-forum", "Robotics Forum", ["Technical", "Robotics"], "Forum for robotics learning, building and competitions.", ["Build sessions", "Competitions", "Workshops"], "Students who want to build robots"),
      c("os-club", "Open Source Contribution Club", ["Technical", "Coding"], "Helps students make their first open-source contributions.", ["Git workshops", "Issue sprints", "Mentoring"], "Beginners wanting a real GitHub portfolio"),
      c("byteforge", "ByteForge Club", ["Technical", "Coding"], "Coding-focused club for building and sharpening dev skills.", ["Coding sessions", "Projects", "Contests"], "Students who learn by building"),
      c("cloudforge", "Cloud Forge", ["Technical", "Coding"], "Cloud computing learning community.", ["Cloud labs", "Certification prep", "Talks"], "Students interested in cloud careers"),
      c("vcloudops", "VCloudOps", ["Technical", "Coding"], "Community around cloud and DevOps practices.", ["DevOps workshops", "Hands-on labs", "Talks"], "Students curious about CI/CD and deployment"),
      c("hackathons-vit", "Hackathons@VIT", ["Technical", "Coding", "Entrepreneurship"], "Group that organises and promotes hackathons on campus.", ["Hackathons", "Team-building", "Mentor sessions"], "Anyone wanting a first hackathon"),
      c("ideators", "The Ideators Club", ["Entrepreneurship"], "Idea-to-startup community for brainstorming and pitching.", ["Pitch nights", "Ideation workshops", "Mentor talks"], "Future founders"),
      c("tech2product", "Tech to Product Innovation Club", ["Entrepreneurship", "Technical"], "Turns technical ideas into usable products.", ["Product sprints", "Prototyping", "Demo days"], "Builders who care about users"),
      c("endurance", "Team Endurance Racing", ["Technical", "Robotics"], "Student vehicle-engineering team building racing machines.", ["Design", "Fabrication", "Competitions"], "Mechanical/automotive enthusiasts"),
      c("griffin", "Team Griffin", ["Technical"], "Student engineering project team.", ["Design", "Build", "Competitions"], "Hands-on engineering students"),
      c("veloce", "Team Veloce Racing", ["Technical"], "Student racing project team.", ["Design", "Build", "Race events"], "Vehicle-design enthusiasts"),
      c("vishwa-racers", "Team Vishwa Racers", ["Technical"], "Student racing project team.", ["Design", "Build", "Race events"], "Vehicle-design enthusiasts"),
      c("auv", "AUV VIT Pune", ["Technical", "Robotics"], "Team working on autonomous underwater vehicles.", ["Robotics builds", "Testing", "Competitions"], "Robotics, electronics and mechanical mix"),
      c("antariksh", "Antariksh Club", ["Astronomy"], "Astronomy club for stargazing and space science.", ["Star parties", "Talks", "Observations"], "Space and physics lovers"),
      c("pi-editorial", "Pi Editorial Board", ["Media and Film", "Cultural"], "Student editorial team for campus writing and publications.", ["Writing", "Editing", "Publishing"], "Writers and storytellers"),
      c("rangmanch", "RangManch", ["Cultural", "Media and Film"], "Performing arts group for drama and stage work.", ["Theatre", "Skits", "Fest performances"], "Actors, writers and stage crew"),
      c("eklavya", "Team Eklavya", ["Sports"], "Sports-focused student team.", ["Training", "Tournaments", "Fitness events"], "Athletes and fitness fans"),
      c("light-lounge", "Light-Hearted Lounge", ["Cultural", "Social Welfare"], "Relaxed community space for fun and wellbeing.", ["Casual meetups", "Games", "Social events"], "Students who want a stress-free social circle"),
      c("chess", "Chess Champions Club", ["Sports"], "Club for chess lovers of all levels.", ["Casual games", "Tournaments", "Coaching"], "Beginners and tournament players"),
      c("investment-forum", "The Investment Forum", ["Finance", "Entrepreneurship"], "Learn about markets and personal finance.", ["Market talks", "Mock trading", "Quizzes"], "Finance-curious students"),
      c("speakers", "Speaker's Club", ["Public Speaking"], "Practice public speaking, debate and communication.", ["Debates", "Group discussions", "Speech practice"], "Anyone nervous about presenting"),
      c("abhivriddhi", "Abhivriddhi", ["Social Welfare"], "Student initiative for community development.", ["Drives", "Outreach", "Volunteering"], "Students who want social impact"),
      c("epec", "EPEC", ["Entrepreneurship"], "Entrepreneurship-focused cell.", ["Startup talks", "Competitions", "Mentoring"], "Aspiring entrepreneurs"),
      c("swdc", "Social Welfare and Development Committee", ["Social Welfare"], "Committee coordinating welfare and development activities.", ["Volunteer drives", "Awareness events"], "Volunteers")
    ],

    // Fests & events (single list). Dates are "typical" — verify on the official notice board.
    events: [
      { id: "vishwakarandak", name: "Vishwakarandak", type: "Cultural", category: ["Events", "Cultural"], org: "Student Council / Cultural Committees", time: "Verify on notice board", month: "TBD", firstYear: "Volunteer, perform or attend", why: "Flagship campus fest atmosphere — meet seniors and clubs.", tags: ["Fest", "Flagship"], skill: "Teamwork", beginner: true, reg: true, cost: "Free", mode: "Offline" },
      { id: "melange", name: "Mélange", type: "Cultural", category: ["Events", "Cultural"], org: "Cultural Committee", time: "Verify on notice board", month: "TBD", firstYear: "Join performances or help in organising", why: "Showcase of campus talent.", tags: ["Fest", "Performance"], skill: "Creativity", beginner: true, reg: true, cost: "Free", mode: "Offline" },
      { id: "freshers", name: "Freshers' Party", type: "Social", category: ["Events", "Social Welfare"], org: "Student Council", time: "Start of academic year", month: "Aug–Oct", firstYear: "Attend and meet your batch", why: "Easiest way to make friends early.", tags: ["Social", "First-year"], skill: "Networking", beginner: true, reg: false, cost: "Free", mode: "Offline" },
      { id: "independence", name: "Independence Day Celebrations", type: "Social", category: ["Events", "Social Welfare"], org: "College administration", time: "15 August", month: "Aug", firstYear: "Attend the flag ceremony", why: "A campus tradition.", tags: ["Tradition"], skill: "Community", beginner: true, reg: false, cost: "Free", mode: "Offline" },
      { id: "hackathons", name: "Technical Hackathons", type: "Technical", category: ["Events", "Technical", "Coding"], org: "Hackathons@VIT, GDG, tech clubs", time: "Through the year", month: "Varies", firstYear: "Join a team of 3–4 and ship a demo", why: "Fastest way to build a portfolio.", tags: ["Hackathon", "Beginner Friendly"], skill: "Coding", beginner: true, reg: true, cost: "Free", mode: "Hybrid" },
      { id: "club-annual", name: "Club Annual Events", type: "Technical", category: ["Events", "Technical"], org: "Individual clubs", time: "Varies by club", month: "Varies", firstYear: "Volunteer first, then organise", why: "Best way to learn event management.", tags: ["Clubs", "Volunteer"], skill: "Leadership", beginner: true, reg: true, cost: "Free", mode: "Offline" },
      { id: "mun", name: "MUN", type: "Cultural", category: ["Events", "Public Speaking"], org: "Speaking / debate groups", time: "Verify on notice board", month: "TBD", firstYear: "Attend as a delegate", why: "Builds diplomacy and speaking skills.", tags: ["Debate", "Speaking"], skill: "Public Speaking", beginner: false, reg: true, cost: "Paid", mode: "Offline" },
      { id: "star-party", name: "Star Party", type: "Technical", category: ["Events", "Astronomy"], org: "Antariksh Club", time: "Announced by the club", month: "Varies", firstYear: "Observe the night sky", why: "Telescopes and a calm change from labs.", tags: ["Astronomy", "Outdoor"], skill: "Curiosity", beginner: true, reg: false, cost: "Free", mode: "Offline" },
      { id: "coding-comp", name: "Coding Competitions", type: "Technical", category: ["Events", "Coding"], org: "ACM, GfG, CSI chapters", time: "Through the year", month: "Varies", firstYear: "Solve problems solo or in pairs", why: "Sharpens DSA for placements.", tags: ["Contest", "DSA"], skill: "Problem Solving", beginner: false, reg: true, cost: "Free", mode: "Online" },
      { id: "cultural-comp", name: "Cultural Competitions", type: "Cultural", category: ["Events", "Cultural"], org: "Cultural committees", time: "Through the year", month: "Varies", firstYear: "Sing, dance, act or host", why: "Great for confidence.", tags: ["Performance"], skill: "Creativity", beginner: true, reg: true, cost: "Free", mode: "Offline" },
      { id: "sports-events", name: "Sports Events", type: "Sports", category: ["Events", "Sports"], org: "Team Eklavya, sports dept.", time: "Through the year", month: "Varies", firstYear: "Try out for teams", why: "Fitness and teamwork.", tags: ["Sports", "Teamwork"], skill: "Teamwork", beginner: true, reg: true, cost: "Free", mode: "Offline" }
    ],

    // All links point to the official site root. Replace with exact page URLs once verified.
    resources: [
      ["official", "Official VIT Pune website", "Main portal for academics, notices and contacts.", "Official"],
      ["student-res", "Student Resources page", "Start from the official site's student section.", "Official"],
      ["notices", "Notice board", "Check here for circulars and recruitment dates.", "Official"],
      ["calendar", "Academic calendar", "Exam and term dates — plan around them.", "Academics"],
      ["support", "Admission / support contacts", "Who to contact for admissions help.", "Support"],
      ["scholar", "Scholarship and MahaDBT notices", "Official notices on scholarships.", "Support"],
      ["transcript", "Transcript application info", "How to request transcripts.", "Support"],
      ["student-sec", "Student section contacts", "Offices for ID cards, bonafide and queries.", "Support"],
      ["locations", "Campus location details", "Bibwewadi and Kondhwa campus details.", "Official"],
      ["library", "Library / study guidance", "Use the library and plan study blocks.", "Academics"],
      ["club-guide", "Club recruitment guidance", "Pick 1–2 clubs, watch notices, apply early.", "Guide"],
      ["resume", "Resume & LinkedIn tips", "One page, projects first, links that work.", "Guide"],
      ["hack-check", "Hackathon preparation checklist", "Team, idea, stack, Git, demo, pitch.", "Guide"],
      ["survival", "First-year survival checklist", "ID card, timetable, mentors, clubs, sleep.", "Guide"]
    ].map(([id, name, description, kind]) => ({ id, name, description, category: ["Resources", kind], link: OFFICIAL })),

    places: [
      { id: "bibwewadi", name: "Bibwewadi Campus", filter: "Academics", description: "One of the two VIT Pune campuses." },
      { id: "kondhwa", name: "Kondhwa Campus", filter: "Academics", description: "The second campus; check your timetable." },
      { id: "student-support", name: "Student-support offices", filter: "Support", description: "Student section, library and admin help." },
      { id: "club-spaces", name: "Club activity spaces", filter: "Clubs", description: "Rooms and labs clubs use — ask each club." },
      { id: "event-venues", name: "Event venues", filter: "Events", description: "Auditoriums and grounds used for fests." },
      { id: "sports-ground", name: "Sports facilities", filter: "Sports", description: "Courts and grounds — confirm timings." },
      { id: "food", name: "Nearby food & hangouts", filter: "Food", description: "Community suggestions only — not official recommendations." }
    ],

    faqs: [
      { q: "How do I join clubs at VIT Pune?", a: "Watch the official notice board and club social pages, then apply during recruitment." },
      { q: "When do club recruitments usually happen?", a: "Usually early in the academic year, but dates change — verify on notices." },
      { q: "Which clubs are best for first-year students?", a: "Use the 'Beginner Friendly' filter and pick ones matching your interests." },
      { q: "How do I balance academics and clubs?", a: "Limit yourself to 1–2 clubs, plan around exams, and start as a volunteer." },
      { q: "How do I prepare for hackathons?", a: "Open the Hackathon preparation checklist in Resources." },
      { q: "Where can I find official notices?", a: "On vit.edu — open the Notice board resource." },
      { q: "How do I use this Campus Explorer?", a: "Search or filter, tap + Plan to save items, and register through the form." }
    ],

    testimonials: [
      { name: "Sample student A", branch: "Computer Engineering", quote: "I found my first hackathon through this explorer." },
      { name: "Sample student B", branch: "IT", quote: "I finally understood which clubs match my interests." },
      { name: "Sample student C", branch: "ENTC", quote: "The event filters saved me from missing recruitment deadlines." },
      { name: "Sample student D", branch: "Mechanical", quote: "Seeing both campuses and offices in one place helped in week one." }
    ]
  };

  const GUIDES = {
    "club-guide": ["Pick 1–2 clubs in semester 1, not ten.", "Watch the notice board and club Instagram pages for recruitment posts.", "Apply before the deadline; date-only posts often hide the closing time.", "Volunteer first, then take on bigger roles."],
    resume: ["One page; projects before coursework.", "Every project: what you built, the stack, one result.", "GitHub and LinkedIn links must open and be public.", "Ask a senior to review it before you apply anywhere."],
    "hack-check": ["Form a team of 3–4 with mixed skills.", "Pick one small problem; cut features, not sleep.", "Set up Git and a repo on day 1.", "Prepare a 2-minute demo and a one-slide pitch."],
    survival: ["Keep your ID card and timetable on your phone.", "Know your mentor and the student-section office.", "Check the notice board weekly.", "Sleep, eat, and revise a little every day."],
    library: ["Plan fixed study blocks around lectures.", "Ask the library staff about borrowing rules.", "Use past papers before exams."]
  };
  D.resources.forEach((r) => { if (GUIDES[r.id]) { r.guide = GUIDES[r.id]; r.guideNote = "General student tips, not an official VIT Pune policy."; } if (r.category.includes("Guide")) r.link = ""; });

  // Merge helper: CampusData.add("clubs", [ {...} ]) — skips duplicate ids, so extra files are safe.
  D.add = function (key, items) {
    if (!Array.isArray(D[key]) || !Array.isArray(items)) return;
    items.forEach(it => { if (it && it.id && !D[key].some(x => x.id === it.id)) D[key].push(it); });
  };
  window.CampusData = D;
})();
