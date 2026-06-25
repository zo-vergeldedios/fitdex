## FitDex

A mobile-first workout tracker for planning, logging, and managing weekly training programs. Built as a full-stack application with a React frontend and Node.js/Express backend connected to a cloud PostgreSQL database.

## Features

View today's workout automatically using the current date
Plan workouts across a weekly split (Monday–Sunday)
Log and update exercises with sets, reps, and weight
Full CRUD functionality — create, read, update, and delete workouts
Persistent cloud storage via Supabase (PostgreSQL)
Animated UI with CSS keyframe glow effects
Responsive layout built with CSS Grid and Flexbox

## Tech Stack

### Frontend

React (Vite)
Plain CSS — Grid, Flexbox, keyframe animations
React Hooks — useState, useEffect
JavaScript Date API for dynamic day detection

### Backend

Node.js + Express
REST API architecture
Async/await error handling

### Database

Supabase (PostgreSQL)
Full CRUD via SQL queries through Supabase client

## Project Structure

workout-app/
├── client/ # React + Vite frontend
│ ├── public/
│ └── src/
│ ├── assets/ # Logo and images
│ ├── App.jsx
│ ├── App.css
│ ├── index.css
│ └── main.jsx
└── server/ # Node.js + Express backend
├── server.js
├── .env
└── package.json

## What I Built and Learned

This project is where I made the transition from vanilla JavaScript to React. Key concepts I applied hands-on:

React fundamentals — component structure, JSX, props, and controlled inputs
useState and useEffect — managing UI state and triggering data fetches on load
Date API — using new Date().getDay() to automatically surface today's workout
CSS fundamentals — building layout from scratch with Grid and Flexbox, no framework
Keyframe animations — implementing a CSS glow effect to reinforce UI feedback
Full-stack data flow — UI → Express API → Supabase → back to UI
REST API design — structuring routes and handling async server errors cleanly

## Local Setup

Prerequisites

Node.js installed
A Supabase project with a workouts table

1. Clone the repo

bashgit clone https://github.com/zo-vergeldedios/fitdex.git
cd workout-app

2. Set up the server

bashcd server
npm install

Create a .env file inside server/:

envPORT=3000
PG_CONNECTION_STRING="your_supabase_connection_string"

Start the server:

bashnode server.js

3. Set up the client

bashcd ../client
npm install
npm run dev

Open http://localhost:5173 in your browser.
