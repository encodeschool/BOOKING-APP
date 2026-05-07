import { useEffect, useState } from "react";

const RollingDigit = ({ digit }) => {
  return (
    <div className="relative h-8 overflow-hidden">
      <div
        className="flex flex-col transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateY(-${digit * 10}%)`,
        }}
      >
        {[...Array(20).keys()].map((n) => (
          <span key={n} className="h-8 flex items-center justify-center">
            {n % 10}
          </span>
        ))}
      </div>
    </div>
  );
};

const RollingNumber = ({ value }) => {
  const digits = value.toString().split("");

  return (
    <div className="flex items-center text-2xl font-bold">
      {digits.map((d, i) =>
        d === "," ? (
          <span key={i}>,</span>
        ) : (
          <RollingDigit key={i} digit={Number(d)} />
        )
      )}
    </div>
  );
};

export default RollingNumber;