import React, { useEffect, useState } from "react";


export default function Home() {
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000);
    return () => {
      clearInterval(interval);
    }
  }, [])
  
  
  const updateTimer = () => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), 8, 1);
    const diff = targetDate - now;
    if (diff <= 0) {
      return;
    };
    const daysF = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursF = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesF = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsF = Math.floor((diff % (1000 * 60)) / 1000);
    setDays(daysF);
    setHours(hoursF);
    setMinutes(minutesF);
    setSeconds(secondsF);
  }

  return (
    <div className="page home">
      <h1 className="home_title">until the start of school</h1>
      <h1 className="home_time">{ days } days</h1>
      <h1 className="home_time">{ hours } hours</h1>
      <h1 className="home_time">{ minutes } minutes</h1>
      <h1 className="home_time">{ seconds } seconds</h1>
    </div>
  )
}
