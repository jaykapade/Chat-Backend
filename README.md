# Group Chat Backend

## Overview

This project is a simple Node.js application that provides web services for a group chat and data management. It includes features for managing users, authentication, group creation/deletion, and sending messages within a group.

### Features

- **Admin APIs:**
  - Only admin users can add new users.

- **Manage Users:**
  - Create new users.
  - Edit existing user details.

- **Authentication APIs:**
  - User authentication with login and logout functionalities.

- **Groups (Normal User):**
  - Create, delete, search, and add members to groups.
  - All users are visible to each other.

- **Group Messages (Normal User):**
  - Send messages within a group.
  - Like messages.

### Database

- The application uses a mongo Database

## Setup

### Prerequisites

- Node.js installed (Version 18+)
- Mongodb installed and configured or can use cluster url from Atlas

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Database:

   - [Add instructions to configure the chosen database]

4. Start the application:

   ```bash
   npm run dev
   ```

### Testing

- Execute end-to-end functional tests:

  ```bash
  npm run test
  ```
