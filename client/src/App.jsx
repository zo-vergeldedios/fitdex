import { useState, useEffect } from "react";
import fitDexLogo from "./assets/fitDex-logo.png";
// import "./App.css";

// let count = ""
function App() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState("");
  const [newReps, setNewReps] = useState("");
  const [newSets, setNewSets] = useState("");
  const [newWeight, setNewWeight] = useState("");

  // const [selectedDay, setSelectedDay] = useState(0);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [weekdayIndex, setWeekdayIndex] = useState(new Date().getDay());

  function EditWorkout({ workout }) {
    const [newWorkout, setNewWorkout] = useState(workout.workout_name);
    const [newReps, setNewReps] = useState(workout.reps);
    const [newSets, setNewSets] = useState(workout.sets);
    const [newWeight, setNewWeight] = useState(workout.weight);
    return (
      <li>
        <input
          id="workout-name-input"
          type="text"
          onChange={(e) => setNewWorkout(e.target.value)}
          className="li-info li-workout-name"
          value={newWorkout}
        />
        <input
          type="text"
          onChange={(e) => setNewSets(e.target.value)}
          className="li-info"
          value={newSets}
        />
        <input
          type="text"
          onChange={(e) => setNewReps(e.target.value)}
          className="li-info"
          value={newReps}
        />
        <input
          type="text"
          onChange={(e) => setNewWeight(e.target.value)}
          className="li-info"
          value={newWeight}
        />
        <button
          className="saveAndDeleteButton"
          onClick={() => {
            setWorkouts(workouts.filter((wo) => wo.id !== workout.id));
            fetch("http://localhost:3000/delete", {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: workout.id,
              }),
            })
              .then((res) => {
                // res.send({ success: "ok" });
                return res.json;
                // TODO: success message
              })
              .catch(function (error) {
                console.log(error);
                // TODO: failure message
              });
          }}
        >
          ❌
        </button>
        <button
          className="saveAndDeleteButton"
          onClick={() => {
            setWorkouts(
              workouts.map((wo) => {
                if (workout.id == wo.id) {
                  wo.workout_name = newWorkout;
                  wo.sets = newSets;
                  wo.reps = newReps;
                  wo.weight = newWeight;
                  wo.editing = false;
                  wo.weekday_index = weekdayIndex;
                }
                return wo;
              }),
            );
            fetch("http://localhost:3000/update", {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: workout.id,
                workout_name: newWorkout,
                sets: newSets,
                reps: newReps,
                weight: newWeight,
                editing: false,
                weekday_index: weekdayIndex,
              }),
            })
              .then((res) => {
                return res.json;
              })
              .then((data) => {
                console.log(data);
              })
              .catch(function (error) {
                console.log(error);
              });
          }}
        >
          ✅
        </button>
      </li>
    );
  }
  function ShowProgram({ wo }) {
    return (
      <div className="workout-div">
        <span className="workout-title">{wo.workout_name}</span>
        <span className="workout-title">{wo.sets}</span>
        <span className="workout-title">{wo.reps}</span>
        <span className="workout-title">{wo.weight}</span>
        <button
          className="edit-button"
          onClick={() => {
            setWorkouts(
              workouts.map((wo2) => {
                if (wo2.id == wo.id) {
                  wo2.editing = true;
                }
                return wo2;
              }),
            );

            console.log(wo, "edit program");

            fetch("http://localhost:3000/update", {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: wo.id,
                workout_name: wo.workout_name,
                sets: wo.sets,
                reps: wo.reps,
                weight: wo.weight,
                editing: true,
                weekday_index: weekdayIndex,
              }),
            })
              .then((res) => {
                return res.json;
              })
              .then((data) => {
                console.log(data);
              })
              .catch(function (error) {
                console.log(error);
              });
          }}
        >
          Edit
        </button>
      </div>
      // console.log("check")
    );
  }

  useEffect(() => {
    fetch("http://localhost:3000/list")
      .then((res) => res.json())
      .then((res) => {
        setWorkouts(res);
      });
  }, []);

  return (
    <main>
      <img src={fitDexLogo} alt="fitDex" />

      <div>
        {workouts.length > 0 ? (
          <h3 className="workout-checker glow-text">LET'S GO!!!</h3>
        ) : (
          <h3 className="workout-checker">Input a workout</h3>
        )}
      </div>

      <div className="workout-day">
        <h2>Day of Week:</h2>
        <span id="day-of-week">
          <h2>{weekdays[weekdayIndex]}</h2>
        </span>
        <div>
          <button
            className="change-day-button"
            onClick={() => {
              if (weekdayIndex > 0) {
                setWeekdayIndex(weekdayIndex - 1);
              } else if (weekdayIndex == 0) {
                setWeekdayIndex(6);
              }
            }}
          >
            Previous Day
          </button>
          <button
            className="change-day-button"
            onClick={() => {
              setWeekdayIndex((weekdayIndex + 1) % 7);
            }}
          >
            Next Day
          </button>
        </div>
      </div>
      <div id="workout-section">
        <div id="workout-heading">
          <span className="workout-title-heading">Workout</span>
          <span className="workout-title-heading">Sets</span>
          <span className="workout-title-heading">Reps</span>
          <span className="workout-title-heading">Weights</span>
        </div>
        <ul id="workoutplan-container">
          {workouts
            .filter((wo) => wo.weekday_index === weekdayIndex && !wo.editing)
            .map((wo) => (
              <ShowProgram wo={wo} key={wo.id} />
            ))}
        </ul>
      </div>

      <h3 id="add-workout-title">Add Workout</h3>
      <div className="workout-container">
        <span>Workout Name:</span>
        <input
          value={newWorkout}
          id="workout-input"
          onChange={(e) => {
            // console.log({ e });
            setNewWorkout(e.target.value);
          }}
        />

        <span>Sets:</span>
        <input
          value={newSets}
          id="sets-input"
          onChange={(e) => {
            // console.log({ e });
            setNewSets(e.target.value);
          }}
        />

        <span>Reps:</span>
        <input
          value={newReps}
          id="reps-input"
          onChange={(e) => {
            // console.log({ e });
            setNewReps(e.target.value);
          }}
        />

        <span>Weight:</span>
        <input
          value={newWeight}
          id="weight-input"
          onChange={(e) => {
            // console.log({ e });
            setNewWeight(e.target.value);
          }}
        />
      </div>
      <button
        id="add-workout-button"
        onClick={() => {
          // workouts = [1, 2, 3]
          // newWorkout = 4
          let id = Math.floor(Math.random() * 1000000000);
          setWorkouts([
            ...workouts,
            {
              editing: false,
              id: id,
              reps: newReps,
              sets: newSets,
              weight: newWeight,
              workout_name: newWorkout,
              weekday_index: weekdayIndex,
            },
          ]);
          console.log(weekdayIndex);
          // workouts = [1, 2, 3]
          setNewWorkout(""); // !== -> newWorkout = ''
          setNewReps("");
          setNewWeight("");
          setNewSets("");
          // console.log([...workouts], "Workout array");
          fetch("http://localhost:3000/add", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              editing: false,
              id: id,
              reps: newReps,
              sets: newSets,
              weight: newWeight,
              workout_name: newWorkout,
              weekday_index: weekdayIndex,
            }),
          })
            .then((res) => {
              return res.json;
            })
            .catch(function (error) {
              console.log(error);
            });
        }}
      >
        Add Workout
      </button>

      <div id="edit-workout-container">
        <h3>Edit Workout</h3>
        <ul>
          {workouts
            .filter((wo) => wo.editing)
            .map((workout) => (
              <EditWorkout workout={workout} key={workout.id} />
            ))}
        </ul>
      </div>
    </main>
  );
}

