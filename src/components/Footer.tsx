import { AnimatedGradientText } from "./magicui/animated-gradient-text";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-3">
        
          {/* Copyright and Credits - Single line on larger screens */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
              <span>© {currentYear} เครื่องมือคำนวณสินเชื่อบ้าน</span>
              <span className="hidden sm:inline">•</span>
              <span>สร้างเพื่อการศึกษาและใช้งานส่วนตัว</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>พัฒนาโดย : </span>
              <AnimatedGradientText>Sunboy-dev</AnimatedGradientText>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
