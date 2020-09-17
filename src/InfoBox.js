import React from "react";
import "./InfoBox.css";
import { Card, Typography, CardContent } from "@material-ui/core";
function InfoBox({ title, cases, isRed, total, active, ...props }) {
	return (
		<Card
			onClick={props.onClick}
			className={`infoBox ${active && "infoBox--selected"} ${
				isRed && "infoBox--red"
			}`}
		>
			<CardContent>
				<Typography className="infoBox__title" color="textSecondary">
					{title}
				</Typography>
				<h2
					className={`infoBox__case ${
						!isRed && "infoBox__cases--green"
					}`}
				>
					{cases}
				</h2>
				<Typography className="infoBox__total" color="textSecondary">
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
