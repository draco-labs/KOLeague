import { useEffect, useState } from 'react';

export default function useCountDown(time: Date, includeDays: boolean) {
  const calculateTimeLeft = () => {
    const difference = +new Date(time) - +new Date();
    let timeLeft : { days?: number; hours?: number; minutes?: number; seconds?: number } = {}; 
    
    if (difference > 0 ) (
      timeLeft = {
      days: includeDays ? Math.floor(difference / (1000 * 60 * 60 * 24)) : undefined,
      hours: includeDays
        ? Math.floor((difference / (1000 * 60 * 60)) % 24) 
        : Math.floor(difference / (1000 * 60 * 60)), 
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    )
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });


  return {
    days: timeLeft.days,
    hours: timeLeft.hours,
    minutes: timeLeft.minutes,
    seconds: timeLeft.seconds,
  };
}
