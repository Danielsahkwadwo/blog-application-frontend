

# Photopia
================

A modern, cloud-based personal photo blog application built with React, TypeScript, and Tailwind CSS.

## Table of Contents
-----------------

* [Overview](#overview)
* [Features](#features)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Dependencies](#dependencies)
* [Contributing](#contributing)
* [API Documentation](#api-documentation)

## Overview
------------

Photopia is a personal photo blog application that allows users to upload, manage, and share their photos. The application is built using React, TypeScript, and Tailwind CSS, and is designed to be scalable, maintainable, and secure.

## Features
-----------

* **User Authentication**: Users can create an account and log in to access their photo blog.
* **Photo Upload**: Users can upload photos from their device or from a URL.
* **Photo Management**: Users can manage their photos, including editing captions, tags, and expiration dates.
* **Photo Sharing**: Users can share their photos with others via a unique URL.
* **Recycle Bin**: Users can recover deleted photos from the recycle bin.
* **Responsive Design**: The application is designed to be responsive and accessible on a variety of devices.
* **Type Safety**: The application uses TypeScript to ensure type safety and maintainability.

## Getting Started
---------------

### Prerequisites

* Node.js (version 14 or higher)
* npm (version 6 or higher)
* A code editor or IDE

### Installation

1. Clone the repository: `git clone https://github.com/your-username/photopia.git`
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm start` or `yarn start`
4. Open your browser and navigate to `http://localhost:5173/`

### Environment Variables

The application uses the following environment variables:

* `REACT_APP_API_URL`: The URL of the API server.
* `REACT_APP_AUTH_DOMAIN`: The domain of the authentication server.
* `REACT_APP_CLIENT_ID`: The client ID of the authentication server.

## Project Structure
------------------

* `src`: Source code for the application
	+ `components`: Reusable UI components
	+ `context`: Context API for state management
	+ `hooks`: Custom React hooks
	+ `pages`: Application pages
	+ `types`: TypeScript type definitions
* `public`: Static assets and index.html
* `styles`: Global CSS styles
* `tests`: Unit tests and integration tests
* `utils`: Utility functions

## Dependencies
------------

* `react`: ^18.3.1
* `react-dom`: ^18.3.1
* `react-router-dom`: ^6.22.3
* `react-dropzone`: ^14.2.3
* `react-hot-toast`: ^2.4.1
* `date-fns`: ^3.3.1
* `lucide-react`: ^0.344.0
* `tailwindcss`: ^3.4.1
* `typescript`: ^5.5.3
* `typescript-eslint`: ^8.3.0


### Code Style

The application uses the following code style:

* 2 spaces for indentation
* Single quotes for strings
* No semicolons

### Commit Messages

Commit messages should follow the following format:

* `feat: <description>` for new features
* `fix: <description>` for bug fixes
* `docs: <description>` for documentation changes
* `style: <description>` for code style changes
* `refactor: <description>` for code refactoring

