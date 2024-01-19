# Web Engineering and Technologies Project: CaseAce Backend

## Problem Statements
Managing legal cases, staff tasks, and client communications efficiently is a challenge for many law firms. Without an integrated system, firms may struggle with missing deadlines, tracking case details, or managing client information, resulting in inefficiencies, miscommunication, and delays. 

**CaseAce** is designed to simplify and streamline case management by providing a web-based solution that helps law firms manage staff tasks, track case deadlines, view detailed case information, and receive alerts for important events such as court dates.

## Project Overview
**CaseAce Backend** is a web-based case and task management system designed specifically for law firms. It enables legal professionals to keep track of ongoing cases, deadlines, and client-related tasks with an intuitive and easy-to-use interface. The system allows law firm staff (partners and paralegals) to manage their workflow efficiently and stay informed about critical case dates such as court hearings and task deadlines.

The platform also provides a dashboard that gives a comprehensive view of all ongoing tasks and cases, helping the team stay on top of their responsibilities and ensure no important task is overlooked. The app also supports seamless document management, client tracking, and notifications for important dates.

Key features include case tracking, task management, document uploads, and custom reminders for key dates. Built with simplicity and scalability in mind, **CaseAce** is designed to adapt to a law firm's evolving needs. The goal is to simplify law firm operations, improve productivity, and ensure that all staff members are on the same page.

## System Objectives
- To develop a system for law firm staff to manage cases and managing their staffs in the cases.
- To develop a system for law firm staffs and their client to keep track of the tasks and documents required in the case assigned to them.
- To develop a system for law firm staffs and clients to track and receive alerts on important dates such as dates of court hearings that are tied to individual cases, as well as deadlines for tasks associated with the case.

## Stakeholders
1.  **Law Firm Administrators (Admins, Partners, and Associates):** These individuals are responsible for overseeing the overall operation of the law firm. They are interested in the application's ability to enhance firm-wide efficiency, streamline administrative processes, and provide comprehensive insights into case management, client relationships, and task assignments.
2.	**Lawyers/Attorneys (Partners and Associates):** Legal practitioners are key stakeholders who seek a user-friendly interface that helps them efficiently manage cases, access relevant documents, and collaborate with clients and colleagues. They are interested in a system that simplifies their workload, improves communication, and ensures timely access to case-related information.
3.	**Paralegals and Support Staff:** Paralegals and support staff play a crucial role in case management. They are concerned with task assignment clarity, efficient workflow, and tools that facilitate effective communication with lawyers and clients. The system's effectiveness in task management and collaboration directly impacts their daily responsibilities.
4.	**Clients:** Clients are interested in a transparent system that allows them to track the progress of their cases, access relevant documents, and receive timely updates on important dates such as court hearings and task deadlines. They value a user-friendly platform that enhances communication and provides visibility into the legal process.

## Functionalities
1. **Client Relation Management Module:** 
- Serves as a tool for admins and law firms to effectively manage client relationships and details. 
- Includes features such as storing client contacts and cases in a structured database, allowing easy viewing and updating through the admin dashboard. 
- Tracks client interactions, active status, and case history in a timeline for administrators to review case status and progress.
- Clients are prompted to rate law firm services, and these ratings are displayed on the admin dashboard.
2. **Case Management Module:** 
- Designed for partners (admins) to assign suitable lawyers and paralegals to handle specific client cases. 
- Allows partners to create and edit cases, assign manpower, and enables all users in the system to view related case details. 
3. **Document Management Module:**
- Enables system users to handle documents related to their cases.
- Users can upload, store, and request documents securely in the cloud storage online.
- The module also allows viewing and downloading of desired documents and integrates seamlessly with case management. 
4. **Task Management Module:**
- Designed for admins and paralegals to manage task distribution processes. 
- Enables the creation, assignment, and prioritization of tasks. 
- Sends reminders for deadlines and helps track task progress, allowing users to monitor completed and incomplete tasks in their dashboards. 
5. **Appointment Management Module:**
- Facilitates scheduling and managing appointments. 
- Users can schedule, reschedule, and cancel appointments, accept or decline invitations, and the system integrates with the calendar to provide an overview of appointments.
- Automated reminders reduce the likelihood of oversights.

