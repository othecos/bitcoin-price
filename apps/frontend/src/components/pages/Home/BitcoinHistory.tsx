import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatMoneyAmount } from "@/services/price";

interface BitcoinHistoryData {
  timestamp: string;
  price: number;
}
export const BitcoinHistory = () => {
  const [bitcoinHistory, setBitcoinHistory] = useState<BitcoinHistoryData[]>(
    []
  );
  const chartRef = useRef<SVGSVGElement>(null);
  const fetchBitcoinHistory = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bitcoin/history`
    );
    const data = await response.json();
    setBitcoinHistory(data);
    return data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["bitcoinHistory"],
    queryFn: () => fetchBitcoinHistory(),
  });

  useEffect(() => {
    if (bitcoinHistory.length > 0 && chartRef.current) {
      createChart();
    }
  }, [bitcoinHistory]);

  const createChart = () => {
    if (!chartRef.current) return;

    // Clear any existing chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates and sort data chronologically
    const parsedData = bitcoinHistory
      .map((d) => ({
        date: new Date(d.timestamp),
        price: d.price,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Set scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        (d3.min(parsedData, (d) => d.price) ?? 0) * 0.995,
        (d3.max(parsedData, (d) => d.price) ?? 0) * 1.005,
      ])
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeMinute.every(1))
          .tickFormat(d3.timeFormat("%H:%M") as any)
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add Y axis
    svg.append("g").call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${formatMoneyAmount(d as number, true, 2)}`)
    );

    // Add the line
    svg
      .append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line<{ date: Date; price: number }>()
          .x((d) => x(d.date))
          .y((d) => y(d.price))
      );

    // Add dots
    svg
      .selectAll("circle")
      .data(parsedData)
      .join("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.price))
      .attr("r", 3)
      .attr("fill", "#3b82f6");

    // Add tooltip functionality
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    svg
      .selectAll("circle")
      .on("mouseover", function (event: any, d: any) {
        const typedD = d as { date: Date; price: number };
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>Date:</strong> ${typedD.date.toLocaleDateString()}<br>
             <strong>Time:</strong> ${typedD.date.toLocaleTimeString()}<br>
             <strong>Price:</strong> ${formatMoneyAmount(typedD.price, true, 2)}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading price history...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error loading price history
      </div>
    );
  }

  if (bitcoinHistory.length === 0) {
    return <div className="text-center py-4">No price history available</div>;
  }
  return (
    <div className="bitcoin-history-chart">
      <svg ref={chartRef} className="w-full"></svg>
      <div className="text-xs text-gray-500 mt-2 text-center">
        Bitcoin price history over time (last 5 minutes)
      </div>
    </div>
  );
};
