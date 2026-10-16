# Azugh AI

Azugh AI is a **web application** that recommends fashion items based on **user preferences** and **travel destinations**. By leveraging machine learning, user interactions, and external fashion sources, Azugh AI refines recommendations dynamically.

**Version:** 1.0.0  
**Last Updated:** June 4, 2025  

---

## 🚀 Features

### 🔹 User Experience
- **Sign Up & Onboarding** – Users provide key details like **name, gender, age, location**, and **fashion preferences** through predefined questions or image uploads.
- **Pinterest Integration** – Connects with **Pinterest API** to understand user style based on past activity.
- **Search by Destination** – Find clothing recommendations based on **local culture, seasonal trends, and user interactions** in that area.
- **Personalized Feed** – Dynamic clothing recommendations improve over time with **user interactions (clicks, likes, saves, purchases)**.

### 🔹 Product Sourcing & Processing
- **Automated Web Scraping** – Scrapes fashion items from **ASOS and other stores** using **Selenium & BeautifulSoup**.
- **Embedding & Storage** – Extracted product data is **processed, embedded, and stored** in a database with **Azure Blob Storage** for images.

### 🔹 Smart Recommendations
- **Ranking Algorithm** – Uses **K-Nearest Neighbors (KNN)** and **machine learning models** to personalize clothing suggestions.
- **Continuous Model Retraining** – Refines recommendations based on **user activity trends**.

---

## 🏗️ Technology Stack

### 🔹 Backend (Django)
- **Django & Django REST Framework (DRF)** – API and backend services.
- **MySQL** – Relational data storage.
- **Redis & Celery** – Task scheduling and queue management for background jobs.
- **Memcached** – Performance optimization and caching.
- **Milvus** – Vector database for storing and querying embeddings.
- **Pytest** – Comprehensive test coverage with 80%+ coverage for core modules.

### 🔹 Machine Learning
- **PyTorch** – Deep learning framework for image processing and embeddings.
- **Transformers & HuggingFace** – Pre-trained models for text and vision tasks.
- **CLIP** – Open-source model for image-text embeddings.

### 🔹 Frontend
- **React** – Modern component-based UI framework.
- **TypeScript** – Type-safe JavaScript for robust development.
- **Vite** – Next-generation frontend build tooling.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **Shadcn UI** – Beautiful, accessible component library.
- **React Router** – Client-side routing for single-page application.
- **React Query** – Data fetching and state management.
- **React Three Fiber** – 3D graphics for interactive product viewing.

### 🔹 Third-Party Integrations
- **Pinterest API** – Enhances fashion insights.
- **Stripe** – Secure payment processing.
- **Google Login** – Quick authentication.
- **Azure Blob Storage** – Image hosting and serving.

### 🔹 DevOps & Deployment
- **Azure Web App Service** – Hosting and cloud infrastructure.
- **CI/CD** – Automated deployment via **Azure DevOps Pipelines**.

---

## 📌 Project Status

| Feature                      | Status     | Version |
|------------------------------|-----------|---------|
| **Scrapers**                 | Completed | 1.0     |
| **Clothes sourcing pipeline**| Completed | 1.0     |
| **Vector Database Integration** | Completed | 1.0  |
| **Business infrastructure**  | Completed | 1.0     |
| **User tracking**            | Completed | 1.0     |
| **Clothing ranking algorithm** | Completed | 1.0   |
| **Search clothing items**    | Completed | 1.0     |
| **Frontend explore section** | Completed | 1.0     |
| **Frontend search section**  | Completed | 1.0     |
| **Pinterest Integration**    | In Progress | 0.8   |
| **Mobile Responsiveness**    | In Progress | 0.7   |
| **AI Image Recognition**     | Planned   | 0       |
| **Community Features**       | Planned   | 0       |

---

## 📖 How It Works

### 1. **User Sign-Up & Onboarding**
   - Users provide basic details and answer style preference questions through an intuitive React interface
   - Multi-step onboarding collects fashion preferences, size information, and style preferences
   - User data is securely stored and encrypted in MySQL
   - Optional Pinterest integration extends user style understanding

