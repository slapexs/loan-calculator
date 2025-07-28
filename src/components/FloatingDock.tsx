import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { ExportButton } from "./ExportButton";
import { PaymentDetail } from "../types";

interface FloatingDockProps {
  paymentDetails: PaymentDetail[];
  monthlyOverpayments: { [month: number]: number };
  onShowChart: () => void;
}

export const FloatingDock = ({
  paymentDetails,
  monthlyOverpayments,
  onShowChart,
}: FloatingDockProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show dock when scrolled down more than 100px
      if (currentScrollY > 100) {
        // Only update state if it's not already visible
        if (!isVisible) {
          setIsVisible(true);
        }
      } 
      // Hide dock when scrolled to top (or near top)
      else if (currentScrollY <= 100) {
        // Only update state if it's currently visible
        if (isVisible) {
          setIsVisible(false);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener with debounce
    const scrollHandler = () => {
      window.requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [isVisible, lastScrollY]);
  return (
    <div 
      className={`fixed left-0 right-0 flex justify-center z-50 px-4 transition-all duration-500 ${
        isVisible ? 'bottom-6 opacity-100' : '-bottom-20 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-gray-200 p-1.5 flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full gap-2 h-12 px-4 hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900"
          onClick={onShowChart}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="font-medium">แสดงกราฟ</span>
        </Button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="px-1">
          <div className="flex items-center">
            <ExportButton
              paymentDetails={paymentDetails}
              monthlyOverpayments={monthlyOverpayments}
              className="h-12 px-4 rounded-full  transition-colors duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
