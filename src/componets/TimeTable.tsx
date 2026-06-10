import React from "react";
import Code from "../../data/TimeTable.json";

export const ReadJson: React.FC = () => {
  const cdList: React.ReactNode[] = [];

  for (const cdNo in Code) {
    for (const cd in Code[cdNo as keyof typeof Code]) {
      cdList.push(
        <div key={`${cdNo}-${cd}`}>
          {`${cdNo}-${cd}-${
            Code[cdNo as keyof typeof Code][
              cd as keyof (typeof Code)[keyof typeof Code]
            ]
          }`}
        </div>
      );
    }
  }

  return <>{cdList}</>;
};

export default ReadJson;