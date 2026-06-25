const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv/config"); // import 'dotenv/config'
const postgres = require("postgres"); // import postgres from 'postgres'

app.use(cors({ origin: "*" }));
app.use(express.json());

const sql = postgres(process.env.PG_CONNECTION_STRING);

async function getWorkout() {
  const result = await sql`select * from fitness_app`;

  return result.map((wo) => ({
    id: Number(wo.id),
    workout_name: wo.workout_name,
    sets: Number(wo.sets),
    reps: Number(wo.reps),
    weight: Number(wo.weight),
    editing: wo.editing,
    weekday_index: Number(wo.weekday_index),
  }));
}

app.get("/list", async (req, res) => {
  res.send(await getWorkout());
});

async function insertWorkout(id, n, s, r, w, e, i) {
  await sql`insert into fitness_app (id, workout_name, sets, reps, weight, editing, weekday_index) values (${id}, ${n}, ${s}, ${r}, ${w}, ${e}, ${i})`;
}

app.post("/add", (req, res) => {
  insertWorkout(
    req.body.id,
    req.body.workout_name,
    req.body.sets,
    req.body.reps,
    req.body.weight,
    req.body.editing,
    req.body.weekday_index,
  );
  // console.log(workoutServer, "Server");
  res.send("Post Successfully Sent");
});

async function updateWorkout(
  id,
  name,
  sets,
  reps,
  weight,
  editing,
  weekday_index,
) {
  // throw new Error("hello");
  const res = await sql`
  update fitness_app 
  set id = ${id},
  workout_name = ${name},
  sets = ${sets},
  reps = ${reps},
  weight = ${weight},
  editing = ${editing}, 
  weekday_index = ${weekday_index} 
  where id = ${id}`;
  console.log(res);
}

app.post("/update", (req, res) => {
  // console.log(req.body);
  //TODO: Update by ID, update array and supabase.

  updateWorkout(
    req.body.id,
    req.body.workout_name,
    req.body.sets,
    req.body.reps,
    req.body.weight,
    req.body.editing,
    req.body.weekday_index,
  );
  console.log(req.body);
  res.send({ success: "ok" });
});

async function deleteWorkout(id) {
  await sql`delete from fitness_app where id = ${id}`;
}

app.post("/delete", (req, res) => {
  deleteWorkout(req.body.id);
  res.send({ success: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
