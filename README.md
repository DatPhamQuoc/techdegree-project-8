# Techdegree-project-8: SQL-Library Manager
 A web application for listing, adding, updating, and deleting books in a library application, using `JavaScript`, `Node.js`, `Express`, `Pug`, and the `SQL ORM Sequelize`.

 Setup and Initialize Project

 * The .gitignore file is in place and the node_modules folder is not stored in the repo.
 * Running `npm install` adds all necessary dependencies.
 * Running `npm start` launches the app.

 Models

 Project includes the following Sequelize Model and properties:
 * Book a. title - string b. author - string c. genre - string d. year - integer
 * Uses the appropriate Model validation to ensure that the title and author properties will have values when the form is submitted.

 Routes

 Project contains at least the following routes:
 * `/ - get`
 * `/books - get`
 * `/books/new - get`
 * `/books/new - post`
 * `/books/:id - get`
 * `/books/:id - post`
 * `/books/:id/delete - post`

 Views

 Project contains at least the following views:
 * layout.pug
 * index.pug
 * new-book.pug
 * update-book.pug
 * error.pug
 * page-not-found.pug

 Form Fields

 * If title or author fields are empty, form will not submit and page shows friendly error message.
 * Forms employ Sequelize Model validation rather than HTML’s built in validation.
 * Clicking on an input’s label brings focus to corresponding input.

 Errors

 * If routing to a non-existent book id, project uses a global error handler to render a friendly error page.
 * If navigating to a non-existent route like /error, the project renders a user friendly "Page Not Found" page.
