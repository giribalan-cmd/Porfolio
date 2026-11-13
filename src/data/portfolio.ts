import marineAiPreview from '../assets/images/1.png';
import parkspotPreview from '../assets/images/2.png';

export interface SkillCategory {
  id: string;
  group: 'languages' | 'fullstack' | 'infrastructure' | 'engineering';
  title: string;
  subtitle: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  technologies: string[];
  image: string;
  imageAlt: string;
  architectureNotes: string[];
  githubUrl: string | null;
  liveDemoUrl: string | null;
  statusNote: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  duration: string;
  responsibilities: string[];
}

export const PERSONAL_INFO = {
  brand: 'GIRIBALAN.R',
  name: 'Giribalan R.',
  title: 'Software Engineer | Full Stack Developer',
  location: 'Coimbatore, Tamil Nadu, India',
  email: 'giriworkdomain@gmail.com',
  phone: '+91 6380286686',
  phoneHref: 'tel:+916380286686',
  github: 'https://github.com/giri-codex',
  linkedin: 'https://www.linkedin.com/in/giribalan-g/',
  existingPortfolio: 'https://meek-piroshki-481ad5.netlify.app',
  availabilityLabel: 'OPEN TO SOFTWARE DEVELOPMENT OPPORTUNITIES',
  heroKicker: "HELLO, I'M GIRIBALAN",
  heroHeadline: 'Building Digital Experiences Through Code.',
  heroDescription:
    "I'm a Software Engineer focused on building scalable web applications, intuitive user interfaces, and reliable backend systems using modern technologies.",
  specialization: [
    'Full Stack Development',
    'Python',
    'React',
    'Software Engineering',
  ],
};