## Modelling of Web Application
### User Diagram
<p align="center">
<img src="readme-assets/01 User Diagram.png" alt="user diagram"/>
<br>
<i>Figure 1: User diagram for CaseAce</i>
</p>
There are 4 types of users for CaseAce, which are Client, paralegals, associates, and partners.

Client can use CaseAce for legal consultation and put forward their own legal needs. Paralegals are support staff on the legal team, responsible for assisting attorneys with cases and completing daily clerical tasks. Associates are members of the legal team, including attorneys and paralegals. They need to use the CaseAce platform to collaborate on cases, share files and information, and ensure effective team communication. Partners are the leading members of the legal team and are responsible for the management and business decisions of the entire team. They need to use the CaseAce platform to monitor team activities, view overall case progress, and be responsible for providing guidance.

### Use Case
#### Use Case Diagram
<p align="center">
<img src="readme-assets/02 Use Case Diagram.png" alt="use case diagram"/>
<br>
<i>Figure 2: Use case diagram for CaseAce</i>
</p>

CaseAce has several different use cases, each designed for a different type of user.
1. **Client:**
- CaseAce's Client can first manage its own account, including creating an account, then logging in, uploading personal information, and logging out of the account. 
- The client can also upload documents, preview documents, and view all uploaded files. 
- The client can enter the appointment function to view the lawyer assigned to him. 
- The lawyers are assigned by the admin to the client, usually associates, and sometimes partners.
2. **Admin:**
- CaseAce's Admin can handle all document management, including uploading official documents, requesting document uploads, viewing all documents and removing documents. 
- Admin also has the ability to view and manage all client user accounts. 
- For the Paralegal (lawyer) part, Admin can assign all Paralegals, which includes assigning Paralegals to meet with users, arrange meeting schedules, and set meeting details, etc., and each Admin can issue tasks to each Paralegal and can specify deadlines, editing content, etc. 
- Admin can control all case matters, such as assigning Paralegal to handle cases, editing case details, and deleting cases, etc. 
- For Associates, some basic document management tasks can be handled, such as uploading and deleting documents. They may also view customer user accounts but may not be competent in administrative operations. 
- Associates will receive tasks from Admin at any time and need to be completed before the specified deadline. 
- Partners can have more permissions, such as managing customer user accounts, assigning Paralegals, publishing tasks, etc. 
- They may also be responsible for handling more complex case matters, such as editing case details, deleting cases, etc.
3. **Paralegal:**
- CaseAce's Paralegal also has all the capabilities of Customer Relation Management and Document Management. 
- They can then use appointment management to view the assignments assigned to them by Admin at any time, as well as the assigned customers and their details. 
- Similar to task management, Paralegal can view their own assignments, pending tasks and complete the tasks assigned to them by Admin. 
- Partner can also assign tasks to Paralegal just like admin, but it should be noted that Paralegal cannot assign tasks to admin (no upward assignment).

#### Use Case Description
<table border="1" style="text-align: center">
  <tr>
    <td><b>Use Case ID</td>
    <td><b>Use Case Name</td>
    <td><b>Description</td>
  </tr>
  <tr>
    <td>UC001</td>
    <td>Create Account and Log In</td>
    <td>User can create a private account through the system and login the system</td>
  </tr>
  <tr>
    <td>UC002</td>
    <td>Update Personal Information</td>
    <td>Users can upload personal information to update account information</td>
  </tr>
  <tr>
    <td>UC003</td>
    <td>Access Document Management</td>
    <td>Users can upload and view files in the file management system</td>
  </tr>
  <tr>
    <td>UC004</td>
    <td>Assign Paralegal</td>
    <td>Admin can access appointment management and assign specified clients to Paralegal</td>
  </tr>
  <tr>
    <td>UC005</td>
    <td>View Appointment Details</td>
    <td>Paralegal can view the details of the meeting with the customer, as well as the time of the meeting, etc.</td>
  </tr>
  <tr>
    <td>UC006</td>
    <td>View Client Own Meetings</td>
    <td>The client can also view its own meeting time, information, etc.</td>
  </tr>
  <tr>
    <td>UC007</td>
    <td>Issue Tasks</td>
    <td>Admin can issue specified tasks and TODOs to employees.</td>
  </tr>
  <tr>
    <td>UC008</td>
    <td>View My Tasks</td>
    <td>Paralegal can view the task content, deadline, etc.</td>
  </tr>
  <tr>
    <td>UC009</td>
    <td>View All Tasks</td>
    <td>For Admin, they can check the completion status of tasks at any time.</td>
  </tr>
