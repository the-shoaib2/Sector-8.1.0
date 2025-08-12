import React from "react"

export default function AnimatedBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 w-full h-full overflow-hidden">
      {/* Animated colorful blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 opacity-40 blur-3xl animate-bgblob1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 opacity-30 blur-3xl animate-bgblob2" />
      <div className="absolute top-[30%] left-[60%] w-[40vw] h-[40vw] bg-gradient-to-tl from-green-300 via-blue-300 to-purple-300 opacity-30 blur-2xl animate-bgblob3" />
      <style jsx global>{`
        @keyframes bgblob1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes bgblob2 {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(40px) scale(1.08); }
        }
        @keyframes bgblob3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.12); }
        }
        .animate-bgblob1 { animation: bgblob1 12s ease-in-out infinite alternate; }
        .animate-bgblob2 { animation: bgblob2 14s ease-in-out infinite alternate; }
        .animate-bgblob3 { animation: bgblob3 16s ease-in-out infinite alternate; }
      `}</style>
    </div>
  )
} 