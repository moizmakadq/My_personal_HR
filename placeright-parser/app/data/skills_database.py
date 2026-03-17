from __future__ import annotations

from itertools import chain

MASTER_SKILLS = {
    "programming": [
        "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Rust", "Kotlin",
        "Swift", "PHP", "Ruby", "Scala", "R", "MATLAB", "Dart", "Perl", "Shell Scripting", "Bash",
        "PowerShell", "Julia", "Objective-C", "Haskell", "Elixir", "Lua", "Groovy", "Fortran",
        "Assembly", "VBA", "COBOL", "F#", "Prolog", "Delphi", "Visual Basic", "Solidity", "SAS",
        "Apex", "ABAP", "LabVIEW",
    ],
    "frontend": [
        "HTML", "HTML5", "CSS", "CSS3", "Sass", "Less", "Tailwind CSS", "Bootstrap", "Material UI",
        "React", "React.js", "Next.js", "Redux", "Vue", "Vue.js", "Nuxt.js", "Angular", "Svelte",
        "SvelteKit", "jQuery", "Webpack", "Vite", "Parcel", "Babel", "Storybook", "Chakra UI",
        "Ant Design", "Framer Motion", "Three.js", "D3.js", "Chart.js", "Recharts", "PWA",
        "Responsive Design", "Web Accessibility", "Styled Components", "Emotion", "Shadcn UI",
    ],
    "backend": [
        "Node.js", "Express.js", "NestJS", "Django", "Flask", "FastAPI", "Spring", "Spring Boot",
        "Hibernate", "ASP.NET", ".NET Core", "Laravel", "CodeIgniter", "Ruby on Rails", "Phoenix",
        "Gin", "Echo", "Fiber", "Actix", "Rocket", "GraphQL", "REST API", "gRPC", "Microservices",
        "RabbitMQ", "Kafka", "Celery", "Gunicorn", "Nginx", "Apache", "JWT", "OAuth", "OpenAPI",
        "Swagger", "Serverless", "Cloud Functions", "WebSockets", "Socket.IO", "Auth0", "Supabase",
    ],
    "database": [
        "SQL", "MySQL", "PostgreSQL", "SQLite", "MariaDB", "Oracle", "MongoDB", "Redis", "Cassandra",
        "DynamoDB", "Firebase", "Firestore", "Neo4j", "CouchDB", "Elasticsearch", "OpenSearch",
        "BigQuery", "Snowflake", "Redshift", "Hive", "Presto", "ClickHouse", "TimescaleDB",
        "InfluxDB", "Cosmos DB", "Realm", "Supabase Postgres", "Prisma", "Sequelize", "TypeORM",
        "Mongoose", "Knex", "Liquibase", "Flyway", "PL/SQL", "Database Design", "ORM",
    ],
    "cloud_devops": [
        "AWS", "Amazon Web Services", "GCP", "Google Cloud Platform", "Azure", "DigitalOcean",
        "Heroku", "Netlify", "Vercel", "Docker", "Kubernetes", "OpenShift", "Terraform", "Ansible",
        "Chef", "Puppet", "Jenkins", "GitHub Actions", "GitLab CI", "CI/CD", "ArgoCD", "Helm",
        "Prometheus", "Grafana", "Datadog", "CloudWatch", "Sentry", "Linux", "Ubuntu", "CentOS",
        "VMware", "VirtualBox", "Load Balancing", "Autoscaling", "Cloud Security", "IAM",
        "CloudFormation", "Serverless Framework", "Istio", "Traefik",
    ],
    "data_science_ml": [
        "Pandas", "NumPy", "SciPy", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "XGBoost",
        "LightGBM", "CatBoost", "OpenCV", "NLP", "Natural Language Processing", "Computer Vision",
        "Machine Learning", "Deep Learning", "Reinforcement Learning", "Data Mining", "Statistics",
        "Data Analysis", "Data Visualization", "Power BI", "Tableau", "Matplotlib", "Seaborn",
        "Plotly", "Jupyter", "Apache Spark", "PySpark", "Hadoop", "Airflow", "MLflow", "Feature Engineering",
        "Model Deployment", "MLOps", "spaCy", "NLTK", "Transformers", "LangChain", "LLM",
    ],
    "mobile": [
        "Android", "Android Studio", "iOS", "React Native", "Flutter", "Xamarin", "Ionic", "Cordova",
        "SwiftUI", "Jetpack Compose", "Kotlin Multiplatform", "Firebase Messaging", "Mobile UI",
        "Play Console", "App Store Connect", "Expo", "Mobile Testing", "Gradle", "Fastlane", "APK",
    ],
    "tools": [
        "Git", "GitHub", "GitLab", "Bitbucket", "Postman", "Insomnia", "Figma", "Canva", "Notion",
        "Jira", "Confluence", "Trello", "Slack", "VS Code", "IntelliJ IDEA", "PyCharm", "Eclipse",
        "Android Studio", "Xcode", "Selenium", "Cypress", "Playwright", "JUnit", "Pytest", "unittest",
        "Mocha", "Jest", "Vitest", "SonarQube", "JMeter", "Burp Suite", "Wireshark", "Excel",
        "Google Sheets", "Miro", "Draw.io", "LaTeX", "Markdown", "Asana",
    ],
    "concepts": [
        "Data Structures", "Algorithms", "Object Oriented Programming", "Functional Programming",
        "DBMS", "Operating Systems", "Computer Networks", "System Design", "Distributed Systems",
        "Microservices Architecture", "Design Patterns", "Agile", "Scrum", "Kanban", "SDLC",
        "Testing", "Unit Testing", "Integration Testing", "Regression Testing", "API Testing",
        "Responsive Design", "Accessibility", "Caching", "Concurrency", "Multithreading",
        "Socket Programming", "Cyber Security", "Encryption", "Authentication", "Authorization",
        "Problem Solving", "Debugging", "Code Review", "Clean Code", "DevOps Practices", "ETL",
        "Data Warehousing", "Requirement Gathering", "Technical Documentation",
    ],
}

