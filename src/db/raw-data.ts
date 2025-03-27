import { IPostCommon } from "@nawaaz-dev/portfolio-types";

export type ExperienceType = IPostCommon<{
  company: string;
  location: string;
  website: string;
  roles: string[];
}>;

export type TechStackType = IPostCommon<{
  skills: {
    name: string;
    icon: string;
    experience: string;
  }[];
}>;

export type ProjectType = IPostCommon<{
  link: string;
  description: string;
  position: string;
  duration: string;
  techStack: string[];
  responsibilities: string[];
  images: string[];
}>;

export type EducationType = IPostCommon<{
  degree: string;
  institution: string;
  duration: string;
  location: string;
  description: string;
}>;

export const experienceData: ExperienceType[] = [
  {
    tab: "experience",
    order: 1,
    title: "Co-Founder - CTO",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/korvol_gxnppx.png",
    time: { start: "Sep 2024", end: "Feb 2025" },
    details: {
      company: "Yourders",
      location: "Daman",
      website: "https://yourders.com/",
      roles: [
        "💡 Ideated and built Daman’s first online grocery delivery platform from scratch, handling everything from tech to operations.",
        "🧱 Developed custom Shopify apps, a product scraping engine (3K+ items), and a robust backend with Redis, MongoDB & Bull queues.",
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "experience",
    order: 2,
    title: "Software Engineer",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/kapstan_ahjfhs.jpg",
    time: { start: "Jan 2024", end: "Aug 2024" },
    details: {
      company: "Kapstan",
      location: "Remote (India/USA)",
      website: "https://kapstan.io/",
      roles: [
        "🚀 Owned UI feature delivery under fast-paced cycles, improving release quality and sprint turnaround.",
        "🧑‍🔍 Led PR reviews and standardized frontend practices, raising code maintainability across the team.",
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "experience",
    order: 3,
    title: "Software Engineer",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/geoiq_h4b9c4.jpg",
    time: { start: "Jun 2022", end: "Oct 2023" },
    details: {
      company: "GeoIQ",
      location: "Bangalore, India",
      website: "https://geoiq.ai/",
      roles: [
        "📱 Built and optimized multiple React-based projects, including a full-featured PWA with custom caching logic.",
        "🛠️ Created internal tools and a custom UI library, significantly reducing frontend dev time and improving DX.",
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "experience",
    order: 4,
    title: "Software Engineer",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/recro_kap7sm.jpg",
    time: { start: "Apr 2021", end: "May 2022" },
    details: {
      company: "Recrosoft Technologies",
      location: "Remote",
      website: "https://recro.io/",
      roles: [
        "🧩 Served as a full-stack consultant across diverse clients, including Times Internet and Nanovest.",
        "🛒 Worked on high-traffic e-commerce and crypto wallet dashboards, balancing usability and performance.",
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "experience",
    order: 5,
    title: "Full Stack Developer",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/merchimpulse_qme56d.png",
    time: { start: "May 2020", end: "Jan 2021" },
    details: {
      company: "MerchImpulse",
      location: "Remote",
      website: "",
      roles: [
        "🧲 Built a Chrome extension to scrape Amazon data with a visual analytics overlay using React & D3.",
        "🧾 Designed a complete dashboard with secure JWT auth and PostgreSQL backend to manage insights.",
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "experience",
    order: 6,
    title: "Assistant Professor",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/ssr_mhc1mu.png",
    time: { start: "Jun 2018", end: "Jun 2019" },
    details: {
      company: "SSR College",
      location: "Silvassa, India",
      website: "https://ssracs.edu.in/",
      roles: [
        "📚 Taught foundational computer science subjects and improved student pass rates in programming.",
        "📝 Acted as an examiner for university assessments and collaborated on student mentorship programs.",
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
];

export const techStackData: TechStackType[] = [
  {
    tab: "tech_stack",
    order: 1,
    title: "Frontend Technologies",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743057112/ChatGPT_Image_Mar_27_2025_12_01_11_PM_dsbfhl.png",
    time: { start: "2018", end: "Present" },
    details: {
      skills: [
        { name: "TypeScript", icon: "📘", experience: "3 years" },
        { name: "JavaScript", icon: "🟨", experience: "5+ years" },
        { name: "Next.js", icon: "⚡", experience: "2 years" },
        { name: "React.js", icon: "⚛️", experience: "4 years" },
        { name: "Tailwind CSS", icon: "🌬️", experience: "2 years" },
        { name: "Material UI", icon: "🎨", experience: "2 years" },
        { name: "SCSS / CSS", icon: "💅", experience: "5+ years" },
        { name: "Redux", icon: "🔁", experience: "4 years" },
        { name: "Responsive Design", icon: "📱", experience: "5+ years" },
        { name: "RTL Support", icon: "↔️", experience: "1 year" },
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "tech_stack",
    order: 2,
    title: "Backend Technologies",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743057377/ChatGPT_Image_Mar_27_2025_12_05_53_PM_acadi9.png",
    time: { start: "2020", end: "Present" },
    details: {
      skills: [
        { name: "Node.js", icon: "🟩", experience: "4 years" },
        { name: "Express.js", icon: "🚂", experience: "4 years" },
        { name: "GraphQL", icon: "🧬", experience: "4 years" },
        { name: "MongoDB", icon: "🍃", experience: "4 years" },
        { name: "PostgreSQL", icon: "🐘", experience: "4 years" },
        { name: "Redis", icon: "🟥", experience: "3 years" },
        { name: "Bull Task Queue", icon: "📥", experience: "3 years" },
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "tech_stack",
    order: 3,
    title: "Testing & Optimization",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743057601/ChatGPT_Image_Mar_27_2025_12_08_23_PM_wtqt7u.png",
    time: { start: "2021", end: "Present" },
    details: {
      skills: [
        { name: "Unit Testing", icon: "🧪", experience: "3 years" },
        { name: "Integration Testing", icon: "🔗", experience: "3 years" },
        { name: "SEO Optimization", icon: "🔍", experience: "3 years" },
        { name: "CI/CD Pipelines", icon: "🚀", experience: "3 years" },
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "tech_stack",
    order: 4,
    title: "Development & Design Tools",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743057741/ChatGPT_Image_Mar_27_2025_12_11_45_PM-min_jq0kji.png",
    time: { start: "2018", end: "Present" },
    details: {
      skills: [
        { name: "VS Code", icon: "🧠", experience: "5+ years" },
        { name: "Git", icon: "🔧", experience: "5+ years" },
        { name: "Figma", icon: "🎨", experience: "3 years" },
        { name: "CorelDraw", icon: "🖌️", experience: "3 years" },
        { name: "Postman", icon: "📮", experience: "5+ years" },
        { name: "Swagger", icon: "📜", experience: "3 years" },
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "tech_stack",
    order: 5,
    title: "Analytics & Monitoring",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743058321/ChatGPT_Image_Mar_27_2025_12_21_21_PM-min_y1vhnr.png",
    time: { start: "2022", end: "Present" },
    details: {
      skills: [
        { name: "Google Analytics", icon: "📊", experience: "2 years" },
        { name: "Amplitude", icon: "📈", experience: "2 years" },
        { name: "PostHog", icon: "🐗", experience: "2 years" },
        { name: "MS Clarity", icon: "🔎", experience: "2 years" },
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "tech_stack",
    order: 6,
    title: "Best Practices & Principles",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743059126/ChatGPT_Image_Mar_27_2025_12_33_08_PM-min_wbmrcs.png",
    time: { start: "2018", end: "Present" },
    details: {
      skills: [
        { name: "Clean Code", icon: "🧼", experience: "5+ years" },
        { name: "Scalable Architecture", icon: "🏗️", experience: "4 years" },
        { name: "Module Design", icon: "📦", experience: "4 years" },
        { name: "Reusable Components", icon: "♻️", experience: "4 years" },
        { name: "Performance Optimization", icon: "⚡", experience: "4 years" },
        { name: "Agile / Scrum", icon: "🏃", experience: "5+ years" },
        {
          name: "KISS / DRY / YAGNI / SOLID / TDD",
          icon: "📐",
          experience: "5+ years",
        },
      ],
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
];

export const projectData: ProjectType[] = [
  {
    tab: "project",
    order: 0,
    title: "Yourders",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/korvol_gxnppx.png",
    time: {
      start: "Sep 2024",
      end: "Feb 2025",
    },
    details: {
      link: "https://yourders.com",
      position: "Founder & Lead Developer",
      duration: "6 months",
      description:
        "Launched and scaled a modern grocery delivery e-commerce platform from scratch using Shopify, custom apps, and automation workflows.",
      techStack: [
        "Shopify",
        "Remix",
        "Shopify CLI",
        "Redis",
        "BullMQ",
        "MongoDB",
        "GraphQL",
        "Heroku",
        "Puppeteer",
        "TypeScript",
      ],
      responsibilities: [
        "🛒 Built the entire e-commerce store using Shopify.",
        "⚙️ Developed multiple custom Shopify dashboard apps using Remix, GraphQL, and Shopify CLI.",
        "📦 Used BullMQ + Redis + MongoDB to build scalable product data workflows.",
        "🤖 Created headless web scrapers using Puppeteer and TypeScript to collect real-world grocery data.",
        "🔁 Automated product upload, pricing updates, and availability sync using cron-driven workers.",
        "🧠 Led planning, design, development, and release to deliver a full-stack grocery delivery solution.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054554/Screenshot_from_2025-03-26_14-10-33-min_mxwlwf.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054554/Screenshot_from_2025-03-26_14-11-35-min_vrurri.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054554/Screenshot_from_2025-03-26_14-12-03-min_um3jji.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054554/Screenshot_from_2025-03-26_14-12-15-min_yoofan.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 1,
    title: "ShadowFax - An AWS Middleware",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/kapstan_ahjfhs.jpg",
    time: {
      start: "Jan 2024",
      end: "Aug 2024",
    },
    details: {
      link: "https://app.kapstan.io",
      position: "Frontend Engineer",
      duration: "1 year",
      description:
        "A web platform to manage Kubernetes-based containerized applications on AWS—covering lifecycle, cost, and tenant management from a single dashboard.",
      techStack: [
        "React.js",
        "TypeScript",
        "HTML/CSS",
        "Material UI",
        "React Query",
        "Jest",
        "Playwright",
        "Next.js",
      ],
      responsibilities: [
        "⚙️ Built and maintained the core application dashboard with self-updating components.",
        "🔄 Integrated real-time polling to reflect live application status.",
        "📡 Implemented real-time logs and monitoring for deployments.",
        "🧮 Developed a config-diff tool for upcoming vs current deployments.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054391/Screenshot_from_2025-03-27_11-06-53-min_q2lvdw.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054391/Screenshot_from_2025-03-27_11-07-07-min_ad5qvd.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054389/Screenshot_from_2025-03-27_11-07-59-min_ih2flt.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054390/Screenshot_from_2025-03-27_11-07-47-min_qwjt2g.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 2,
    title: "Explorer",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/geoiq_h4b9c4.jpg",
    time: {
      start: "Jun 2022",
      end: "Oct 2023",
    },
    details: {
      link: "https://explorer.geoiq.io",
      position: "Frontend Engineer",
      duration: "1 year 4 months",
      description:
        "Enhanced GeoIQ’s Explorer dashboard by integrating new features, modernizing the UI, and improving developer workflows.",
      techStack: [
        "React.js",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Express.js",
        "CSS3",
        "SCSS",
        "Tailwind CSS",
        "Jest",
        "RESTful APIs",
        "Elastic Beanstalk",
      ],
      responsibilities: [
        "🧩 Integrated new features into the GeoIQ analytics dashboard with an enhanced UI.",
        "📘 Migrated to TypeScript for consistent and error-resistant code.",
        "⚙️ Set up automated CI/CD pipelines for streamlined builds and deployments.",
        "⚛️ Developed responsive frontend using React, Next.js, and TypeScript.",
        "🚀 Handled backend logic using Node.js and Express.js.",
        "🎨 Styled UI with CSS3, SCSS, and Tailwind CSS.",
        "🔗 Integrated RESTful APIs for robust data interaction.",
        "🧪 Wrote and maintained unit tests with Jest.",
        "📦 Deployed the platform via AWS Elastic Beanstalk.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054966/Screenshot_from_2025-03-27_11-25-49_qrohf6.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 3,
    title: "GeoWise PWA",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/geoiq_h4b9c4.jpg",
    time: {
      start: "Aug 2022",
      end: "Oct 2023",
    },
    details: {
      link: "https://geoiq.io",
      position: "Frontend Engineer",
      duration: "1 year 2 months",
      description:
        "Designed and built a progressive web app for GeoIQ to streamline location-based data capture and optimize online-offline functionality.",
      techStack: [
        "React.js",
        "Next.js",
        "TypeScript",
        "Zustand",
        "Redux",
        "Service Workers",
        "AWS S3",
        "Figma",
      ],
      responsibilities: [
        "🎨 Designed and prototyped the UI/UX using Figma.",
        "⚛️ Developed features with React, Next.js, and TypeScript.",
        "🗃️ Managed app state using Zustand and Redux.",
        "🚀 Deployed the app on AWS S3 for scalability.",
        "🧼 Maintained the app by fixing bugs and optimizing performance.",
        "📡 Enabled offline access using Service Workers for caching APIs and assets.",
        "📍 Enhanced location-based data flow for seamless backend integration.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743054883/1702441830064_Screenshot_2023-12-13_100017-min_orpl07.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 4,
    title: "GeoIQ Places",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742993678/geoiq_h4b9c4.jpg",
    time: {
      start: "Dec 2022",
      end: "May 2023",
    },
    details: {
      link: "https://geoiq.io/places/New-Delhi/RmBejLvcYD",
      position: "Frontend Engineer",
      duration: "6 months",
      description:
        "Rebuilt a demographic insights app for the US, improving performance, SEO, and scalability using modern frontend technologies.",
      techStack: [
        "React.js",
        "Next.js",
        "TypeScript",
        "Redux",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "RESTful APIs",
        "Git",
        "AWS Elastic Beanstalk",
      ],
      responsibilities: [
        "🧱 Rebuilt the demographic web app using React and Next.js.",
        "⚡ Boosted performance and SEO, improving page speed and visibility.",
        "📘 Implemented TypeScript for better code quality and structure.",
        "🔄 Used Redux for clean and efficient state management.",
        "🎨 Designed and styled UI using HTML5, CSS3, and Tailwind CSS.",
        "🌐 Integrated RESTful APIs for real-time demographic and healthcare data.",
        "🚀 Deployed and maintained the app via AWS Elastic Beanstalk.",
        "🛠️ Ensured ongoing improvements through regular optimizations.",
        "🔧 Used Git for version control and collaborative development.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055066/Screenshot_from_2025-03-27_11-27-37_vmalse.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 5,
    title: "Shop – MensXP",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743056161/output-onlinepngtools-Picsart-AiImageEnhancer-min_aawc6w.png",
    time: {
      start: "Apr 2021",
      end: "Jan 2022",
    },
    details: {
      link: "https://www.mensxp.com/",
      position: "Frontend Engineer",
      duration: "10 months",
      description:
        "Worked on the now-discontinued MensXP Shop platform, enhancing performance, UI/UX, and SEO strategies for a Myntra-like experience.",
      techStack: [
        "React.js",
        "Redux",
        "JavaScript",
        "Node.js",
        "Express.js",
        "HTML5",
        "CSS3",
        "SCSS",
        "Tailwind CSS",
        "Webpack",
        "PostgreSQL",
        "Git",
      ],
      responsibilities: [
        "🚀 Optimized and maintained the performance of a large-scale e-commerce platform.",
        "🖼️ Improved UI components for a seamless customer experience.",
        "🛠️ Refactored codebase to minimize tight coupling across components.",
        "📋 Translated business requirements into actionable technical plans.",
        "⚛️ Built frontend using React, Redux, and server-side rendering with Node/Express.",
        "🎨 Styled interfaces with SCSS, HTML5/CSS3, and Tailwind CSS.",
        "🧱 Managed PostgreSQL-based backend data handling.",
        "🔧 Configured Webpack for better bundling and performance.",
        "🔄 Used Git for collaborative version control and team sync.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055176/1702355024005_Screenshot_2023-12-12_095333-min_r7bzlv.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 6,
    title: "cure.fit",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743056160/cult-fit-min_lipi92.png",
    time: {
      start: "Jan 2021",
      end: "Mar 2022",
    },
    details: {
      link: "https://www.cult.fit/",
      position: "Frontend Engineer",
      duration: "1 year 3 months",
      description:
        "Built a robust analytical dashboard and onboarding experience for non-tech users to explore and visualize data at cure.fit.",
      techStack: [
        "React.js",
        "Next.js",
        "TypeScript",
        "Redux",
        "RESTful APIs",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "Git",
      ],
      responsibilities: [
        "🧠 Collaborated with management to gather requirements for data dashboards.",
        "📊 Built dynamic dashboards showing graphs and tables from multiple data streams.",
        "🎯 Developed an onboarding flow for non-technical users to analyze and visualize data.",
        "⚛️ Built interactive frontend with React, Next.js, TypeScript, and Redux.",
        "🎨 Styled UI with Tailwind CSS, HTML/CSS, ensuring a clean and responsive design.",
        "🔗 Integrated RESTful APIs to efficiently fetch and display analytics data.",
        "🔧 Used Git for version control and team collaboration.",
      ],
      images: [],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 7,
    title: "Nanovest",
    image:
      "https://media.licdn.com/dms/image/v2/D4E0BAQGuq3UnFY6P5Q/company-logo_200_200/company-logo_200_200/0/1665750776531/kapstan_infra_logo?e=1747872000&v=beta&t=CmPS8OorECoNPHejxUlqEcRMzKz_xAOdj2mu2Ad49Gc",
    time: {
      start: "Mar 2022",
      end: "Apr 2022",
    },
    details: {
      link: "https://www.nanovest.io/en/",
      position: "Frontend Engineer",
      duration: "2 months",
      description:
        "Worked on the admin dashboard and Chrome extension for wallet features, enhancing frontend structure, maintainability, and API integration.",
      techStack: [
        "React.js",
        "TypeScript",
        "Redux",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "RESTful APIs",
      ],
      responsibilities: [
        "🔁 Refactored codebase for reusability and better maintainability.",
        "🧱 Translated Figma designs into responsive UI components for the admin dashboard.",
        "🔐 Led the development of a MetaMask-style Chrome extension for wallet access.",
        "⚛️ Used React, TypeScript, and Redux for dynamic frontend features.",
        "🎨 Styled interfaces using HTML5, CSS3, and Tailwind CSS.",
        "🔗 Integrated RESTful APIs for user authentication and payment management.",
        "🧩 Reduced Redux state inconsistencies while adding new dashboard features.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055259/1702355820834_Screenshot_2023-12-12_100044-min_edkiik.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 8,
    title: "MerchImpulse Chrome Extension",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743056327/merchimpulse_qme56d.png",
    time: {
      start: "Jun 2020",
      end: "Jun 2021",
    },
    details: {
      link: "https://github.com/nawaazwill11/merchimpulse_extension",
      position: "Full-Stack Developer",
      duration: "1 year",
      description:
        "Built a Chrome extension that scrapes data from e-commerce websites, analyzes it, and overlays insights on live pages using graph-based UI.",
      techStack: [
        "React.js",
        "JavaScript",
        "HTML5",
        "CSS3",
        "SCSS",
        "Service Workers",
        "JWT",
        "RESTful APIs",
      ],
      responsibilities: [
        "🔧 Designed, developed, and maintained a Chrome extension for scraping and analysis.",
        "📞 Interacted with the client to gather requirements and iterate on feedback.",
        "⚛️ Built frontend components using React and injected them into DOM dynamically.",
        "🧬 Integrated JWT and REST APIs for secure data fetching and transformation.",
        "📊 Displayed insights via dynamic graph-based UI within target e-commerce pages.",
        "🛠️ Used Service Workers and background scripts to manage network requests efficiently.",
        "🎨 Styled UI with HTML5, CSS3, and SCSS for clean integration into websites.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742994101/mI-1_n4ft3q.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742994101/mi-2_qpq3yt.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1742994102/mi-3_yx8dzr.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 9,
    title: "MerchImpulse Dashboard",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743056327/merchimpulse_qme56d.png",
    time: {
      start: "Aug 2020",
      end: "May 2021",
    },
    details: {
      link: "https://github.com/nawaazwill11/mi_server_3",
      position: "Full-Stack Developer",
      duration: "10 months",
      description:
        "Developed and deployed a powerful admin dashboard for user analytics, subscriptions, and Chrome extension integration.",
      techStack: [
        "React.js",
        "Redux",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "SCSS",
        "Bootstrap",
        "Docker",
        "Webpack",
        "Gumroad API",
      ],
      responsibilities: [
        "🧩 Led the architecture, design, and full development of a user and admin dashboard.",
        "📊 Built Node.js/Express API server with MongoDB integration for user management.",
        "⚛️ Developed views using React with server-side rendering (SSR) and Redux.",
        "🔗 Integrated Gumroad API to manage subscription workflows.",
        "🔐 Handled secure authentication including JWT for Chrome Extension linkage.",
        "🎨 Styled components with SCSS and Bootstrap.",
        "🐳 Used Docker and Webpack for deployment and build optimization.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055607/1702353539076_Screenshot_202023-12-12_20091241_zc8udq.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055613/1702353539086_Screenshot_202023-12-12_20091309_bww21o.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055439/1702354181933_Screenshot_202023-12-12_20091409_chgdge.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055491/1702354181933_Screenshot_202023-12-12_20092056_xyudlw.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055487/1702354181934_Screenshot_202023-12-12_20092117_dllfk0.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
  {
    tab: "project",
    order: 10,
    title: "Shreevaradha Enterprise Website",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743056561/Untitled_Project-min_xa7yhu.png",
    time: {
      start: "Feb 2019",
      end: "Aug 2019",
    },
    details: {
      link: "https://github.com/nawaazwill11/shreevarada",
      position: "Full-Stack Developer",
      duration: "7 months",
      description:
        "Designed and deployed the official website for a local enterprise using a hybrid stack of JavaScript and Python technologies.",
      techStack: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Python",
        "Flask",
        "Jinja2",
        "Node.js",
        "PostgreSQL",
        "Service Workers",
        "Webpack",
        "Heroku",
      ],
      responsibilities: [
        "📞 Interacted with clients to gather requirements and establish project goals.",
        "🌐 Developed frontend using HTML, CSS3, and vanilla JavaScript.",
        "🐍 Built backend logic using Flask and templating with Jinja2.",
        "🧼 Used Python and Node.js for backend scripting and data cleaning.",
        "🐘 Integrated PostgreSQL for database management.",
        "📦 Configured Webpack for efficient bundling.",
        "⚡ Added offline capabilities using Service Workers.",
        "🚀 Deployed the full-stack site on Heroku, improving business visibility online.",
      ],
      images: [
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055704/1702279542239_Shreevaradha-1_pzs8rg.png",
        "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743055687/1702279542241_Shreevaradha-3_pyoirv.png",
      ],
    },
    actions: {
      likes: 0,
      comments: [],
      shares: 0,
    },
  },
];

export const educationData: EducationType[] = [
  {
    tab: "education",
    order: 1,
    title: "Master of Computer Application",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743059350/Savitribai_Phule_Pune_University_Logo-min_coof0k.png",
    time: { start: "2015", end: "2018" },
    details: {
      degree: "MCA",
      institution: "Savitribai Phule University Pune",
      duration: "3 years",
      location: "Pune, India",
      description:
        "Focused on advanced computer science concepts including software development, system design, and project management.",
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
  {
    tab: "education",
    order: 2,
    title: "Bachelor of Computer Application",
    image:
      "https://res.cloudinary.com/dbjar1kvg/image/upload/v1743059350/Savitribai_Phule_Pune_University_Logo-min_coof0k.png",
    time: { start: "2012", end: "2015" },
    details: {
      degree: "BCA",
      institution: "Savitribai Phule University Silvassa",
      duration: "3 years",
      location: "Silvassa, India",
      description:
        "Learned the foundations of programming, databases, and computer networks with hands-on labs and theory.",
    },
    actions: { likes: 0, comments: [], shares: 0 },
  },
];
