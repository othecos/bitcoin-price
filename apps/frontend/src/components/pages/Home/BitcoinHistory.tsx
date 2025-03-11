import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatMoneyAmount } from "@/services/price";
import { BitcoinHistoryData, BitcoinService } from "@/services/bitcoin";
import { WarningIcon } from "@/icons/warning";
import { Tooltip } from "@/components/base/Tooltip";

interface BitcoinHistoryProps {
  isInModal?: boolean;
}

export const BitcoinHistory = ({ isInModal = false }: BitcoinHistoryProps) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const fetchBitcoinHistory = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bitcoin/history`
    );
    const data = await response.json();
    if (data.length > 0) {
      BitcoinService.setBitcoinHistoryInLocalStorage(data);
    }
    return data;
  };
  const { data, isLoading, error, isFetched } = useQuery<
    BitcoinHistoryData[],
    Error
  >({
    queryKey: ["bitcoinHistory"],
    queryFn: () => fetchBitcoinHistory(),
    initialData: BitcoinService.getBitcoinHistoryFromLocalStorage(),
  });

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      createChart();
    }
  }, [data, isInModal, error]);

  const createChart = () => {
    if (!chartRef.current) return;

    // Clear any existing chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Remove any existing tooltips
    d3.selectAll("body > .d3-tooltip").remove();

    if (data.length === 0) {
      return;
    }

    const color = error ? "#f43f5e" : "#3b82f6";

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    // Adjust width based on whether it's in modal or card
    const width = (isInModal ? 700 : 500) - margin.left - margin.right;
    const height = (isInModal ? 400 : 300) - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates and sort data chronologically
    const parsedData = data
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

    const tickCount = Math.min(parsedData.length, 10);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(tickCount)
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
      .attr("stroke", color)
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
      .attr("fill", color);

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

  const messageColor = error ? "text-red-600" : "text-gray-500";
  return (
    <div id="bitcoin-history-chart">
      <svg ref={chartRef} className="w-full"></svg>
      {isFetched && data.length === 0 && (
        <div className="text-center py-4">No price history available</div>
      )}
      <div
        className={`flex items-center justify-center gap-2 text-xs text-center ${messageColor}`}
      >
        <span>Bitcoin price history over time</span>{" "}
        {error && (
          <Tooltip
            content="Error loading price history. Using local storage as fallback."
            position="top"
          >
            <WarningIcon className="w-4 h-4" />
          </Tooltip>
        )}
      </div>
    </div>
  );
};
