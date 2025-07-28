import { useMemo, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentDetail } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LoanChartsProps {
  paymentDetails: PaymentDetail[];
}

export const LoanCharts = ({ paymentDetails }: LoanChartsProps) => {
  const [activeTab, setActiveTab] = useState('line-chart');

  // Process data for charts
  const { lineChartData, barChartData } = useMemo(() => {
    if (!paymentDetails.length) return { lineChartData: null, barChartData: null };

    // Get unique years from payment details
    const years = Array.from(new Set(paymentDetails.map(p => p.year))).sort((a, b) => a - b);
    
    // Prepare data for line chart (remaining principal and interest over time)
    const lineData = {
      labels: years.map(year => `ปีที่ ${year}`),
      datasets: [
        {
          label: 'เงินต้นคงเหลือ',
          data: years.map(year => {
            // Get the last payment of each year
            const yearPayments = paymentDetails.filter(p => p.year === year);
            return yearPayments.length > 0 ? yearPayments[yearPayments.length - 1].remainingPrincipal : 0;
          }),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.3,
          yAxisID: 'y',
          fill: false,
        },
        {
          label: 'ดอกเบี้ยคงเหลือ',
          data: years.map(year => {
            // Sum up all future interest payments after this year
            return paymentDetails
              .filter(p => p.year > year)
              .reduce((sum, p) => sum + p.interestPayment, 0);
          }),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.3,
          yAxisID: 'y',
          fill: false,
        },
      ],
    };

    // Prepare data for bar chart (yearly only)
    const barData = {
      labels: years.map(year => `ปีที่ ${year}`),
      datasets: [
        {
          label: 'เงินต้น',
          data: years.map(year => {
            // Sum principal payments for the year (excluding overpayments)
            return paymentDetails
              .filter(p => p.year === year)
              .reduce((sum, p) => sum + (p.principalPayment - (p.overpayment || 0)), 0);
          }),
          backgroundColor: 'rgba(53, 162, 235, 0.7)',
          stack: 'stack',
        },
        {
          label: 'ดอกเบี้ย',
          data: years.map(year => {
            // Sum interest payments for the year
            return paymentDetails
              .filter(p => p.year === year)
              .reduce((sum, p) => sum + p.interestPayment, 0);
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          stack: 'stack',
        },
      ],
    };

    return { lineChartData: lineData, barChartData: barData };
  }, [paymentDetails]);

  // Line chart options
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'จำนวนเงิน (บาท)',
        },
        ticks: {
          callback: (value) => {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return numValue.toLocaleString('th-TH');
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท`;
          },
        },
      },
    },
  };

  // Bar chart options
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท`;
          },
          footer: (items) => {
            const total = items.reduce((sum, item) => sum + (item.parsed?.y || 0), 0);
            return `รวม: ${total.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return numValue.toLocaleString('th-TH');
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="line-chart">
              เงินต้น/ดอกเบี้ยคงเหลือ
            </TabsTrigger>
            <TabsTrigger value="bar-chart">
              รายการชำระรายปี
            </TabsTrigger>
          </TabsList>

          <div className="h-[400px] w-full">
            {activeTab === 'line-chart' ? (
              lineChartData && (
                <Line 
                  options={{
                    ...lineChartOptions,
                    maintainAspectRatio: false,
                    responsive: true,
                  }} 
                  data={lineChartData}
                />
              )
            ) : (
              barChartData && (
                <Bar 
                  options={{
                    ...barChartOptions,
                    maintainAspectRatio: false,
                    responsive: true,
                  }} 
                  data={barChartData}
                />
              )
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};
