import React from "react";
import Code from "../../data/TimeTable.json";

type ReadJsonProps = {
  currentDate: Date;
};

export const ReadJson: React.FC<ReadJsonProps> = ({
  currentDate,
}) => {
  const hour = currentDate.getHours();

  let targetCd: keyof typeof Code;

  if (hour < 10) {
    targetCd = "CD001";
  } else if (hour < 16) {
    targetCd = "CD002";
  } else {
    targetCd = "CD003";
  }

  const train = Code[targetCd];

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">
        現在表示中: {targetCd}
      </h2>

      <div>列車名: {train.NAME}</div>

      <div>行先: {train.SUPP}</div>
    </div>
  );
};

export default ReadJson;