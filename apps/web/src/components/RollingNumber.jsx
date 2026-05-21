import { useEffect, useState } from "react";

const RollingDigit = ({ digit }) => {
  return (
    <span className="inline-block h-8 overflow-hidden">
      <span
        className="inline-flex flex-col transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateY(-${digit * 10}%)`,
        }}
      >
        {[...Array(20).keys()].map((n) => (
          <span key={n} className="h-8 flex items-center justify-center block">
            {n % 10}
          </span>
        ))}
      </span>
    </span>
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