# Azugh AI
**Version:** 1.0.0  
**Date:** 15-02-2025  
**Client:** Azugh  

## Overview
Azugh AI is a **web application** that recommends fashion items based on **user preferences** and **travel destinations**. By leveraging machine learning, user interactions, and external fashion sources, Azugh AI dynamically refines its recommendations to enhance the user experience.

## Users
### Primary Users
- **Fashion Enthusiast:** A user who is passionate about fashion and seeks personalized recommendations.
  
### Secondary Users
- **Admin:** A user who manages the application, including user data, product data, and scraping jobs.

## Tech Stack
### Backend
- **Languages:** Python  
- **Frameworks:** Django  
- **Database:** MySQL  
- **Caching:** Memcached  
- **Webserver:** Nginx  
- **Additional Stack:** Celery, Redis  

### Frontend
- **Languages:** HTML, CSS, JavaScript  
- **Frameworks:** None  
- **Additional Stack:** None  

### External Dependencies
- Stripe  
- Google Authentication  
- OpenAI API  
- Pinterest API  
- Bubble.io for some UI components  

### Platform
- Web  

## Features

| Name                          | Description                                                                                   | Use Case                                                            | Input                                                 | Output                                             |
|-------------------------------|-----------------------------------------------------------------------------------------------|---------------------------------------------------------------------|------------------------------------------------------|---------------------------------------------------|
| Authentication                | This feature allows users to securely log in and access their accounts.                     | Users need to authenticate to access personalized content and features. | Username and password or third-party authentication tokens. | Access token or session identifier for the authenticated user. |
| Sign Up & Onboarding          | Users provide key details like **name, gender, age, location**, and **fashion preferences**. | User sign up for first-time access and provide necessary information for personalized recommendations. | User details, fashion preferences, and location.    | User profile with preferences and settings.       |
| Pinterest Integration         | Connects with **Pinterest API** to understand user style based on past activity.              | Users can import their Pinterest boards to get personalized recommendations. | Pinterest API key and user access token.            | User's Pinterest boards and style preferences.    |
| Search by Destination         | Find clothing recommendations based on **local culture, seasonal trends, and user interactions**. | Users search for fashion items suitable for specific travel destinations. | Destination location, travel dates.                 | Curated list of clothing items suitable for the destination. |
| Personalized Feed             | Dynamic clothing recommendations improve over time with **user interactions**.                | Users browse personalized clothing recommendations tailored to their preferences. | User profile, interaction history, preferences.      | Personalized clothing recommendations displayed in user feed. |
| Automated Web Scraping        | Scrapes fashion items from **ASOS and other stores** using **Selenium & BeautifulSoup**.   | System automatically collects fashion items data from multiple sources. | Target websites, scraping parameters, scheduling settings. | Raw fashion product data ready for processing.    |
| Embedding & Storage           | Extracted product data is **processed, embedded, and stored** in a database.                | System processes and stores scraped fashion data in structured format. | Raw fashion product data from scrapers.             | Processed and embedded fashion data stored in database. |
| Ranking Algorithm             | Uses **K-Nearest Neighbors (KNN)** and **machine learning models** to personalize clothing suggestions. | System ranks fashion items based on relevance to user preferences. | User profile, preferences, fashion items data, contextual information. | Ranked list of fashion items.                      |
| Continuous Model Retraining   | Refines recommendations based on **user activity trends**.                                   | System improves recommendation accuracy over time through learning. | User interaction data, feedback, purchase history.  | Updated machine learning models with improved recommendation accuracy. |
| Admin Dashboard               | Provides an interface for admins to **manage users, products, and scraping jobs**.            | Admins can monitor and control system operations.                   | Admin credentials, user data, product data.          | Admin dashboard with monitoring and control features. |
| User Activity Tracking        | Records user interactions like **clicks, likes, saves, purchases** for recommendation improvement. | System tracks user behavior to enhance personalized recommendations. | User interactions, timestamps, product IDs.         | User activity logs for recommendation analysis.   |

## Installation & Setup
1. Clone the repository:  
   `git clone [repository_url]`
2. Navigate to the project directory:  
   `cd [project_directory]`
3. Install dependencies:  
   `pip install -r requirements.txt`
4. Run database migrations:  
   `python manage.py migrate`
5. Start the development server:  
   `python manage.py runserver`

## Timeline
- **Start Date:** 15-02-2025  

## License and Legal Information
Copyright © 2025 AirMedia LIMITED. All rights reserved.  
This software and associated documentation files (the "Software") are the proprietary property of AirMedia LIMITED, a company registered in London, UK.  
Unauthorized use, distribution, or modification of this Software is strictly prohibited.