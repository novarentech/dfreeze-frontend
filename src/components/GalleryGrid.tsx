import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface GalleryGridProps {
  images: Array<{ src: string }>;
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate parallax offsets for 3 rows
  const x1 = useTransform(scrollYProgress, [0, 1], ["-15%", "5%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);

  // Split images into three rows of 5
  const row1 = images.slice(0, 5);
  const row2 = images.slice(5, 10);
  const row3 = images.slice(10, 15);

  return (
    <div ref={containerRef} className="py-20 flex flex-col gap-6 md:gap-8 overflow-hidden w-full relative">
      {/* Row 1 */}
      <motion.div 
        style={{ x: x1 }} 
        className="flex gap-4 md:gap-8 whitespace-nowrap min-w-max"
      >
        {row1.map((img, i) => (
          <div 
            key={`r1-${i}`} 
            className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] rounded-lg md:rounded-xl overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-105 duration-500"
          >
            <img 
              src={img.src} 
              alt="Gallery row 1" 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>

      {/* Row 2 */}
      <motion.div 
        style={{ x: x2 }} 
        className="flex gap-4 md:gap-8 whitespace-nowrap min-w-max"
      >
        {row2.map((img, i) => (
          <div 
            key={`r2-${i}`} 
            className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] rounded-lg md:rounded-xl overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-105 duration-500"
          >
            <img 
              src={img.src} 
              alt="Gallery row 2" 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>

      {/* Row 3 */}
      <motion.div 
        style={{ x: x3 }} 
        className="flex gap-4 md:gap-8 whitespace-nowrap min-w-max"
      >
        {row3.map((img, i) => (
          <div 
            key={`r3-${i}`} 
            className="w-[300px] md:w-[450px] h-[200px] md:h-[300px] rounded-lg md:rounded-xl overflow-hidden shadow-2xl shrink-0 transition-transform hover:scale-105 duration-500"
          >
            <img 
              src={img.src} 
              alt="Gallery row 3" 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
