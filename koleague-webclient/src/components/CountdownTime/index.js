import useCountDown from "@/hooks/useCountDown";

const addLeadingZero = (value) => {
  return value?.toString().padStart(2, '0');
};

export const CountdownTimer = ({ time }) => {
  const { hours, minutes, seconds } = useCountDown(time, false);
  //console.log(Boolean(addLeadingZero(hours)) , minutes, seconds, "haha");
  return (
    <div className="bg-[#09090B] px-[16px] py-[12px] flex gap-[16px] items-center">
      <div className="text-center">
        <div className="text-[20px] font-[600]">{addLeadingZero(hours) || 0}</div>
        <div className="text-[#71717A]">Hrs</div>
      </div>
      <div className="text-center">
        <div className="text-[20px] font-[600]">{addLeadingZero(minutes) || 0}</div>
        <div className="text-[#71717A]">Mins</div>
      </div>
      <div className="text-center">
        <div className="text-[20px] font-[600]">{addLeadingZero(seconds) || 0}</div>
        <div className="text-[#71717A]">Sec</div>
      </div>
    </div>
  );
};

export const Countdown = ({ targetDate }) => {
  const { days, hours, minutes, seconds } = useCountDown(targetDate, true);
  return (
    <span>
      {addLeadingZero(days) || 0}d {addLeadingZero(hours) || 0}h {addLeadingZero(minutes) || 0}m {addLeadingZero(seconds) || 0}s
    </span>
  );
};
