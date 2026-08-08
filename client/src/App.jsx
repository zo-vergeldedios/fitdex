import { useState, useEffect } from "react";
import fitDexLogo from "./assets/fitDex-logo.png";
// import "./App.css";

function ShowErrorOrSuccessMessage({ message }) {
  return <span id="successAndErrorMessage">{message}</span>;
}

function EditWorkout({
  workout,
  workouts,
  setWorkouts,
  setSuccessAndErrorMessage,
  weekdayIndex,
}) {
  const [updatedWorkout, setUpdatedWorkout] = useState(workout.workout_name);
  const [updatedReps, setUpdatedReps] = useState(workout.reps);
  const [updatedSets, setUpdatedSets] = useState(workout.sets);
  const [updatedWeight, setUpdatedWeight] = useState(workout.weight);
  // {
  // useEffect(() => {
  // setNewWorkout(workout.workout_name);
  // setNewReps(workout.reps);
  // setNewSets(workout.sets);
  // setNewWeight(workout.weight);
  // }, [workouts]);
  // }
  return (
    <li>
      <input
        id="workout-name-input"
        type="text"
        onChange={(e) => setUpdatedWorkout(e.target.value)}
        className="li-info li-workout-name"
        value={updatedWorkout}
      />
      <input
        type="text"
        onChange={(e) => setUpdatedSets(e.target.value)}
        className="li-info"
        value={updatedSets}
      />
      <input
        type="text"
        onChange={(e) => setUpdatedReps(e.target.value)}
        className="li-info"
        value={updatedReps}
      />
      <input
        type="text"
        onChange={(e) => setUpdatedWeight(e.target.value)}
        className="li-info"
        value={updatedWeight}
      />
      <button
        className="saveAndDeleteButton"
        onClick={() => {
          setWorkouts(workouts.filter((wo) => wo.id !== workout.id));
          fetch(`${import.meta.env.VITE_API_URL}/delete`, {
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
              console.log({ success: "workout successfully deleted" });
              setSuccessAndErrorMessage("Workout deleted");
              return res.json;
              // TODO: success message
            })
            .catch(function (error) {
              console.log(error);
              setSuccessAndErrorMessage("Failed to delete the workout");
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
                wo.workout_name = updatedWorkout;
                wo.sets = updatedSets;
                wo.reps = updatedReps;
                wo.weight = updatedWeight;
                wo.editing = false;
                wo.weekday_index = weekdayIndex;
              }
              return wo;
            }),
          );
          fetch(`${import.meta.env.VITE_API_URL}/update`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: workout.id,
              workout_name: updatedWorkout,
              sets: updatedSets,
              reps: updatedReps,
              weight: updatedWeight,
              editing: false,
              weekday_index: weekdayIndex,
            }),
          })
            .then((res) => {
              setSuccessAndErrorMessage("Workout updated");
              console.log({ success: "workout updated" });
              return res.json;
            })
            .then((data) => {
              console.log(data);
            })
            .catch(function (error) {
              setSuccessAndErrorMessage("Failed to update the workout");
              console.log(error);
            });
        }}
      >
        ✅
      </button>
    </li>
  );
}

