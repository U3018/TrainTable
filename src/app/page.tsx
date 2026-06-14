"use client";


import { useState } from "react";
import { useEffect } from "react";
import ReadJson from "../componets/TimeTable";
import TimeTable from "../componets/TimeTable";


export default function TrainPage() {
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime(); // 初回の時間更新
    const intervalId = setInterval(updateTime, 1000); // 1秒ごとに時間を更新

    return () => clearInterval(intervalId); // クリーンアップ
  }, []);

  return (
    <>
      <main className="min-h-screen flex justify-center bg-background text-foreground">
        <div className="w-full max-w-3xl px-6 py-14">
          <h1 className="text-3xl font-bold mb-4">Train Page</h1>

         
          <div className="text-center mt-4">
            <h1 className="text-2xl font-semibold mb-5">現在時刻: {currentTime}</h1>
          </div>
          <div className="text-xl font-bold mb-4">
          <h2>
            茨木→中書島（東福寺経由）
          </h2>
          <p>丹波橋での特急乗り換えはなし</p>
          <p>東福寺は京阪乗り換え効率優先表示・乗り換えはいけそうなもののみ</p>
          </div>

        
        
          <TimeTable currentDate={new Date()} />
        </div>
        
      </main>
    </>
  );
}