### 2. **Data Collection Pipeline**
   - Automated scraping system retrieves products from fashion websites on a scheduled basis
   - Images are processed through CLIP to extract visual features and stored in Azure Blob Storage
   - Product details, including price, description, and availability are indexed
   - Vector embeddings representing product visual features are stored in Milvus

### 3. **Smart Search & Recommendations**
   - Products are ranked using a hybrid approach:
     - Cosine similarity for visual features (vector matching)
     - User interaction history (clicks, likes, purchases)
     - Contextual relevance (destination, weather, season)
   - Machine learning models continuously refine results based on user feedback
   - Search results update in real-time through React Query integration

### 4. **Destination-Based Fashion Search**
   - Location data is processed to understand climate, cultural context, and seasonal trends
   - Custom embedding pipeline connects travel destinations to appropriate fashion items
   - Results are filtered and ranked based on relevance to the destination

---

## 📌 Future Enhancements
- **AI-powered Fashion Image Recognition** – Allow users to upload pictures for style matching.
- **Advanced ML-Based Ranking** – Improve search and ranking with **deep learning**.
- **Community Trends** – Display trending fashion items in different locations.

---

## Directory structure
```
AzughAI-WebApp
|
├── backend/                # Django backend
│   ├── azughai/            # Django project directory (inner)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   ├── wsgi.py
│   │   ├── celery.py      # Celery configuration
│   │   └── __init__.py
│   ├── common/             # Shared components and utilities
│   ├── users/              # User management (Auth, Profiles, Preferences)
│   ├── products/           # Product scraping, storage, and display
│   ├── vector_db/          # Milvus vector database integration
│   ├── recommendations/    # Ranking algorithm & ML model
│   ├── search/             # Location-based & keyword search
│   ├── payments/           # Stripe integration
│   ├── tracking/           # User activity tracking (clicks, saves, buys)
│   ├── integrations/       # Pinterest API & third-party services
│   ├── libs/               # Custom libraries including fashion scrapers
│   │   └── fashionscrapers/
│   ├── logs/               # Log files
│   ├── media/              # User-uploaded content
│   ├── manage.py
│   ├── requirements.txt    # Python dependencies
│   └── pytest.ini          # Pytest configuration
│
├── frontend/               # React frontend
│   ├── src/                # React source code
│   ├── public/             # Static files
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── tsconfig.json       # TypeScript configuration
│
├── devplan/                # Development planning documents
│   ├── DEVPLAN.md
│   └── features/
│
├── docs/                   # Documentation
│   ├── SRS.md              # Software Requirements Specification
│   ├── integration_req.md  # Integration requirements
│   └── NOTES.md            # Development notes
│
├── logs/                   # Application logs
├── examples/               # Example screenshots and mockups
├── azure-pipelines.yml     # Azure CI/CD pipeline config
└── README.md               # Project documentation
```

---

## 🛠️ Setup & Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/AzughAI-WebApp.git
   cd AzughAI-WebApp
   ```
   
2. Create a virtual environment:
   ```bash
   cd backend
   python3 -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```
   
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
4. Create a `.env` file in the backend directory with the following variables:
   ```
   DEBUG=True
   SECRET_KEY=your_secret_key
   DATABASE_URL=mysql://user:password@localhost:3306/azughai
   REDIS_URL=redis://localhost:6379/0
   MILVUS_LITE_PATH=./milvus_demo.db
   AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
   ```
   
5. Run database migrations:
   ```bash
   python manage.py migrate
   ```
   
6. Start Redis (for Celery):
   ```bash
   redis-server
   ```
   
7. Start Celery worker (in a new terminal):
   ```bash
   cd backend
   source env/bin/activate
   celery -A azughai worker -l info
   ```
   
8. Start Celery beat for scheduled tasks (in another terminal):
   ```bash
   cd backend
   source env/bin/activate
   celery -A azughai beat -l info
   ```
   
9. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
   
2. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
   
3. Start the development server:
   ```bash
   npm run dev
   ```
   
The application should now be running with the backend at http://localhost:8000 and frontend at http://localhost:5173

---

## 📞 Contact

For contributions, feedback, or inquiries, reach out to **Walid El Mouahidi** at **walid@airmedia.uk** and **Rayan Zeggari** at **rayan@airmedia.uk**.


zsh
docker compose -f docker-compose.production.yml up -d