</table>
<p style="text-align: center; font-style: italic;">Table 1: Use Case Description</p>

### Entity Relationship Diagram
<p align="center">
<img src="readme-assets/03 Entity Relationship Diagram.png" alt="entity relationship diagram"/>
<br>
<i>Figure 3: Entity relationship diagram for CaseAce</i>
</p>

The above diagram depicts the relationships between the entities involved in our web application. 
We have seven entities, namely User, Documents, Cases, Tasks, Notifications, Messages, and Appointments. 

### Sequence Diagram
1. **Case Management Module**
    <p align="center">
    <img src="readme-assets/04 Sequence Diagram for “Create Case”.png" alt="sequence diagram for “create case”"/>
    <br>
    <i>Figure 4: Sequence diagram for “Create Case”</i>
    </p>
    In Figure 4 above, the sequence diagram illustrates the process of a lawyer (partners) creating a new case. When the user clicks on “Create Case” button, he will be directed to the “Create Case” page where he needs to fill up all the required case details and also assign lawyer(s) and paralegal(s) to handle the case. When the user clicks on the “submit” button, the data will be requested to be written to the database. If the request is successful, then the successful status is returned and the successful message is displayed to the user so that they can know that the case has been successfully created.<br><br>

2. **Customer Relation Management Module**
    <p align="center">
    <img src="readme-assets/05 Sequence Diagram for “View Lawyer Details”.png" alt="sequence diagram for “view lawyer details”"/>
    <br>
    <i>Figure 5: Sequence diagram for “View Lawyer Details”</i>
    </p>
    In Figure 5 above, the sequence diagram illustrates the process of a client viewing lawyer’s details. Users initiate this by requesting lawyer details, leading to the Website to retrieve the request to the law firm system. The law firm system will validate the request. If the request is accepted, it will retrieve the lawyer's details from the database and display them to the client.<br><br>

3.  **Appointment Management Module**
    <p align="center">
    <img src="readme-assets/06 Sequence Diagram for “Create Appointment”.png" alt="sequence diagram for “create appointment”"/>
    <br>
    <i>Figure 6: Sequence diagram for “Create Appointment”</i>
    </p>
    In Figure 6 above, the sequence diagram illustrates the process of creating an appointment. Users initiate this by clicking the "New Appointment" button, leading to the display of an appointment form. Required information, such as invited persons, title, venue, date and time, and description, must be filled in. Subsequently, clicking the "Create" button triggers the system to send reminders or alerts to the invited persons, prompting them to check and respond to the appointment (accept or decline).<br><br>

4.  **Task Management Module**
    <p align="center">
    <img src="readme-assets/07 Sequence Diagram for “Assign and View Tasks”.png" alt="sequence diagram for “assign and view tasks”"/>
    <br>
    <i>Figure 7: Sequence diagram for “Assign and View Tasks”</i>
    </p>
    In Figure 7 above, the sequence diagram illustrates the process of assigning, editing and deleting a task. The admin adds a task by clicking the "add edit or delete" button after selecting desired case, and then assigns it to the corresponding paralegals. Then the paralegals can see the tasks assigned by the admin.<br><br>

5.  **Document Management Module**
    <p align="center">
    <img src="readme-assets/08 Sequence Diagram for “Request and Upload Documents”.png" alt="sequence diagram for “request and upload documents”"/>
    <br>
    <i>Figure 8: Sequence diagram for “Request and Upload Documents”</i>
    </p>
    Figure 8 above show the sequence diagram for CaseAce. When a paralegal wants to request documents from client. He will open “Active Cases” to select desired case. Then, the system will return the case information stored in database. Then, paralegal can click “Request Document(s)” and enter the document details that requested and send the request to client side. When client received notification on request document, he will upload the requested document and the document will be stored on the database. When operation success, paralegal side will receive a notification on document uploaded successfully.

## Architecture of Web Application
### System Architecture Design
#### System Design
##### User Interface (UI) Design
1.  **Name**
    <p align="center">
    <img src="readme-assets/09 Name of the System.png" alt="name of the system"/>
    <br>
    <i>Figure 9: Name of the system</i>
    </p>
    This system is called CaseAce (Figure 9). This name was chosen for many reasons. The term  "Case"  indicates legal issues and fits the system's focus on legal firm case management. It conveys the system's main goal. However, "Ace" often connotes quality and skill. Apart from that, "Ace" means high competence and ability. <br><br>
    When combined with "Case," it implies competent and authoritative legal management. Due to two short, distinct words, the name is easy to pronounce and remember. A catchy name can boost system brand recognition.  The platform successfully manages cases and prioritises efficiency and effectiveness. <br><br>

