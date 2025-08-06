import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

export default function PredictionChart({ data, predictionPoint }) {
  console.log("PredictionChart - predictionPoint:", predictionPoint);
  console.log("PredictionChart - predictionPoint.date:", predictionPoint?.date);
  
  const chartData = [...data, predictionPoint];
  
  // Calculate if the stock is up or down for color theming
  const isPositive = chartData.length > 1 && 
    chartData[chartData.length - 1]?.close > chartData[0]?.close;
  
  // Modern dark theme color scheme
  const colors = {
    primary: isPositive ? '#00ff88' : '#ff6b6b', // Green for up, red for down
    gradient: isPositive 
      ? ['#00ff88', '#00ff8820'] 
      : ['#ff6b6b', '#ff6b6b20'],
    grid: 'rgba(255, 255, 255, 0.1)',
    text: 'rgba(255, 255, 255, 0.7)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)'
  };

  // Helper function to format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Custom tooltip for better UX
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isPrediction = label === predictionPoint?.date;
      
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-date">{formatDate(label)}</span>
            {isPrediction && <span className="prediction-badge">Prediction</span>}
          </div>
          <div className="tooltip-value">
            ${value?.toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom dot for prediction point
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.date === predictionPoint?.date) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill={colors.primary}
          stroke="#ffffff"
          strokeWidth={3}
          className="prediction-dot"
        />
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Stock Price Analysis</h3>
        <div className="chart-subtitle">
          Historical data with AI prediction
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.gradient[0]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors.gradient[1]} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            stroke={colors.grid} 
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          
          <XAxis
            dataKey="date"
            interval={Math.floor(chartData.length / 6)}
            tick={{ 
              angle: -45, 
              textAnchor: "end", 
              fontSize: 12,
              fill: colors.text
            }}
            height={60}
            axisLine={{ stroke: colors.grid, strokeWidth: 1 }}
            tickLine={{ stroke: colors.grid }}
            tickFormatter={(value) => formatDate(value)}
          />
          
          <YAxis 
            domain={["auto", "auto"]}
            tick={{ fontSize: 12, fill: colors.text }}
            axisLine={{ stroke: colors.grid, strokeWidth: 1 }}
            tickLine={{ stroke: colors.grid }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="close"
            stroke={colors.primary}
            strokeWidth={3}
            fill="url(#priceGradient)"
            dot={<CustomDot />}
            activeDot={{ 
              r: 8, 
              fill: colors.primary,
              stroke: '#ffffff',
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <style jsx>{`
        .chart-container {
          background: ${colors.background};
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          border: 1px solid ${colors.border};
          backdrop-filter: blur(15px);
          margin: 30px 0;
          position: relative;
          overflow: hidden;
        }
        
        .chart-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #00ff88, #00ccff);
        }
        
        .chart-header {
          margin-bottom: 25px;
          text-align: left;
        }
        
        .chart-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: -0.025em;
        }
        
        .chart-subtitle {
          font-size: 1rem;
          color: ${colors.text};
          margin: 0;
          font-weight: 400;
        }
        
        .custom-tooltip {
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          color: #ffffff;
        }
        
        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        
        .tooltip-date {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }
        
        .prediction-badge {
          background: linear-gradient(135deg, #00ff88, #00ccff);
          color: #000000;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .tooltip-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }
        
        .prediction-dot {
          animation: pulse 2s infinite;
          filter: drop-shadow(0 0 8px ${colors.primary});
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .chart-container {
            padding: 20px;
            margin: 20px 0;
            border-radius: 16px;
          }
          
          .chart-title {
            font-size: 1.5rem;
          }
          
          .chart-subtitle {
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 480px) {
          .chart-container {
            padding: 15px;
            margin: 15px 0;
          }
          
          .chart-title {
            font-size: 1.3rem;
          }
          
          .chart-subtitle {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}