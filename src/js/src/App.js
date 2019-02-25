import React, { Component } from 'react';
import './App.css';

// TODO: take these as input.
const startDate = "2019-01-27";
const endDate = "2019-02-28";

// Size in pixels of a block in the SVG.
const blockSize = 60;
// Gap in pixels between svg calendar day blocks.
const svgEltPixGap = 4;
const daysInAWeek = 7;

const moodData = fetch("https://v6svfx4869.execute-api.us-east-1.amazonaws.com/prod?startDate=" + startDate + "&endDate=" + endDate)
  .then(res => res.json());

function parseMoodReports(reports) {
  const moods = [];
  // Create a map of date to mood, populate with empty reports.
  var dailyMoods = new Map();
  getDates(new Date(startDate), new Date(endDate)).forEach(
    // Note: only considers yyyy-mm-dd portion of date to reduce time zone shenanigans.
    d => dailyMoods.set(d.toISOString().substring(0, 10), {
      mood: -1,
      time: d.toISOString(),
      note: "No report submitted for this date.",
      dayIndex: getDayOfWeekIndex(d),
    })
  );
  // Overwrite daily moods with last mood for each day.
  // TODO: consider converting this to average mood for all reports on each day.
  reports.forEach(report => {
    const m = report.MoodRating;
    const t = report.Time;
    const n = report.Note;
    // Note: only considers yyyy-mm-dd portion of date to reduce time zone shenanigans.
    const d = getDayOfWeekIndex(new Date(report.Time.substring(0, 10)));
    dailyMoods.set(t.substring(0, 10), { mood: m, time: t, note: n, dayIndex: d });
  });
  dailyMoods.forEach(function (value, key, map) {
    moods.push(value);
  });
  return moods;
}

class App extends Component {
  state = { moods: [] }

  componentDidMount() {
    moodData
      .then(
        (result) => {
          this.setState({
            moods: parseMoodReports(result),
          });
        }
      );
  }

  render() {
    const offset = 
        (this.state.moods === undefined || this.state.moods.length === 0) 
        ? 0 
        : this.state.moods[0].dayIndex;
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Moody
            <span role="img" aria-label="happy"> 😁</span>
            <span role="img" aria-label="meh"> 😐</span>
            <span role="img" aria-label="sad"> 😢</span>
          </p>
        </header>
        <div className="App-data">
          {
            this.state.moods.length === 0
              ? <p>Searching...</p>
              : buildCalendarSvg(this.state.moods, offset)
          }
        </div>
      </div>
    );
  }
}

function buildCalendarSvg(moods, offset) {
  return (
    <svg width={blockSize * daysInAWeek - svgEltPixGap} height={blockSize * (2 + moods.length / daysInAWeek)}>
      {getCalendarDayOfWeekLabels()}
      {moods.map(
        (val, i) =>
          <rect
              width={blockSize - svgEltPixGap}
              height={blockSize - svgEltPixGap}
              fill={getMoodColor(val)}
              x={getX(val.dayIndex)}
              y={getY(i, offset)}
              key={val.time}>
            <title>{getMoodTitle(val)}</title>
          </rect>
      )}
    </svg>);
}

// TODO: convert to constructing "cells" for each label, and align text
//       centrally within cells so we don't have to muck around with the
//       alignment when svg dimensions change.
function getCalendarDayOfWeekLabels() {
  return (
    <text x="10" y={blockSize - 10} fontSize={blockSize} textLength={blockSize * daysInAWeek - 20}>
      S M T W T F S
    </text>);
}

/** 
 * Calculate x-coord within the mood SVG given an index indicating
 * the day of week.
 * 
 * {@see getDayOfWeekIndex} for how dayIndex is defined.
 */
function getX(dayIndex) {
  return dayIndex * blockSize;
}
/** 
 * Calculate y-coord within the mood SVG given an index indicating
 * the day of week, and an offset indicating the day of the week in
 * the date range being displayed.
 * 
 * {@see getDayOfWeekIndex} for how offsets are defined.
 */
function getY(indexInRequestedDates, initialDayOffset) {
  return (1 + Math.floor((indexInRequestedDates + initialDayOffset) / daysInAWeek)) * blockSize;
}

/**
 * Returns a title for a mood report.
 * 
 * Constructs title for a mood report using a combination of
 * the report's date and associated note. If no note is
 * provided, then the report consists solely of the date.
 */
function getMoodTitle(moodReport) {
  return moodReport.time.substring(0, 10) +
    ((moodReport.note === "") ? "" : ": " + moodReport.note);
}

/**
 * Returns a color corresponding to a numerical mood.
 * 
 * Happy days are green, sad days are red, and unrated days are gray.
 */
function getMoodColor(moodReport) {
  if (moodReport.mood > 7) {
    return "rgb(104, 169, 52)";
  } else if (moodReport.mood > 4) {
    return "rgb(205, 234, 169)";
  } else if (moodReport.mood > 2) {
    return "rgb(241, 183, 217)";
  } else if (moodReport.mood > 0) {
    return "rgb(195, 42, 129)";
  } else {
    return "rgb(220,220,220)";
  }
}

/** Stolen from https://gist.github.com/miguelmota/7905510.  */
function getDates(startDate, endDate) {
  var dates = [],
    currentDate = startDate,
    addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

/**
 * Returns the index of the day of the week for a date.
 *
 * Consolidates logic around the numerical value of days of the week.
 * Moody represents a calendar week as Sunday - Saturday, so we
 * increment the index JS returns by default to make calculation of
 * X and Y coordinates of day-blocks more direct.
 * 
 * That is, for each weekday we return the following numeric values:
 *  Sunday - 0
 *  Monday - 1
 *  Tuesday - 2
 *  Wednesday - 3
 *  Thursday - 4
 *  Friday - 5
 *  Saturday - 6
 */
function getDayOfWeekIndex(date) {
  return (date.getDay() + 1) % daysInAWeek;
}

export default App;