2.  **Logo**
    <p align="center">
    <img src="readme-assets/10 “CaseAce” Logo.png" alt="“caseace” logo"/>
    <br>
    <i>Figure 10: “CaseAce” logo</i>
    </p>
    Figure 10 shows the CaseAce logo. The “CaseAce” logo has scales, a letter ‘C' on the left, and a ‘A' on the right. Our logo's main colour is Navy-Blue (#1c277e).<br><br>
    The scales symbolise the law's fairness and balance. A timeless symbol of justice, fairness, and impartial evidence. It shows that every case is carefully considered and justice is balanced.<br><br>
    The letter 'C' blends into the scales to the left. Our focus is case management, hence the 'C' in "Case, from CaseAce". This visual anchor connects our brand to our core function.<br><br>
    A represents "Ace, from CaseAce" on the right side of the scales. This letter represents our dedication to providing top-notch legal solutions.<br><br>

3.  **Colours**
    <p align="center">
    <img src="readme-assets/11 The color palette following 60 30 10 rule.png" alt="the color palette following 60/30/10 rule"/>
    <br>
    <i>Figure 11: The color palette following 60/30/10 rule</i>
    </p>
    Figure 11 shows the system design color palette. Colors are mostly blue to show law firm professionalism. The 60/30/10 rule is strictly followed when designing “CaseAce” interface. This design rule is popular in user interface design. This rule can help balance and standardize UI visual hierarchy. It suggests distributing the color scheme 60/30/10. <br><br>
    Black/white is the main color for 60% of user interfaces. The primary background color provides a clean, neutral canvas for the system. The system background and text are white and black to provide high contrast and easy reading. <br><br>
    Navy-Blue (#1c277e) is used in 30% of user interface design. This color is used on buttons, navigation bars, and UI accents. This color contrasts well with white background. <br><br>
    Light Blue (#3480df) is used for the final 10% of user interface design. For accents or interactive elements like links. <br><br>

4. **Typography**<br><br>
    User interface designs use serif and sans-serif. The logo's serif font conveys elegance and tradition. Because serif fonts have decorative strokes at character ends, they convey formality and professionalism. This choice fits legal tradition and authority. <br><br>
    Designs use sans-serif Montserrat and Lato for headers and body text. <br><br>

    <p align="center">
    <img src="readme-assets/12 The Header Text.png" alt="the header text"/>
    <br>
    <i>Figure 12: The header text</i>
    </p>

    The header text is Montserrat, a clean, modern sans-serif font that works well for titles and headers. Its geometric shapes contrast with the logo's serif font and look modern and sophisticated. Montserrat is versatile and readable making it ideal for prominent text. <br><br>
    Lato, another sans-serif, is used for body text. For clear, approachable information, its simplicity and readability make it ideal.  Modern design favors sans-serif,  which improves paragraph and longer text legibility.

##### Layout and Iconography
1.  **Layout**
    <p align="center">
    <img src="readme-assets/13 The grid layout system of 12 columns.png" alt="the grid layout system of 12 columns"/>
    <br>
    <i>Figure 13: The grid layout system of 12 columns</i>
    </p>
    Figure 13 shows the 12-column grid. This project used grid layout to make our design cleaner and more organized. Divisions and widths are divided into 12 columns with a 10px margin. The smaller divisions can use the 12 columns in any width combination. 12 columns are chosen to give subdivisions more options. They can use 1/12, 2/12, 3/12, 4/12, 6/12, and 12/12 columns. This grid system uses percentage division width. It offers responsive system design.

2.  **Icons**
    <p align="center">
    <img src="readme-assets/14 The iOS16 Glyph icons.png" alt="the iOS16 glyth icons"/>
    <br>
    <i>Figure 14: The iOS16 glyth icons</i>
    </p>
    Icons8.com iOS16 Glyth icons are shown in Figure 14. The system uses these icons for consistency, readability, and simplicity. These icons are chosen for their simple but elegant design which conveys formality and professionalism.

#### System Module Overview
The system, CaseAce contained 5 separated modules to make the management tasks in client law firm much more efficient and effective. Each group member will develop these modules. Each module serves different use cases and has different features for partners and associates (admins), paralegals (law firm staff), and clients.  <br><br>
The System Module Diagram and PIC for each CaseAce module are shown in Figure 15 below.

<p align="center">
<img src="readme-assets/15 System Module Diagram.png" alt="system module diagram"/>
<br>
<i>Figure 15: System module diagram</i>
</p>

1.  **Client Relation Management (CRM) Module:**<br>
This module helps admins and law firms manage client relationships. Details in this module included:
    - **Manage clients’ information:** This system stores client contacts information and cases in a structured database. Law firm admins can easily view and update details in the dashboard.
    - **Check Client Interactions and Cases History:** This system stores clients' interactions, active status, and case history in a timeline so admin can easily review case status and progress.
    - **View Clients’ Satisfaction and Rating:** This system will ask clients to rate law firm services. Ratings are displayed on the admin dashboard.
2.  **Case Management Module:**<br>
This module mainly is for partners (admins) to assign suitable lawyer(s) and paralegals(s) to effectively handle certain client’s cases. The detailed features in this module are:
    - **Create Cases, Edit Cases Details:** Partners in law firm can create cases for each client case, and they are able to assign manpower to handle the case. Associates and partners both will be able to edit the case details.
    - **View Cases Details:** All users in the system can view the case details in their respective sites.
3.  **Document Management Module:**<br>
This module mainly is for system users to handle the documents uploaded or requested in each of their cases. The detailed features in this module are:
    - **Upload, Store and Request Documents:** System users can upload the documents into the system in respect of each case. The documents will be stored securely in the cloud storage online. Other than that, law firm can also request documents from their clients if they needed.
    - **View and Download Documents:** System users can view and download the desired documents in their case.
    - **Integration with Case Management:**  Ensures the seamless and streamlined workflow between document and case management.
4.   **Task Management Module:**<br>
This module mainly is for admins and paralegals to effectively manage the task distribution 
processes. The detailed features in this module are:
        - **Create, Assign, and Prioritize Task:** Admins can create the tasks, assign it to suitable staffs, and the staffs who received the task can prioritize the tasks.
        - **Deadline Tracking and Reminders:** System will send reminders and help staff to track their task if their tasks are close to deadlines or overdue.
        - **Monitor Progress:** System users can monitor the progress of completed and incomplete tasks in their respective dashboards.
5.   **Appointment Management Module:**<br>
This module is for users to schedule and manage appointments. The detailed features in this module are:
        - **Appointment Scheduling:** Users can schedule, reschedule, and cancel appointments.
        - **Appointment Accept/Decline:** Users can accept or decline appointment invitations.
        - **Calendar Integration:** The system integrates with the calendar to provide an overview of appointments.
        - **Automated Reminders:** The module sends reminders for new appointments, cancellations, and user responses, reducing the likelihood of oversights.

### Architecture Diagram
<p align="center">
<img src="readme-assets/16 Web Application Architecture Diagram.png" alt="web application architecture diagram"/>
<br>
<i>Figure 16: Web application architecture diagram</i>
</p>

Figure 16 shows the web application architecture design for “CaseAce”. The client will connect to the Internet and access the application layer via their browsers.  
This three-layer CaseAce architecture—Presentation, Application, and Data—improves scalability, maintainability, and separation of responsibilities. They include: 
1. **Scalability and Modularity:**
- **Presentation Layer (Client):** Splitting client-side logic (HTML, CSS, JavaScript) onto the presentation layer creates a modular, scalable structure. Independent development and upgrades are possible because backend and user interface changes don't affect one other. 
- **Application Layer (Web and Application Server):** Business logic, request processing, and communication between the frontend and backend are handled by the application layer. This separation lets several application servers manage rising loads for scalability. 
- **Data Layer (Database Server):** Data is stored and retrieved by the data layer. Separating it from the application layer allows database performance scalability and optimization without application logic.
2. **Maintainability and Ease of Development:**
- **Presentation Layer:** Frontend developers can focus on user interface design, user experience, and client-side interactions without worrying about the backend or database. Having separate concerns simplifies development and maintenance. 
- **Application Layer:** The application layer contains business logic and application-specific functions. This separation lets developers concentrate on the app's features and functions without the frontend or database, simplifying code maintenance. 
- **Data Layer:** Database operations and optimizations are in the data layer. Database schema and storage changes do not affect application logic, making the system more maintainable.
3. **Flexibility and Technology Independence:**
- **Presentation Layer:** A separate presentation layer lets we choose frontend technologies. We can switch frameworks or libraries without affecting the backend or database. 
- **Application Layer:** Application layer abstracts frontend and backend. Different programming languages or frameworks can be used for backend technologies without affecting the frontend due to this abstraction. 
- **Data Layer:** Database technologies are easier to use when the data layer is separated. We can choose a database solution that meets CaseAce's data needs without affecting the application or display layers.
4. **Security:**
- **Layered Security:** Each layer can be secured. Presentation layer handles user authentication and authorization, application layer implements business logic security, and data layer manages database access and permissions. This layered method boosts system security.

## Interchange Format
Data interchange formats play a crucial role in standardizing the structure and exchange of data across diverse systems and platforms (Data Interchange Format, n.d.). They are vital for ensuring smooth data communication between the front-end and back-end of web applications. Several interchange formats are available for website applications, such as JSON (JavaScript Object Notation), XML (eXtensible Markup Language), and CSV (Comma-Separated Values). After careful consideration, **our group has chosen JSON** as the preferred interchange format for communication between the frontend and backend. <br><br>
Chosen for its simplicity, readability, and broad support across programming languages, JSON serves as a lightweight and widely adopted format for data interchange in web services and APIs (Aster.Cloud, 2023). Its key-value pair structure aligns seamlessly with the project's requirement for straightforward data exchange. Examples of JSON payloads in the communication between front-end and back-end encompass user data, API responses, and configuration settings. JSON ensures efficient data transfer, making it an integral part of the communication process.<br><br>
JSON provides advantages in terms of compactness, fostering faster data processing and enhanced efficiency. Its readability and native data type support contribute to streamlined code maintenance, while compatibility with web technologies simplifies application and API development. Despite these strengths, JSON has limitations compared to XML, as it is less expressive and flexible. It lacks metadata support, a standard schema definition language, and has limited binary data support. Additionally, concerns about security vulnerabilities relative to XML may emerge, emphasizing the need for careful handling in data processing scenarios (Kumar, 2024).<br><br>
As a result, JSON emerges as the ideal interchange format for our web development project, aligning with simplicity, readability, and widespread support. Its integration ensures efficient data exchange between the front-end and back-end components of the application.

## Backend
<p align="center">
<img src="readme-assets/17 Restful API Design.png" alt="restful api design"/>
<br>
<i>Figure 17: Restful API design</i>
</p>

In this project, we adopted the design philosophy of Restful API to provide a simple, consistent and scalable way to access our resources. RESTful API makes the use of API intuitive and easy to understand by using HTTP methods (such as `GET`, `POST`, `PUT`, `DELETE`, etc.) to operate resources. For example, we might have an API endpoint /user, and through a GET request, we can get information about all users, and through a POST request, we can create a new user. <br><br>
Next, we chose to use Node.js as the back-end development language, mainly because of its event-driven and non-blocking I/O model, which makes Node.js very suitable for handling concurrent requests, which is very suitable for applications like ours that need to handle a large number of real-time interactions. Very important. In addition, Node.js uses JavaScript, which means that our front-end and back-end can be developed using the same language, greatly improving development efficiency. <br><br>
Based on Node.js, we chose Express.js as our web development framework. Express.js is a lightweight framework that provides an easy way to create web servers. Its middleware architecture allows us to easily add new functionality. For example, we might have one middleware that handles user authentication, another middleware that handles errors, etc. In this project, we may have a route to /task. Through Express.js, we can easily define how to respond to `GET` requests (get all tasks) or `POST` requests (create new tasks) to this route.

<p align="center">
<img src="readme-assets/18 Instances of Corresponding Requests for Routes.png" alt="instances of corresponding requests for routes"/>
<br>
<i>Figure 18: Instances of corresponding requests for routes</i>
</p>
As Figure 18 shown, by using RESTful API, Node.js, and Express.js, we were able to create an efficient, scalable, and easy-to-maintain backend system to support our frontend application.

## Database Design
<p align="center">
<img src="readme-assets/19 MongoDB Database Setup.png" alt="MongoDB database setup"/>
<br>
<i>Figure 19: MongoDB database setup</i>
</p>

- MongoDB is a non-relational database known for its flexible data model and horizontal scalability. In this project, we use MongoDB to store and manage data to support our front-end and back-end functionality.
- MongoDB's design philosophy emphasizes flexibility and scalability, making it ideal for handling rapidly changing and growing data. It supports horizontal expansion and can easily handle large-scale data storage and high concurrent access through sharding technology. This database system is known for its high performance and low maintenance costs, using technologies such as indexes and memory-mapped files to speed up queries and improve read and write efficiency. MongoDB also excels at handling large data volumes and is suitable for a variety of application scenarios, including content management, real-time analytics, log storage, and back-end storage for mobile and social applications.

<p align="center">
<img src="readme-assets/20 CaseAce Database Design.png" alt="CaseAce database design"/>
<br>
<i>Figure 20: CaseAce Database Design</i>
</p>

- There are seven collections in our MongoDB database: **appointments**, **cases**, **documents**, **messages**, **notifications**, **tasks**, and **users**. Each collection stores data associated with its name.
- The **appointments** collection stores all appointment information, including appointment time, location, participants, etc. The **cases** collection stores all case information, including detailed descriptions of the cases, related documents, participating users, etc. The **documents** collection stores all document information, including document content, creation time, creator, etc. The **messages** collection stores all message information, including message content, sender, receiver, sending time, etc. The **notifications** collection stores all notification information, including notification content, sender, receiver, sending time, etc. The **tasks** collection stores all task information, including task description, deadline, person in charge, status, etc. The **users** collection stores all user information, including username, password, email, role, etc.
- Through these seven collections, we can implement various functions such as user management, task assignment, case tracking, document sharing, message notification, etc. These features all rely on MongoDB's high performance, high availability, and easy scalability.
- In addition, in the database design of this project, we used Postman, a powerful API testing tool. Postman allows us to build and test APIs by sending various HTTP requests like `GET`, `POST`, `PUT`, `DELETE`, etc. to test our RESTful API. This is very helpful for verifying that our API is working properly, and debugging any issues that may arise.

<p align="center">
<img src="readme-assets/21 Send HTTP Request Through Postman.png" alt="Send HTTP request through Postman"/>
<br>
<i>Figure 21: Send HTTP request through Postman</i>
</p>

For example, we can use Postman to send a GET request to the /tasks endpoint to get a list of all tasks. We can also send a POST request to the /tasks endpoint to create a new task. Through Postman, we can easily view the responses of these requests, including status codes, response bodies, headers and other information.

## Security
1.  **Database Security:**
    - Enable MongoDB's authentication mechanism and use username and password for authentication.
    - Utilize role and permission settings to limit user access to ensure potential threats are minimized.
    - Enable TLS/SSL encryption between the MongoDB server and client to protect the confidentiality of data during transmission and prevent man-in-the-middle attacks.
    - Deploy network security measures, restrict access to IP addresses, and modify default configurations to reduce the risk of automated attacks, including:
        - Regularly update MongoDB and apply security patches to fix potential vulnerabilities.
        - Implement audits to record all database access and operations to detect abnormal activities in a timely manner.
        - Deploy a monitoring system to monitor database performance and security status in real time to ensure timely response to potential threats.

2.  **HTTPS (Secure Socket Layer):** <br>
Our website is exclusively served over HTTPS rather than HTTP. This ensures the encryption of data in transit between the client and server, mitigating the risk of man-in-the-middle attacks. By adopting HTTPS, we prioritize the security and privacy of user data during transmission, fostering a safer browsing experience.

3.  **Secure Cookies Management:** <br>
    <p align="center">
    <img src="readme-assets/22 Create Cookie with Secure Flag and HttpOnly Flag.png" alt="Create cookie with Secure Flag and HttpOnly Flag"/>
    <br>
    <i>Figure 22: Create cookie with Secure Flag and HttpOnly Flag</i>
    </p>

    -  **Secure Flag:** We employ the Secure flag for cookies, indicating that they should only be transmitted over secure, encrypted connections. This measure prevents the transmission of sensitive information via unsecured channels, reinforcing the protection of user data.
    -  **HttpOnly Flag:** Additionally, the HttpOnly flag is implemented for cookies storing Bearer tokens. This ensures that these cookies are inaccessible to JavaScript, especially in the frontend through the browser. By doing so, we reduce the risk of Cross-Site Scripting (XSS) attacks attempting to steal sensitive session information.

4.  **Password Hashing with Bcrypt:**
    <p align="center">
    <img src="readme-assets/23 Create Hashed Password.png" alt="Create Hashed Password"/>
    <br>
    <i>Figure 23: Create Hashed Password</i>
    </p>

    - **Hashing and Salting:** In our backend, user passwords are not stored directly in the database. Instead, we utilize the Bcrypt hashing algorithm to hash and salt passwords before storing them. This enhances security by introducing complexity to the hashed output, making it significantly more challenging for attackers to decipher original passwords, even in the event of a data breach.
    - **Adaptive Hashing:** Bcrypt employs adaptive hashing, incorporating computational intensity and slowness to resist brute-force attacks. Its adaptive nature allows us to adjust the computational cost as needed, ensuring the hashing process remains secure against evolving hardware capabilities. The use of Bcrypt aligns with best practices for password storage, reinforcing the overall security of user credentials.

5. **CORS Policy for Clients and Socket.io:**
    <p align="center">
    <img src="readme-assets/24 CORS Configuration for Cross-Origin Requests.png" alt="CORS Configuration for Cross-Origin Requests"/>
    <br>
    <i>Figure 24: CORS Configuration for Cross-Origin Requests</i>
    </p>

    - **Cross-Origin Resource Sharing (CORS):** To secure our backend services, we enforce a strict CORS policy, allowing only specific clients from predefined origins to communicate with our backend. By explicitly defining the permitted origins, we mitigate the risk of Cross-Site Request Forgery (CSRF) attacks and unauthorized cross-origin requests, enhancing the protection of our web application.
    - **Socket.io Security:** Our real-time chat feature, powered by Socket.io, adheres to the same CORS policy. This means that only authorized clients from specified origins can establish and maintain socket connections. This consistent CORS policy extension ensures a comprehensive security approach, safeguarding real-time communication channels from potential security vulnerabilities.

These security measures collectively establish a robust defense against common web vulnerabilities, protecting both user credentials and communication channels within our web application. 

## References
1. Adobe. (2022, November 14). *User flow diagram — what it is, why it’s important, and how to create one.* Retrieved from Adobe Experience Cloud: https://business.adobe.com/blog/basics/how-to-make-a-user-flow-diagram
2. Aster.Cloud. (2023, May 11). *The Top 10 Data Interchange Or Data Exchange Format Used Today.* Retrieved from Aster Cloud: https://aster.cloud/2023/05/11/the-top-10-data-interchange-or-data-exchange-format-used-today/
3. Black, N., & Aguilera, A. (n.d.). *Law Practice Management Software: Ultimate Guide.* Retrieved from mycase: https://www.mycase.com/blog/legal-case-management/law-practice-management-ultimate-guide/
4. *Data Interchange Format.* (n.d.). Retrieved from ReinTech: https://reintech.io/terms/category/data-interchange-format
5. Issacharoff, D. (2022, January 23). *20 Principles of Website Design Every Web Professional Should Know.* Retrieved from Elementor: https://elementor.com/blog/principles-of-website-design/
6. Kumar, A. (2024, January 13). *What are the advantages and disadvantages of using JSON vs XML?* Retrieved from LinkedIn: https://www.linkedin.com/advice/0/what-advantages-disadvantages-using-json-vs-xml
7. Shanaka, A. (2022, May 1). *What is System Modeling and UML?* Retrieved from Medium: https://medium.com/weekly-webtips/what-is-system-modeling-and-uml-441ac1d1f1ee
8. *Task management: what it is and how to master it.* (2021, December 13). Retrieved from For the Record: https://blog.airtable.com/what-is-task-management/

## Appendices
<p align="center">
<img src="readme-assets/25 Small portion of CaseAce prototype.png" alt="small portion of CaseAce prototype"/>
<br>
<i>Figure 25: Small portion of CaseAce prototype</i>
</p>

<p align="center">
<img src="readme-assets/26 iOS16 Glyph icons used in CaseAce, from Icons8.com.png" alt="iOS16 Glyph icons used in CaseAce, from Icons8.com"/>
<br>
<i>Figure 26: iOS16 Glyph icons used in CaseAce, from Icons8.com</i>
</p>