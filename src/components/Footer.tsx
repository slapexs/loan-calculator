import { ExternalLink, Github } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-3">
          {/* Disclaimer - Compact version */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-xs text-yellow-800">
            <strong>ข้อจำกัดความรับผิดชอบ:</strong> ข้อมูลทั้งหมดเป็นการคำนวณคร่าวๆ เท่านั้น ไม่ใช่ข้อมูลจริงจากธนาคาร กรุณาติดต่อธนาคารโดยตรงเพื่อข้อมูลที่แม่นยำ
          </div>

          {/* Copyright and Credits - Single line on larger screens */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
              <span>© {currentYear} เครื่องมือคำนวณสินเชื่อบ้าน</span>
              <span className="hidden sm:inline">•</span>
              <span>สร้างเพื่อการศึกษาและใช้งานส่วนตัว</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>พัฒนาโดย</span>
              <a 
                href="https://github.com/slapexs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Github className="h-3 w-3" />
                slapexs
                <ExternalLink className="h-2 w-2" />
              </a>
            </div>
          </div>

          {/* Additional Info - Compact */}
          <div className="text-xs text-gray-500 text-center">
            เครื่องมือนี้เป็น Open Source สามารถดูซอร์สโค้ดและมีส่วนร่วมในการพัฒนาได้ที่ GitHub
          </div>
        </div>
      </div>
    </footer>
  );
};