export const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const ABOUT_CONTENT = {
  heading: 'Beyond The Code.',
  paragraphs: [
    "I'm Giribalan, an Information Technology graduate and aspiring Software Engineer passionate about building practical, scalable software solutions.",
    'My development experience spans Python, Django, React.js, Node.js, and modern web technologies. I enjoy working across the full development lifecycle, from designing responsive interfaces to developing backend APIs and integrating databases.',
    "Through internships and personal projects, I've gained practical experience with authentication, RESTful APIs, application architecture, debugging, and collaborative development.",
    "I'm continuously improving my engineering skills and exploring better ways to build efficient, maintainable, and user-focused applications.",
  ],
  profilePanel: [
    { label: 'Degree', value: 'B.Tech Information Technology' },
    { label: 'Institution', value: 'KGISL Institute of Technology' },
    { label: 'Class', value: '2022–2026' },
    { label: 'Location', value: 'Coimbatore, India' },
  ],
  interests: [
    'Software Engineering',
    'Full Stack Development',
    'Python Development',
    'Django Backend Development',
    'MERN Stack Development',
    'React.js Development',
    'REST API Development',
    'Application Architecture',
    'AI-assisted Software Engineering',
  ],
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming-languages',
    group: 'languages',
    title: 'Programming Languages',
    subtitle: 'Core general-purpose, scripting, and query languages',
    items: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    id: 'frontend',
    group: 'fullstack',
    title: 'Frontend',
    subtitle: 'Component architecture, styling systems, and build tooling',
    items: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'],
  },
  {
    id: 'backend',
    group: 'fullstack',
    title: 'Backend',
    subtitle: 'Server frameworks, API design, and token-based security',
    items: ['Django', 'Node.js', 'Express.js', 'RESTful APIs', 'JWT Authentication'],
  },
  {
    id: 'databases',
    group: 'fullstack',
    title: 'Databases',
    subtitle: 'Document modeling, ODM schemas, and relational querying',
    items: ['MongoDB', 'Mongoose', 'SQL'],
  },
  {
    id: 'devops-tools',
    group: 'infrastructure',
    title: 'DevOps & Tools',
    subtitle: 'Containerization, CI/CD, version control, and API testing',
    items: [
      'Docker',
      'Jenkins',
      'Maven',
      'Git',
      'GitHub',
      'GitHub Actions',
      'Linux',
      'Nginx',
      'Postman',
    ],
  },
  {
    id: 'software-engineering',
    group: 'engineering',
    title: 'Software Engineering',
    subtitle: 'Architecture principles, methodology, and lifecycle rigor',
    items: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'System Design',
      'Distributed Systems',
      'Microservices',
      'Client-Server Architecture',
      'Agile',
      'Scrum',
      'Debugging',
      'API Testing',
      'Software Development Lifecycle',
    ],
  },
  {
    id: 'ai-assisted-dev',
    group: 'engineering',
    title: 'AI-Assisted Development',
    subtitle: 'Modern AI coding workflows and accelerated engineering',
    items: ['ChatGPT', 'Claude', 'Cursor', 'GitHub Copilot'],
  },
];

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'marine-ai',
    index: '01',
    title: 'Marine AI',
    subtitle: 'Predictive Environmental Monitor',
    description:
      'A marine environmental monitoring platform designed to visualize marine conditions and explore machine-learning-based environmental predictions.',
    features: [
      'Developed a React.js dashboard to fetch and visualize marine data, including fish count, temperature, and salinity, using open APIs.',
      'Designed dynamic, data-driven UI components to display machine-learning-predicted environmental trends.',
      'Optimized frontend data-fetching logic to achieve sub-2-second refresh cycles for live data updates.',
    ],
    technologies: [
      'React.js',
      'JavaScript',
      'APIs',
      'Data Visualization',
      'Machine Learning Integration',
    ],
    image: marineAiPreview,
    imageAlt:
      'Marine AI interface showing dark bathymetric ocean contours and sonar trend waveforms',
    architectureNotes: [
      'Modular React.js visualization widgets decoupled from polling data-fetch hooks.',
      'Open API ingestion normalized into structured environmental telemetry streams.',
      'Predictive trend overlays pairing historical ocean readings with ML projections.',
    ],
    githubUrl: null,
    liveDemoUrl: null,
    statusNote: 'Project showcase — source repository and live deployment available on request.',
  },
  {
    id: 'parkspot',
    index: '02',
    title: 'ParkSpot',
    subtitle: 'Parking Space Rental and Booking Platform',
    description:
      'A full-stack parking reservation platform connecting drivers with property owners.',
    features: [
      'Developed a full-stack parking reservation platform.',
      'Implemented GPS-based nearby parking discovery using Leaflet and OpenStreetMap.',
      'Developed authentication and role-based access control for drivers, property owners, and administrators.',
      'Built a responsive interface using React, TypeScript, and Tailwind CSS with a layered client-server architecture.',
    ],
    technologies: [
      'React.js',
      'TypeScript',
      'Tailwind CSS',
      'Leaflet',
      'OpenStreetMap',
      'Backend APIs',
      'Authentication',
    ],
    image: parkspotPreview,
    imageAlt:
      'ParkSpot interface displaying a dark-mode urban geospatial map with parking bay markers and route paths',
    architectureNotes: [
      'Layered client-server separation isolating geospatial UI from reservation APIs.',
      'Role-based access control enforcing distinct permissions for drivers, property owners, and admins.',
      'Interactive Leaflet & OpenStreetMap integration for GPS-assisted nearby spot discovery.',
    ],
    githubUrl: null,
    liveDemoUrl: null,
    statusNote: 'Project showcase — source repository and live deployment available on request.',
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'qaroo-india',
    role: 'Python Full Stack Developer Intern',
    organization: 'Qaroo India Private Limited',
    duration: 'June 2026 – October 2026',
    responsibilities: [
      'Developed and maintained full-stack application features using Python, React.js, and RESTful APIs in an Agile team.',
      'Implemented authentication and CRUD functionality and integrated backend services with responsive React components.',
      'Tested APIs using Postman, debugged application issues, and collaborated through Git/GitHub code reviews.',
    ],
  },
  {
    id: 'vault-of-code',
    role: 'Web Development Intern',
    organization: 'Vault of Code',
    duration: 'May 2025 – June 2025',
    responsibilities: [
      'Developed 2+ production-ready MERN stack applications end to end.',
      'Built RESTful API endpoints and optimized MongoDB queries to reduce response time by 30%.',
      'Tested APIs end to end using Postman and collaborated through Git/GitHub in an Agile team.',
    ],
  },
];

export const EDUCATION_ITEM = {
  degree: 'Bachelor of Technology – Information Technology',
  institution: 'KGISL Institute of Technology',
  duration: '2022 – 2026',
  location: 'Coimbatore, India',
};
