# Collaborative Whiteboard - Local Setup Guide

If another developer clones this repository (e.g., from the `main` branch), they need to perform several initialization steps that Git does not track (like installing uncommitted dependencies, building Prisma clients, and creating local environment variables). 

If they just run `npm run dev` immediately after cloning, the application will crash. Here is the exact guide they need to follow to get it running on their machine.

## 1. Install Dependencies

Since we have a split `frontend` and `backend` structure, they must install dependencies in *both* folders.
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

## 2. Set Up the Backend Environment (`.env`)

Git intentionally ignores the `.env` file for security reasons, so a fresh clone will not have one. They must create a `.env` file inside the `backend/` directory:

1. Create `backend/.env`
2. Add their own local MySQL database URL (or use a shared cloud database):
```env
DATABASE_URL="mysql://root:password123@localhost:3306/whiteBoard"
PORT=5001
```

## 3. Initialize Prisma (Database)

Because the Prisma schema requires a generated TypeScript client to run locally, the backend will crash with a missing module error if they don't run the `generate` command first.

```bash
cd backend

# Send the schema to their local MySQL database
npx prisma db push --accept-data-loss

# Generate the TypeScript client in node_modules
npx prisma generate
```

## 4. Fix the Backend Start Script (Optional but Recommended)

When you pulled the `main` branch, it reverted our `tsx` fix. The `backend/package.json` currently has a broken ESM script. They should update the `dev` script in `backend/package.json` from:
`"dev": "nodemon --watch src --exec ts-node src/index.ts"` 
**to:**
`"dev": "nodemon --watch src --exec tsx src/index.ts"` 
*(Make sure they run `npm install -D tsx` inside `backend/` as well).*

## 5. Start the Application

Once the dependencies are installed and the database is configured, they can start the app by running these commands in two separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The app will now open successfully at `http://localhost:5173`.
