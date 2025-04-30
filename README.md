 <img src="../Library-Management/Frontend/public/book-favicon.svg" alt="BookNest" width="50" style="vertical-align: middle;"/> BookNest - Library Management System




## Table of Contents
1. [Live Demo](#live-demo)
2. [Introduction](#introduction)
3. [Features](#features)
4. [User Guide](#user-guide)image in readme.md

   - [Registration & Login](#registration--login)
   - [Browsing Books](#browsing-books)
   - [Borrowing Books](#borrowing-books)
   - [Returning Books](#returning-books)
   - [Viewing Borrow History](#viewing-borrow-history)
   - [Notifications](#notifications)
5. [Admin Guide](#admin-guide)
   - [Admin Credentials](#admin-credentials)
   - [Book Management](#book-management)
   - [User Management](#user-management)
   - [Borrow Management](#borrow-management)
   - [Reports & Analytics](#reports--analytics)
6. [Special Features](#special-features)
   - [Bill Generation](#bill-generation)
   - [PDF Download](#pdf-download)
7. [Technical Details](#technical-details)
8. [Responsive Design](#responsive-design)

## Live Demo
Experience BookNest live: [https://library-management-six-livid.vercel.app/](https://library-management-six-livid.vercel.app/)

## Introduction
BookNest is a comprehensive library management system designed to streamline the process of book borrowing and management for both users and administrators. This modern web application provides:

- An intuitive interface for users to browse and borrow books
- Powerful tools for administrators to manage library operations
- Real-time tracking of borrowed books and due dates
- Notifications and reminders
- Detailed reporting and analytics

Built with React, TypeScript, and Tailwind CSS, BookNest offers a seamless experience across all devices.

## Features
- **User Authentication**: Secure login and registration system
- **Book Catalog**: Browse available books with filters and search
- **Borrowing System**: Request and manage book borrow
- **Admin Dashboard**: Comprehensive management tools for administrators
- **Notification System**: Real-time alerts for due dates and system messages
- **Billing System**: Automatic bill generation with PDF download
- **Responsive Design**: Fully functional on mobile, tablet, and desktop

## User Guide

### Registration & Login
1. Click on "Register" to create a new account
2. Fill in your details (name, email, password)
3. Log in with your credentials to access the system

### Browsing Books
1. Navigate to the "Books" section
2. Browse through available books
3. Use filters to narrow down by genre, availability, or author
4. Search for specific titles using the search bar
5. Click on any book to view detailed information

### Borrowing Books
1. Find a book you want to borrow
2. Click "Borrow" button
3. Select the return date (default is 14 days from today)
4. Confirm your borrowing request
5. View your borrowed books in the "My Borrow" section

### Returning Books
1. Go to "My Borrow" section
2. Find the book you want to return
3. Click "Return" button
4. View the generated bill for your borrowing period after returning

### Viewing Borrow History
1. Navigate to "My Borrow" section
2. View all your past and current borrows
3. Filter by status (active, returned, overdue)
4. See detailed information about each transaction

### Notifications
1. Check the notification bell icon in the header
2. View all system messages and alerts
3. Mark notifications as read
4. Receive alerts for:
   - Approaching due dates
   - Overdue books
   - System announcements

## Admin Guide

### Admin Credentials
For demo purposes, use these admin credentials:
- **Email**: admin@gmail.com
- **Password**: Admin@123

### Book Management
1. **Add New Book**:
   - Navigate to "Books" in admin dashboard
   - Click "Add New Book"
   - Fill in book details and upload cover image
   - Submit to add to catalog

2. **Edit Existing Book**:
   - Find the book in the admin books list
   - Click "Edit" button
   - Modify any details
   - Save changes

3. **Remove Book**:
   - Find the book in the admin books list
   - Click "Delete" button
   - Confirm deletion

### User Management
1. **View All Users**:
   - Navigate to "Users" section
   - See complete list of registered users
   - Filter by status (active, blocked)

2. **Block/Unblock Users**:
   - Find user in the list
   - Click "Block" or "Unblock" as needed
   - Blocked users cannot borrow books

3. **View User Details**:
   - Click on any user to see:
     - Profile information
     - Current borrows
     - Borrow history
     - Notifications

### Borrow Management
1. **View All Borrows**:
   - Navigate to "Borrows" section
   - See complete list of all borrow transactions
   - Filter by status (active, returned, overdue)

2. **Manage Overdue Books**:
   - View "Overdue" tab
   - See all overdue borrows
   - Send reminders to users
   - Apply late fees if necessary

3. **Process Returns**:
   - View active borrows
   - Process returns on behalf of users
   - Generate bills manually if needed

### Reports & Analytics
1. **Dashboard Overview**:
   - View key metrics at a glance:
     - Total books
     - Active users
     - Overdue books
     - Recent activity


## Special Features

### Bill Generation
1. Automatic bill calculation when returning books
2. Includes:
   - Base charges (per day rate × duration)
   - Late fees (if applicable)
   - Total amount due
3. Clear breakdown of charges

### PDF Download
1. After bill generation, click "Download as PDF"
2. Get a professional PDF receipt with:
   - Book details
   - Borrow/return dates
   - Charge breakdown
   - Library contact information
3. Save for your records or print

## Technical Details
- **Frontend**:
  - React.js with TypeScript
  - Tailwind CSS for styling
  - React Router for navigation
  - Axios for API communication
  - Various libraries for PDF generation, charts, etc.

- **State Management**:
  - Context API for global state
  - Local storage for persistence

- **Performance**:
  - Lazy loading components
  - Optimized API calls
  - Efficient rendering

## Responsive Design
BookNest is fully responsive and works perfectly on:
- Mobile phones (all screen sizes)
- Tablets (portrait and landscape)
- Desktop computers
- All modern browsers

The interface automatically adapts to provide the best experience on any device, with:
- Responsive navigation menus
- Adaptive card layouts
- Touch-friendly controls
- Optimized form inputs
