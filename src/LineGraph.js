import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
//handling the options in the graph
const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: "index",
		intersect: false,
		callbacks: {
			label: function (tooltipItem, data) {
				return numeral(tooltipItem.value).format("+0,0");
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: "time",
				time: {
					format: "MM/DD/YY",
					tooltipFormat: "LL",
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					callback: function (value, index, values) {
						return numeral(value).format("0a");
					},
				},
			},
		],
	},
};
function LineGraph({caseType='cases' ,...props}) {
	const [data, setData] = useState({});
	//build chart info translation
	const buildChartData = (data, caseType = "cases") => {
		const chartData = [];
		let lastDataPoint;
		for (let date in data.cases) {
			if (lastDataPoint) {
				const newDataPoint = {
					x: date,
					//difference between last date and current date
					y: data[caseType][date] - lastDataPoint,
				};
				chartData.push(newDataPoint);
			}
			lastDataPoint = data[caseType][date];
		}
		return chartData;
	};
	//daily data on cases reported to be translated into a chart
	useEffect(() => {
		const fetchData = async () => {
			await fetch(
				"https://disease.sh/v3/covid-19/historical/all?lastdays=120"
			)
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					const chartData = buildChartData(data, "cases");
					setData(chartData);
				});
        };
        fetchData();
	}, [caseType]);

	return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line
				options={options}
				data =
				{{
					datasets: [
						{
							backgroundColor: "rgba(204 ,16 , 52 ,0.75",
							borderColor: "#CC1034",
							data: data,
						},
					],
				}}
			/>
            )}
		</div>
	)
}
      
export default LineGraph;