export default App;

{
  /* <label htmlFor="select-button">Pick a day to save this workout</label>
        <select
          className="ml-2 mr-2 bg-zinc-800 text-white text-sm border border-zinc-600 rounded px-2 py-1 cursor-pointer hover:border-orange-500 focus:outline-none focus:border-orange-500"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          name="workout"
          id="select-button"
        >
          <option value="0">Monday</option>
          <option value="1">Tuesday</option>
          <option value="2">Wednesday</option>
          <option value="3">Thursday</option>
          <option value="4">Friday</option>
          <option value="5">Saturday</option>
          <option value="6">Sunday</option>
        </select>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1 rounded transition-colors duration-150"
          onClick={() => {
            workouts
              .filter((wo) => wo.weekday_index == 10)
              .map((workout) => {
                workout.weekday_index = selectedDay;

                fetch("http://localhost:3000/update", {
                  method: "POST",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: workout.id,
                    workout_name: workout.workout_name,
                    sets: workout.sets,
                    reps: workout.reps,
                    weight: workout.weight,
                    editing: false,
                    weekday_index: selectedDay,
                  }),
                })
                  .then((res) => {
                    return res.json;
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              });

            setWorkouts(
              workouts.map((workout) => {
                if (!workout.editing) {
                  return workout;
                }
                workout.weekday_index = selectedDay;
                workout.editing = false;
                console.log(workout, "workout");
                return workout;
              }),
            );
          }}
        >
          Save Workout Plan
        </button>
         */
}
// function updateWorkout(index) {
//   let [id, name, sets, reps, weight] = [...workouts];
//   let editing = false;
//   // const { id } = workouts[index];

//   workouts[index].editing = false;
//   workouts[index].weekdayIndex = weekdayIndex;

//Replicate the plain javascript to react
// console.log(selectedDay);
// console.log({ workouts, weekdayIndex });
{
  /* h('ul', { ... }, 
        workouts.map(workout => h('li', {}, [workout]))) */
}

// [object Object] -> {hello:'bye'}.toString()
{
  /* {workouts.map((workout) => (
    
          // <li key={workout.id}>
          //   {workout.workout_name},{workout.sets}, {workout.reps},{" "}
          //   {workout.weight}
          <li key={workout.id}>
            <input
              type="text"
              className="li-info li-workout-name"
              value={workout.workout_name}
            />
            <input type="text" className="li-info" value={workout.sets} />
            <input type="text" className="li-info" value={workout.reps} />
            <input type="text" className="li-info" value={workout.weight} />
            <button
              onClick={() => {
                // ['x', 'y', 'z']
                // workout = 'z'
                // workouts.filter((wo) => wo !== 'z') // ['x', 'y']
                setWorkouts(workouts.filter((wo) => wo.id !== workout.id));
                fetch("http://localhost:3000/delete", {
                  method: "POST",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: workout.id,
                  }),
                })
                  .then((res) => {
                    // res.send({ success: "ok" });
                    return res.json;
                    // TODO: success message
                  })
                  .catch(function (error) {
                    console.log(error);
                    // TODO: failure message
                  });
              }}
            >
              ❌
            </button>
            <button>✅</button>
          </li>
        ))} */
}