function ShowProgram({
  wo,
  workouts,
  setWorkouts,
  setSuccessAndErrorMessage,
  weekdayIndex,
}) {
  // const [workouts, setWorkouts] = useState([]);

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

          fetch(`${import.meta.env.VITE_API_URL}/update`, {
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
              setSuccessAndErrorMessage("Workout ready for edit");
              console.log({ success: "workout ready for edit" });
              return res.json;
            })
            .then((data) => {
              console.log(data);
            })
            .catch(function (error) {
              setSuccessAndErrorMessage("Workout NOT ready for edit");
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

function App() {
  // const [error, setError] = useState("");
  // const [userHasHoverButton, setUserHasHoverButton] = useState(false);

  // const [selectedDay, setSelectedDay] = useState(0);
  const [newWorkout, setNewWorkout] = useState("");
  const [newReps, setNewReps] = useState("");
  const [newSets, setNewSets] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [successAndErrorMessage, setSuccessAndErrorMessage] = useState("");

  const [userToken, setUserToken] = useState("");

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

  // const [hiddenButton, setHiddenButton] = useState(true);
  // const hiddenButton = workouts.filter((wo) => wo.editing == true).length === 0;
  // const hiddenButton = workouts.every((wo) => !wo.editing);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setSuccessAndErrorMessage("");
    }, 3000);
    return () => clearTimeout(timeoutID);
  }, [successAndErrorMessage]);
  // TODO - Get all of the components out of App().

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/list?token=${userToken}`)
      .then((res) => res.json())
      .then((res) => {
        setWorkouts(res);
        // setWorkouts(res.filter(wo => wo.user_token === our_user_token))
      });
  }, [userToken]);
  // TODO:
  // - add user_token column to workout table -
  // - add state for user_token in App
  //   - if empty, show input for user to add token
  // - server actions based on user token (fetch only from user_token, add user_token to new workouts, only allow update if user_token matches)

  // useEffect(()=>{
  //   async
  // },[])

  //     if(user_name){

  //     <div>
  //       <div/>

  // }

  const isButtonDisabled =
    typeof newSets !== "number" ||
    newSets == "" ||
    typeof newReps !== "number" ||
    newReps == "" ||
    typeof newWeight !== "number" ||
    newWeight == "" ||
    typeof newWorkout !== "string" ||
    newWorkout == "";

  // let inputError = "";
  // if (typeof newWorkout !== "string") {
  //   inputError = "check workout name";
  // } else if (typeof newSets !== "number") {
  //   inputError = "check sets";
  // } else if (typeof newReps !== "number") {
  //   inputError = "check reps";
  // } else if (typeof newWeight !== "number") {
  //   inputError = "check weight";
  // }

  // if(userToken)
  //   return main -> input that sets userToken

  return (
    <main>
      <img src={fitDexLogo} alt="fitDex" />

      <div>
        <p>token:</p>
        <input
          value={userToken}
          onChange={(e) => setUserToken(e.target.value)}
        />
      </div>

      <div>
        {workouts.length > 0 ? (
          <h3 className="workout-checker glow-text">LET'S GO!!!</h3>
        ) : (
          <h3 className="workout-checker">Input a workout</h3>
        )}
      </div>

      <div className="workout-day">
        <h2 id="day-of-week-h2">Day of Week:</h2>
        <span id="day-of-week">
          <h2>{weekdays[weekdayIndex]}</h2>
        </span>
      </div>
      <div id="workout-section">
        <div id="workout-heading">
          <span className="workout-title-heading">Workout</span>
          <span className="workout-title-heading">Sets</span>
          <span className="workout-title-heading">Reps</span>
          <span className="workout-title-heading">Weights</span>
          <button
            className="edit-all-button"
            onClick={() => {
              setWorkouts(
                workouts.map((wo) => {
                  if (weekdayIndex == wo.weekday_index) {
                    wo.editing = true;

                    fetch(`${import.meta.env.VITE_API_URL}/update`, {
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
                        setSuccessAndErrorMessage(
                          "Workouts NOT ready for edit",
                        );
                        console.log(error);
                      });
                  }
                  return wo;
                }),
              );
            }}
          >
            Edit All
          </button>
        </div>
        <ul id="workoutplan-container">
          {workouts
            .filter((wo) => wo.weekday_index === weekdayIndex && !wo.editing)
            .map((wo) => (
              <ShowProgram
                wo={wo}
                key={wo.id}
                workouts={workouts}
                setWorkouts={setWorkouts}
                setSuccessAndErrorMessage={setSuccessAndErrorMessage}
                weekdayIndex={weekdayIndex}
              />
            ))}
        </ul>
      </div>
      <div id="change-day-button-div">
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
      <h3 id="add-workout-title">Add Workout</h3>
      <div className="workout-container">
        <span>Workout Name:</span>
        <input
          value={newWorkout}
          id="workout-input"
          onChange={(e) => {
            setNewWorkout(e.target.value);
          }}
        />

        <span>Sets:</span>
        <input
          value={newSets}
          type="number"
          id="sets-input"
          onChange={(e) => {
            setNewSets(Number(e.target.value));
          }}
        />

        <span>Reps:</span>
        <input
          value={newReps}
          id="reps-input"
          type="number"
          onChange={(e) => {
            setNewReps(Number(e.target.value));
          }}
        />

        <span>Weight:</span>
        <input
          value={newWeight}
          id="weight-input"
          type="number"
          onChange={(e) => {
            setNewWeight(Number(e.target.value));
          }}
        />
      </div>
      <ShowErrorOrSuccessMessage message={successAndErrorMessage} />
      <button
        id="add-workout-button"
        className={isButtonDisabled ? "disabled" : ""}
        disabled={isButtonDisabled}
        // onMouseEnter={() => {
        //   setUserHasHoverButton(true);
        //   console.log("userHovered");
        // }}
        onClick={() => {
          if (isButtonDisabled) return;
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
          fetch(`${import.meta.env.VITE_API_URL}/add`, {
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
              console.log({ success: "workout-added" });
              setSuccessAndErrorMessage("Workout successfully added");
              return res.json;
            })
            .catch(function (error) {
              setSuccessAndErrorMessage("Failed to add the workout");
              console.log(`Failed to add workout: ${error}`);
              //TODO - show error to the user
              // setError();
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
              <EditWorkout
                workout={workout}
                key={workout.id}
                workouts={workouts}
                setWorkouts={setWorkouts}
                setSuccessAndErrorMessage={setSuccessAndErrorMessage}
                weekdayIndex={weekdayIndex}
              />
            ))}
        </ul>

        <button
          className="save-all-button"
          hidden={workouts.every((wo) => !wo.editing)}
          onClick={() => {
            setWorkouts(
              workouts.map((wo) => {
                if (wo.editing == true) {
                  wo.editing = false;
                  console.log(wo);

                  fetch(`${import.meta.env.VITE_API_URL}/update`, {
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
                      setSuccessAndErrorMessage("Workouts NOT ready for edit");
                      console.log(error);
                    });
                }
                return wo;
              }),
            );
          }}
        >
          Save All Workouts
        </button>
      </div>
    </main>
  );
}

export default App;