SKILL_ALIASES = {
    "node.js": ["nodejs", "node"],
    "express.js": ["expressjs", "express"],
    "react": ["react.js", "reactjs"],
    "vue": ["vue.js", "vuejs"],
    "next.js": ["nextjs"],
    "nuxt.js": ["nuxtjs"],
    "postgresql": ["postgres", "psql"],
    "mongodb": ["mongo", "mongo db"],
    "kubernetes": ["k8s"],
    "javascript": ["js"],
    "typescript": ["ts"],
    "natural language processing": ["nlp"],
    "amazon web services": ["aws"],
    "google cloud platform": ["gcp"],
    "machine learning": ["ml"],
    "deep learning": ["dl"],
    "artificial intelligence": ["ai"],
    "shell scripting": ["shell", "bash scripting"],
    "continuous integration": ["ci/cd", "ci cd"],
    "power bi": ["powerbi"],
    "scikit-learn": ["sklearn"],
}

CASING_MAP = {
    skill.lower(): skill
    for skill in chain.from_iterable(MASTER_SKILLS.values())
}

CASING_MAP.update(
    {
        "react.js": "React",
        "reactjs": "React",
        "vue.js": "Vue",
        "vuejs": "Vue",
        "nodejs": "Node.js",
        "expressjs": "Express.js",
        "nextjs": "Next.js",
        "nuxtjs": "Nuxt.js",
        "aws": "AWS",
        "gcp": "GCP",
        "ci/cd": "CI/CD",
        "ci cd": "CI/CD",
        "html": "HTML",
        "html5": "HTML5",
        "css": "CSS",
        "css3": "CSS3",
        "sql": "SQL",
        "nlp": "NLP",
        "oop": "Object Oriented Programming",
        "dbms": "DBMS",
        "rest api": "REST API",
        "graphql": "GraphQL",
        "jwt": "JWT",
        "oauth": "OAuth",
        "c++": "C++",
        "c#": "C#",
    }
)

ALL_SKILLS = sorted({proper for proper in CASING_MAP.values()}, key=str.lower)
SKILL_LOOKUP = {skill.lower(): category for category, skills in MASTER_SKILLS.items() for skill in skills}
