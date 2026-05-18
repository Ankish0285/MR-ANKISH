### PROJECT STRUCTURE
```bash
Directory structure:
└── ankish0285-mr-ankish/
    ├── README.md
    ├── 00_DEPLOY_NOW.txt
    ├── PROJECT_STRUCTURE.md
    ├── BACKEND/
    │   ├── app.py
    │   ├── fastapi_example.py
    │   ├── requirements.txt
    │   ├── database/
    │   │   └── .gitkeep
    │   ├── models/
    │   │   ├── __init__.py
    │   │   ├── db.py
    │   │   └── serializers.py
    │   ├── routes/
    │   │   ├── __init__.py
    │   │   ├── admin.py
    │   │   ├── cms_public.py
    │   │   ├── contact.py
    │   │   └── projects.py
    │   └── utils/
    │       ├── __init__.py
    │       ├── auth.py
    │       ├── mail.py
    │       └── youtube.py
    └── FRONTEND/
        ├── index.html
        ├── jsconfig.json
        ├── package.json
        ├── vercel.json
        ├── vite.config.js
        ├── .env.example
        └── src/
            ├── App.jsx
            ├── constants.js
            ├── index.css
            ├── main.jsx
            ├── assets/
            │   ├── .gitkeep
            │   ├── icons/
            │   │   └── .gitkeep
            │   └── images/
            │       └── .gitkeep
            ├── components/
            │   ├── Footer.jsx
            │   ├── Navbar.jsx
            │   ├── PageLoader.jsx
            │   ├── ScrollToTop.jsx
            │   ├── SocialIcons.jsx
            │   ├── admin/
            │   │   ├── ImageUrlField.jsx
            │   │   └── RequireAuth.jsx
            │   ├── icons/
            │   │   └── Youtube.jsx
            │   └── ui/
            │       └── Button.jsx
            ├── context/
            │   └── SiteSettingsContext.jsx
            ├── data/
            │   └── fallbackProjects.js
            ├── hooks/
            │   └── useActiveSection.js
            ├── pages/
            │   ├── ContentCreator.jsx
            │   ├── PublicSite.jsx
            │   └── admin/
            │       ├── AdminAbout.jsx
            │       ├── AdminAchievements.jsx
            │       ├── AdminContactPage.jsx
            │       ├── AdminContentCreator.jsx
            │       ├── AdminDashboard.jsx
            │       ├── AdminExperience.jsx
            │       ├── AdminHome.jsx
            │       ├── AdminLayout.jsx
            │       ├── AdminLogin.jsx
            │       ├── AdminMessages.jsx
            │       ├── AdminProjects.jsx
            │       ├── AdminSettings.jsx
            │       └── AdminSkills.jsx
            ├── sections/
            │   ├── About.jsx
            │   ├── Achievements.jsx
            │   ├── Contact.jsx
            │   ├── Experience.jsx
            │   ├── Hero.jsx
            │   ├── Projects.jsx
            │   └── Skills.jsx
            └── services/
                ├── api-fetch.js
                └── api.js
```
