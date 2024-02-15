Web Scraper Application

Overview

This project is a web application designed to simplify the process of web scraping for users without coding experience. It allows users to extract data from desired websites by providing the URL of the website and CSS selectors to target specific elements. The application streamlines the scraping process, enabling users to input text selectors to scrape the data they need, assign meaningful column names, and manage the scraped data efficiently.

Distinctiveness and Complexity

Distinctiveness
•	This project is unique in its emphasis on delivering a user-friendly interface tailored specifically for web scraping, making it accessible to users without technical expertise.
•	The utilization of React for the frontend and Django Rest Framework for the backend provides a powerful and adaptable solution, distinguishing it from previous projects in the CS50’s Web Programming with Python and JavaScript course.
•	Authentication functionalities, along with advanced data storage and manipulation capabilities, further set this project apart, offering a comprehensive and feature-rich experience not typically found in traditional e-commerce or social media applications done previously in the course.

Complexity
•	The project's complexity lies in its integration of multiple technologies, including React, Django, Django Rest Framework, and Scrapy.
•	It involves the creation of frontend components in React, backend logic in Django, and spider implementation in Scrapy, showcasing a diverse skill set.
•	The incorporation of user authentication, data validation, and CRUD operations adds complexity to the project.

File Structure

Frontend (caps-frontend)
•	public: Contains the main HTML file and other static assets.
•	src: Contains React components, including:
o	Archive.js: Manages saved data, allowing deletion, editing, and downloading.
o	Dashboard.js: Displays scraped data and provides options for editing, deleting, downloading, and 
saving data.
o	Home.js: Provides an introduction to the application.
o	Login.js: Handles user authentication.
o	Navbar.js: Navigational component for accessing different sections of the application.
o	Register.js: Allows user account creation.
o	ScrapeForm.js: Enables users to input scraping parameters.
o	UserContext.js: Manages user authentication state.

Backend (WebScraper)
•	pycache: Contains Python bytecode files.
•	migrations: Django database migration files.
•	scrapy_spider: Contains Scrapy project files for web scraping.
•	static: Holds static files such as CSS stylesheets.
•	models.py: Defines custom user and scraped data models.
•	serializers.py: Contains serializers for user registration, login, and data manipulation.
•	urls.py: Configures URL routing for the application.
•	validations.py: Includes custom validation functions for user registration data.
•	views.py: Defines Django views for user authentication and CRUD operations.

Additional Dependencies

•	Axios: This project utilizes Axios, a promise-based HTTP client for making requests to the backend API endpoints. Axios simplifies the process of handling asynchronous requests and managing responses.
•	Ant Design: Ant Design is used for styling and designing tables in the application. It offers a set of high-quality React components with a sleek and modern design, enhancing the user experience and visual appeal of the tables.
Usage
•	Axios facilitates communication between the frontend and backend, allowing seamless interaction with the Django REST Framework endpoints.
•	Ant Design's table components provide a user-friendly interface for viewing and managing data, offering features such as sorting, filtering, and pagination.
Integration
•	Axios is integrated into the React components to make HTTP requests to the backend API, enabling data retrieval, storage, and manipulation.
•	Ant Design's table components are customized and integrated into the frontend components, such as Dashboard.js and Archive.js, to display scraped data and provide functionalities for editing, deleting, and downloading data.
How to Install Additional Dependencies
•	Install Axios using npm install axios.
•	Install Ant Design using npm install antd.
•	Install papaparse using npm install papaparse
•	Install react-router-dom using npm install react-router-dom
Note
•	Ensure that appropriate Ant Design components are imported and utilized within the React components to leverage the features and styling provided by Ant Design.
•	Refer to the official documentation of Axios and Ant Design for detailed usage instructions and customization options.
By incorporating Axios and Ant Design into the project, users can benefit from enhanced data management capabilities and improved user interface design, resulting in a more efficient and user-friendly web scraping experience.

How to Run the Application
1.	Clone the repository to your local machine.
2.	Navigate to the project directory in your terminal.
3.	Run the Django server using python manage.py runserver.
4.	In a separate terminal window, navigate to the caps-frontend directory and run the React development server using npm start.
5.	Open your web browser and navigate to http://127.0.0.1:3000 to access the web application. You can now use the application to perform web scraping tasks and manage scraped data.
Additional Information
•	This project utilizes Bootstrap for styling components and forms.
•	Ensure that appropriate permissions are set for the scrapy_spider directory to allow Scrapy spiders to run.
•	The application has been tested on modern web browsers, including Chrome, Firefox, and Safari.
•	For any questions or issues, please contact adiel.rodriguez39@myhunter.cuny.edu or adiel6767 on github.
•	Contributions and feedback are welcome via pull requests and issues on GitHub.
By following these instructions, users can set up and run the web scraper application locally, enabling them to scrape data from desired websites efficiently and manage the scraped data effectively.

