"use client";


import { useState } from "react";
import { useEffect } from "react";
import ReadJson from "../componets/TimeTable";


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

          <p className="mb-2">Welcome to the Train Page</p>
          <p className="mb-8">This is a simple train page component.</p>
          <div className="text-center mt-4">
            <h1 className="text-2xl font-semibold mb-5">現在時刻: {currentTime}</h1>
          </div>
        </div>
        <div className="w-full max-w-3xl px-6 py-14">
          <ReadJson />
        </div>
        
      </main>
    </>
  );
}
