import React, { useState, useEffect } from "react";
import "./App.css";
import {
	FormControl,
	MenuItem,
	Select,
	Card,
	CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import Map from "./Map";
import { sortData } from "./util";
import { prettyPrintState } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
function App() {
	//state for showng countries by default is a empty array
	const [countries, setCountries] = useState([]);
	//show one country by default i.e Worldwide
	const [country, setCountry] = useState("worldwide");
	//managing the state o country info
	const [countryInfo, setCountryInfo] = useState({});
	//table data in the state
	const [tableData, setTableData] = useState([]);
	//handling length of map
	const [mapCenter, setMapCenter] = useState({
		lat: 34.80746,
		lng: -40.4796,
	});
	const [mapCountries, setMapCountries] = useState([]);
	//handle zooming of a map
	const [mapZoom, setMapZoom] = useState(3);
	//handle cases
	const [casesType, setCasesType] = useState("cases");
	//making a call using useeffect based on a given condition
	useEffect(() => {
		//async =>sends a request ,wait
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					//restructure the countries //maps return array of object
					const countries = data.map((country) => ({
						name: country.country, //Kenya , Tanzania
						value: country.countryInfo.iso2, //Uk UsA
					}));
					//sorted data
					const sortedData = sortData(data);
					//display countries in a sorted order
					setTableData(sortedData);
					setMapCountries(data);
					setCountries(countries);
				});
		};
		getCountriesData();
	}, []);
	//get world wide data statistics
	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);
	//triggers the select option
	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode);
		//make a api call through a tenary operation
		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;
		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				//show the country on the input dropdown by updating the input field
				setCountry(countryCode);
				//stores the response of all data
				setCountryInfo(data);
				//on hover to a given country locate it on the map
				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};
	return (
		//show data
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COV1D-19 TRACKER</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}
						>
							{/* looop through all the countries and show list of options*/}
							<MenuItem value="worldwide">worldwide</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				{/* show info boxes i.e corona cases, recoverd and cases reported*/}
				<div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
						onClick={(e) => setCasesType("cases")}
						title="Coronavirus case"
						cases={prettyPrintState(countryInfo.todayCases)}
						total={prettyPrintState(countryInfo.cases)}
					/>
          <InfoBox
            active={casesType === "recovered"}
						onClick={(e) => setCasesType("recovered")}
						title="Recovered"
						cases={prettyPrintState(countryInfo.todayRecovered)}
						total={prettyPrintState(countryInfo.recovered)}
					/>
          <InfoBox
             isRed
            active={casesType === "deaths"}
						onClick={(e) => setCasesType("deaths")}
						title="Deaths"
						cases={prettyPrintState(countryInfo.todayDeaths)}
						total={prettyPrintState(countryInfo.deaths)}
					/>
				</div>
				{/*show the map */}

				<Map
					casesType={casesType}
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>
			{/*display sorted data in the table */}
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
					<LineGraph  className=" app__graph" caseType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}
export default App;
