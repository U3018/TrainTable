"use client";

import { useEffect, useState } from "react";
import data1 from "../../data/ibaraki-chushojima.json";
import data2 from "../../data/kyouto-touhukuji.json";

export default function TimeTable() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const time =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

      setCurrentTime(time);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const findNextTrain = (
    data: Record<string, any>,
    currentTime: string
  ) => {
    const times = Object.keys(data).sort();
    return times.find((time) => time >= currentTime);
  };

  const nextTime1 = findNextTrain(data1, currentTime);
  const nextTime2 = findNextTrain(data2, currentTime);

  const train1 = nextTime1
    ? data1[nextTime1 as keyof typeof data1]
    : null;

  const train2 = nextTime2
    ? data2[nextTime2 as keyof typeof data2]
    : null;

  return (
    <div className="flex flex-col items-center min-h-screen p-6">

      <h1 className="text-5xl font-bold text-center mb-10">
        現在時刻: {currentTime}
      </h1>

      {/* 茨木 → 中書島 */}
      <div className="w-full max-w-2xl border-2 border-blue-500 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          茨木 → 中書島
        </h2>

        {train1 ? (
          <table className="w-full border-collapse text-center">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-bold">出発</td>
                <td className="p-3">{nextTime1}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-bold">到着</td>
                <td className="p-3">{train1.arrival}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">注意</td>
                <td className="p-3">{train1.attention}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center">
            本日の列車は終了しました
          </p>
        )}
      </div>

      {/* 京都 → 東福寺 */}
      <div className="w-full max-w-2xl border-2 border-green-500 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          京都 → 東福寺
        </h2>

        {train2 ? (
          <table className="w-full border-collapse text-center">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-bold">出発</td>
                <td className="p-3">{nextTime2}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-bold">到着</td>
                <td className="p-3">{train2.arrival}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-bold">京阪出発</td>
                <td className="p-3">{train2["keihan dep"]}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">待ち時間</td>
                <td className="p-3">{train2.waiting}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center">
            本日の列車は終了しました
          </p>
        )}
      </div>

    </div>
  );
}