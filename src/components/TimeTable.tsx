"use client";

import { useEffect, useState } from "react";
import data2 from "../../data/kyouto-touhukuji.json";
import data3 from "../../data/ibaraki-kyoto.json";
import data4 from "../../data/touhukuji-chushojima.json";

type TrainData = {
  arrival: string;
  attention?: string;
  waiting?: string;
  "keihan dep"?: string;
};

export default function TimeTable() {
  const [currentTime, setCurrentTime] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const time =
        String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

      setCurrentTime(time);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // 時刻に分を加算
  const addMinutes = (time: string, minutesToAdd: number) => {
    if (!time) return "";

    const [hours = 0, minutes = 0] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + minutesToAdd);

    return (
      String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0")
    );
  };

  // 遅延後の検索時刻
  const delayedTime = addMinutes(currentTime, delayMinutes);

  // 次の列車を探す
  const findNextTrain = (data: Record<string, any>, time: string) => {
    const times = Object.keys(data).sort();
    return times.find((trainTime) => trainTime >= time);
  };

  const toMinutes = (time: string) => {
    const [h = 0, m = 0] = time.split(":").map(Number);

    let minutes = h * 60 + m;

    if (h < 3) {
      minutes += 24 * 60;
    }

    return minutes;
  };

  const findNextRoute = (time: string) => {
    const jrTimes = Object.keys(data3).sort((a, b) => toMinutes(a) - toMinutes(b));

    const ibarakiDep = jrTimes.find((t) => toMinutes(t) >= toMinutes(time));

    if (!ibarakiDep) return null;

    const kyotoArrival = data3[ibarakiDep as keyof typeof data3].arrival;

    // 京都駅で7分以上
    const kyotoTrain = Object.entries(data2)
      .sort(([a], [b]) => toMinutes(a) - toMinutes(b))
      .find(([dep]) => toMinutes(dep) >= toMinutes(kyotoArrival) + 7);

    if (!kyotoTrain) return null;

    const [, kyotoData] = kyotoTrain as [string, TrainData];

    const tofukujiArrival = kyotoData.arrival;

    // 東福寺で4分以上
    const keihanTrain = Object.entries(data4)
      .sort(([a], [b]) => toMinutes(a) - toMinutes(b))
      .find(([dep]) => toMinutes(dep) >= toMinutes(tofukujiArrival) + 4);

    if (!keihanTrain) return null;

    const [, keihanData] = keihanTrain as [string, TrainData];

    return {
      departure: ibarakiDep,
      arrival: keihanData.arrival,
    };
  };

  const route = findNextRoute(delayedTime);

  const nextTime2 = findNextTrain(data2, delayedTime);
  const nextTime3 = findNextTrain(data3, delayedTime);
  const nextTime4 = findNextTrain(data4, delayedTime);

  const train2 = nextTime2 ? data2[nextTime2 as keyof typeof data2] : null;

  const train3 = nextTime3 ? data3[nextTime3 as keyof typeof data3] : null;

  const train4 = nextTime4 ? data4[nextTime4 as keyof typeof data4] : null;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-5xl font-bold text-center mb-4">現在時刻: {currentTime}</h1>

      <div className="sticky top-0 z-50 w-full bg-gray-50 py-4">
        <div className="max-w-md mx-auto">
          <label className="block text-lg font-semibold mb-2">何分後に出発する？</label>

          <input
            type="range"
            min="0"
            max="60"
            value={delayMinutes}
            onChange={(e) => setDelayMinutes(Number(e.target.value))}
            className="w-full"
          />

          <p className="text-center text-xl mt-2">
            {delayMinutes}分後 →<span className="font-bold text-red-500 ml-2">{delayedTime}</span>
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl border-2 border-blue-500 rounded-xl p-6 shadow-lg bg-white mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">茨木 → 中書島</h2>

        {route ? (
          <table className="w-full border-collapse text-center">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">出発</td>
                <td className="p-3">{route.departure}</td>
              </tr>

              <tr>
                <td className="p-3 font-bold bg-gray-100">到着</td>
                <td className="p-3">{route.arrival}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-red-500">本日の列車は終了しました</p>
        )}
      </div>

      {/* 茨木 → 京都 */}
      <div className="w-full max-w-2xl border-2 border-orange-500 rounded-xl p-6 shadow-lg bg-white mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">茨木 → 京都</h2>

        {train3 ? (
          <table className="w-full border-collapse text-center">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">出発</td>
                <td className="p-3">{nextTime3}</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">到着</td>
                <td className="p-3">{train3.arrival}</td>
              </tr>

              <tr>
                <td className="p-3 font-bold bg-gray-100">注意</td>
                <td className="p-3">
                  {train3.attention === "none" ? "乗換なし" : train3.attention}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-red-500">本日の列車は終了しました</p>
        )}
      </div>

      {/* 京都 → 東福寺 */}
      <div className="w-full max-w-2xl border-2 border-green-500 rounded-xl p-6 shadow-lg bg-white mt-8">
        <h2 className="text-2xl font-bold text-center mb-4">京都 → 東福寺</h2>

        {train2 ? (
          <table className="w-full border-collapse text-center">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">出発</td>
                <td className="p-3">{nextTime2}</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">到着</td>
                <td className="p-3">{train2.arrival}</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">京阪出発</td>
                <td className="p-3">{train2["keihan dep"]}</td>
              </tr>

              <tr>
                <td className="p-3 font-bold bg-gray-100">待ち時間</td>
                <td className="p-3">{train2.waiting}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-red-500">本日の列車は終了しました</p>
        )}
      </div>
      <div className="w-full max-w-2xl border-2 border-red-500 rounded-xl p-6 shadow-lg bg-white mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">東福寺 → 中書島</h2>

        {train4 ? (
          <table className="w-full border-collapse text-center">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">出発</td>
                <td className="p-3">{nextTime4}</td>
              </tr>

              <tr className="border-b">
                <td className="p-3 font-bold bg-gray-100">到着</td>
                <td className="p-3">{train4.arrival}</td>
              </tr>

              <tr>
                <td className="p-3 font-bold bg-gray-100">注意</td>
                <td className="p-3">
                  {train4.attention === "none" ? "乗換なし" : train4.attention}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-red-500">本日の列車は終了しました</p>
        )}
      </div>
    </div>
  );
}
