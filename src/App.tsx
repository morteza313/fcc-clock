import { useEffect, useState } from 'react'
import AlarmSound from "./assets/AlarmSound.mp3";
import './App.css'
import { DisplayState } from './helper';
import TimeSetter from './TimeSetter';
import Display from './Display';

const defaultBreakeTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakeTime, setBreakeTime] = useState(defaultBreakeTime)
  const [sessionTime, setSessionTime] = useState(defaultSessionTime)
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  })

  useEffect(() => {
    let timerId: number;
    if (!displayState.timerRunning) return;
    if (displayState.timerRunning) {
      timerId = window.setInterval(decrementDisplay, 1000)
    }
    return () => {
      window.clearInterval(timerId)
    };
  }, [displayState.timerRunning]);


  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2;
      audio.play().catch((err) => console.log(err));
      setDisplayState((perv) => ({
        ...perv,
        timeType: perv.timeType === "Session" ? "Break" : "Session",
        time: perv.timeType === "Session" ? breakeTime : sessionTime
      }))
    }
  }, [displayState, breakeTime, sessionTime])

  const reset = () => {
    setBreakeTime(defaultBreakeTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      timerRunning: false,
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  }
  const startStop = () => {
    setDisplayState((perv) => ({
      ...perv,
      timerRunning: !perv.timerRunning
    }))
  }

  const changeBreakTime = (time: number) => {
    if (displayState.timerRunning) return;
    setBreakeTime(time)
  }

  const decrementDisplay = () => {
    setDisplayState((perv) => ({
      ...perv,
      time: perv.time - 1
    }));
  }

  const changeSessionTime = (time: number) => {
    if (displayState.timerRunning) return;
    setSessionTime(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false,
    }

    )
  }
  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Breake Length</h4>
          <TimeSetter
            time={breakeTime}
            setTime={changeBreakTime}
            min={min}
            max={max}
            interval={interval}
            type='break'
          />
        </div>
        <div className="session">
          <h4 id="session-label">Session Length</h4>
          <TimeSetter
            time={sessionTime}
            setTime={changeSessionTime}
            min={min}
            max={max}
            interval={interval}
            type='session'
          />
        </div>
      </div>
      <Display
        displayState={displayState}
        reset={reset}
        startStop={startStop}

      />
      <audio id="beep" src={AlarmSound}></audio>
    </div>
  )
}

export default App
