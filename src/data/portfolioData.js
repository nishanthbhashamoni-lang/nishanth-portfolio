export const portfolioData = {
  personal: {
    name: "Nishanth Bhashamoni",
    brandName: "Nishanth.",
    role: "BSc Computer Science Student | Data & AI Enthusiast",
    statusBadge: "Open to Internship Opportunities",
    tagline: "I build data-driven applications, AI-powered solutions, and practical software projects while continuously exploring new technologies.",
    location: "India",
    // Update your contact and profile links here:
    email: "nishanth.bhashamoni@example.com", // Replace with your real email address
    github: "https://github.com",            // Replace with your GitHub profile URL
    linkedin: "https://linkedin.com",        // Replace with your LinkedIn profile URL
    resumeUrl: "/resume.pdf",                // Place your resume as 'resume.pdf' in the public/ folder
  },

  about: {
    intro: [
      "I am a 1st-year BSc Computer Science student with a passionate drive for Data Analytics, Data Science, Artificial Intelligence, Machine Learning, and modern software development.",
      "My approach centers on crafting practical, data-driven applications and AI solutions to solve real-world problems. I enjoy dissecting complex datasets, engineering predictive algorithms, and designing clean, intuitive interfaces.",
      "Constantly exploring emerging AI paradigms, RAG pipelines, and full-stack architectures, I am actively seeking internship opportunities, collaborative projects, and industry exposure to contribute and grow."
    ],
    exploring: [
      { name: "Machine Learning", desc: "Supervised & unsupervised models, scikit-learn, predictive analytics" },
      { name: "Data Engineering", desc: "ETL pipelines, data warehousing concepts, SQL optimizations" },
      { name: "Generative AI", desc: "Foundation models, multimodality, contextual embeddings" },
      { name: "LLM Applications", desc: "LangChain, RAG architecture, agentic workflows, API integrations" },
      { name: "Backend Development", desc: "RESTful APIs, Flask, authentication, database schemas" }
    ]
  },

  skills: {
    categories: [
      {
        title: "Programming",
        icon: "Code2",
        skills: [
          { name: "Python", icon: "Code", highlight: "Primary Language" },
          { name: "C++", icon: "Cpu", highlight: "Core & Algorithms" },
          { name: "SQL", icon: "Database", highlight: "Queries & Modeling" }
        ]
      },
      {
        title: "Data & Analytics",
        icon: "BarChart3",
        skills: [
          { name: "Pandas", icon: "Table2", highlight: "Data Manipulation" },
          { name: "NumPy", icon: "Binary", highlight: "Numerical Computing" },
          { name: "Matplotlib", icon: "LineChart", highlight: "Visualization" },
          { name: "Seaborn", icon: "PieChart", highlight: "Statistical Plots" },
          { name: "Tableau", icon: "LayoutDashboard", highlight: "Interactive BI" }
        ]
      },
      {
        title: "AI / ML",
        icon: "Sparkles",
        skills: [
          { name: "Machine Learning", icon: "BrainCircuit", highlight: "Predictive Models" },
          { name: "LLMs", icon: "Bot", highlight: "Language Models" },
          { name: "RAG", icon: "FileSearch", highlight: "Retrieval Augmented" },
          { name: "LangChain", icon: "Link2", highlight: "Agent Frameworks" },
          { name: "Prompt Engineering", icon: "Terminal", highlight: "Structured Reasoning" }
        ]
      },
      {
        title: "Web Development",
        icon: "Globe",
        skills: [
          { name: "HTML", icon: "FileCode", highlight: "Semantic Structure" },
          { name: "CSS", icon: "Palette", highlight: "Modern Layouts" },
          { name: "JavaScript", icon: "FileJson", highlight: "Dynamic UI" },
          { name: "Flask", icon: "Server", highlight: "Python Backend" },
          { name: "Tailwind CSS", icon: "Wand2", highlight: "Utility Styling" }
        ]
      },
      {
        title: "Tools & Workflow",
        icon: "Wrench",
        skills: [
          { name: "Git", icon: "GitBranch", highlight: "Version Control" },
          { name: "GitHub", icon: "Github", highlight: "Collaboration & CI" },
          { name: "VS Code", icon: "AppWindow", highlight: "IDE & Extensions" },
          { name: "Jupyter Notebook", icon: "BookOpen", highlight: "EDA & Prototyping" },
          { name: "Vercel", icon: "CloudUpload", highlight: "Deployment & Hosting" }
        ]
      }
    ]
  },

  /**
   * PROJECTS CONFIGURATION
   * ------------------------------------------------------------
   * To add a new project in the future, simply copy this template and add it to the array below:
   * 
   * {
   *   id: "unique-project-slug",
   *   title: "Project Title",
   *   tagline: "Short one-line subtitle",
   *   description: "Concise summary of what the project does and its impact.",
   *   technologies: ["Python", "Pandas", "SQL"],
   *   category: "Data Science",         // Display badge (e.g. "Data Analytics", "AI / ML", "Web App")
   *   status: "Completed",              // "Completed" | "In Progress" | "Coming Soon"
   *   image: "",                        // (Optional) Path to image in public/ e.g. "/projects/my-app.png"
   *   github: "https://github.com/...", // (Optional) GitHub repository link
   *   demo: "https://...",              // (Optional) Live demo link
   *   iconType: "code",                 // (Optional fallback) "trending-up" | "gauge" | "database" | "code"
   * }
   */
  projects: [
    {
      id: "retail-demand-forecasting",
      title: "Retail Demand Forecasting",
      tagline: "Hackathon Analytics & Auto-Reorder Engine",
      description: "Retail analytics application that helps businesses forecast product demand and make better inventory and auto-reorder decisions. Built during TakeOver'26 Hackathon.",
      longDescription: "Developed during an intensive 24-hour sprint to solve supply chain inefficiencies. Built analytical demand forecast models paired with an automated inventory threshold trigger system.",
      technologies: ["Python", "Data Analytics", "Forecasting", "Flask"],
      category: "Hackathon Project",
      status: "Completed",
      image: "",
      github: "https://github.com",
      demo: "",
      featured: true,
      accentColor: "from-emerald-500/20 to-teal-500/10",
      iconType: "trending-up"
    },
    {
      id: "daikibo-telemetry",
      title: "Daikibo Telemetry Dashboard",
      tagline: "Industrial IoT Downtime Analytics",
      description: "Interactive Tableau dashboard analyzing factory downtime and device-level telemetry data to identify operational patterns and potential improvement areas.",
      longDescription: "Aggregated device sensor logs and factory telemetry metrics to construct interactive BI views, helping plant operators diagnose downtime causes and optimize machine reliability.",
      technologies: ["Tableau", "Data Visualization", "Data Analysis"],
      category: "BI & Data Visualization",
      status: "Completed",
      image: "",
      github: "https://github.com",
      demo: "",
      featured: true,
      accentColor: "from-blue-500/20 to-cyan-500/10",
      iconType: "gauge"
    }
  ],

  experience: [
    {
      role: "Data Analytics Intern",
      company: "Data Dynamics",
      type: "Internship",
      period: "Recent Exposure",
      badge: "Industry Experience",
      focus: ["Data Analysis", "Data Handling", "Analytical Tasks", "Industry Exposure"],
      bullets: [
        "Performed exploratory data analysis and structured data cleaning across operational datasets.",
        "Collaborated on analytical tasks to identify trends, anomalies, and actionable data patterns.",
        "Acquired foundational industry exposure to analytical workflows and data-informed decision making."
      ]
    },
    {
      role: "Content Writer & Storyteller",
      company: "Content & Technical Media",
      type: "Creator / Freelance",
      period: "4+ Months",
      badge: "Communication & Research",
      focus: ["40+ Scripts Written", "Research & Synthesis", "Technical Storytelling", "Blog Creation"],
      bullets: [
        "Researched and authored 40+ structured scripts and technology-focused content pieces.",
        "Distilled complex technical and conceptual ideas into captivating, easy-to-understand narratives.",
        "Refined audience engagement, structured storytelling, and clear technical communication."
      ]
    }
  ],

  achievements: [
    {
      title: "TakeOver'26 Hackathon",
      organization: "24-Hour Build Sprint",
      badge: "Hackathon Build",
      highlight: "Retail Demand Forecasting + Auto-Reorder",
      description: "Participated in an intense 24-hour hackathon focused on solving critical real-world business bottlenecks. Built a predictive forecasting model and automated replenishment system under strict time constraints.",
      tags: ["24-Hour Sprint", "Supply Chain Problem", "Python & Analytics", "Rapid Prototyping"]
    }
  ],

  currentlyLearning: [
    { name: "Data Engineering", area: "Pipelines & SQL", icon: "Layers", status: "Active Focus" },
    { name: "Machine Learning", area: "Algorithms & Math", icon: "Brain", status: "In Depth" },
    { name: "Generative AI", area: "Embeddings & Agents", icon: "Sparkles", status: "Active Focus" },
    { name: "LLM Applications", area: "RAG & Workflows", icon: "Cpu", status: "Active Focus" },
    { name: "System Design", area: "Scalability & Caching", icon: "Network", status: "Foundations" },
    { name: "DSA", area: "Problem Solving", icon: "Code2", status: "Continuous" }
  ],

  navLinks: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" }
  ]
};
