"use strict";

exports.__esModule = true;
exports.withinDates = exports.subtractMonths = exports.subtractDays = exports.startOfMonth = exports.sameDayOrBefore = exports.sameDayOrAfter = exports.sameDay = exports.normalizeForTimezone = exports.getTimestamp = exports.formatToLocalYYYYMMDD = exports.formatDateToPropStructure = exports.endOfMonth = exports.daysApart = exports.betweenDates = exports.addMonths = exports.addDays = void 0;
// Utility functions for the Calendar.
// Just what's needed to avoid having to include a dependency like momentjs.
var DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

var addDays = function addDays(date, days) {
  var result = new Date(date.getTime() + DAY_MILLISECONDS * days); // Deal with crossing the daylight savings time boundary,
  // where adding a day's worth when the time is midnight results in
  // being a day off.

  var hourDelta = result.getHours() - date.getHours(); // At this point, hourDelta is typically 0 (normal day),
  // +23 (November daylight saving), or -23 (March Daylight saving)
  // depending on which side of the switch we are on.
  // Convert so that hourDelta is either +1 or -1.

  if (hourDelta === 23) {
    hourDelta -= 24;
  } else if (hourDelta === -23) {
    hourDelta += 24;
  }

  result.setHours(result.getHours() - hourDelta);
  return result;
};

exports.addDays = addDays;

var subtractDays = function subtractDays(date, days) {
  return addDays(date, -days);
};

exports.subtractDays = subtractDays;

var addMonths = function addMonths(date, months) {
  var result = new Date(date);
  var years = Math.floor((date.getMonth() + months) / 12);
  result.setFullYear(date.getFullYear() + years);
  var targetMonth = (date.getMonth() + months) % 12;
  result.setMonth(targetMonth < 0 ? 12 + targetMonth : targetMonth);
  return result;
};

exports.addMonths = addMonths;

var subtractMonths = function subtractMonths(date, months) {
  return addMonths(date, -months);
};

exports.subtractMonths = subtractMonths;

var startOfMonth = function startOfMonth(date) {
  var result = new Date(date);
  result.setDate(1);
  return result;
};

exports.startOfMonth = startOfMonth;

var endOfMonth = function endOfMonth(date) {
  var result = addMonths(date, 1);
  result.setDate(0);
  return result;
};

exports.endOfMonth = endOfMonth;

var sameDay = function sameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

exports.sameDay = sameDay;

var sameDayOrAfter = function sameDayOrAfter(date1, date2) {
  return date1.getFullYear() > date2.getFullYear() || date1.getFullYear() === date2.getFullYear() && (date1.getMonth() > date2.getMonth() || date1.getMonth() === date2.getMonth() && date1.getDate() >= date2.getDate());
};

exports.sameDayOrAfter = sameDayOrAfter;

var sameDayOrBefore = function sameDayOrBefore(date1, date2) {
  return date1.getFullYear() < date2.getFullYear() || date1.getFullYear() === date2.getFullYear() && (date1.getMonth() < date2.getMonth() || date1.getMonth() === date2.getMonth() && date1.getDate() <= date2.getDate());
};

exports.sameDayOrBefore = sameDayOrBefore;

var daysApart = function daysApart(date1, date2) {
  return Math.floor((date1.getTime() - date2.getTime()) / DAY_MILLISECONDS);
};

exports.daysApart = daysApart;

var formatToLocalYYYYMMDD = function formatToLocalYYYYMMDD(date) {
  var adjustedDate = new Date(date);
  return new Date(adjustedDate.getTime() - adjustedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
}; // betweenDates takes an array of two elements and checks if the
// supplied date lies between them, inclusive.
// returns 2 if exact match to one end, 1 if between, undefined otherwise


exports.formatToLocalYYYYMMDD = formatToLocalYYYYMMDD;

var betweenDates = function betweenDates(date, dates) {
  var result;

  if (dates) {
    var _dates$map = dates.map(function (d) {
      return d ? new Date(d) : undefined;
    }),
        from = _dates$map[0],
        to = _dates$map[1];

    if (from && sameDay(date, from) || to && sameDay(date, to)) {
      result = 2;
    } else if (from && sameDayOrAfter(date, from) && to && sameDayOrBefore(date, to)) {
      result = 1;
    }
  } else {
    result = 1;
  }

  return result;
}; // withinDates takes an array of string dates or 2 element arrays and
// checks whether the supplied date matches any string or is between
// any dates in arrays.
// returns 2 if exact match, 1 if between, undefined otherwise


exports.betweenDates = betweenDates;

var withinDates = function withinDates(date, dates) {
  var result;

  if (dates) {
    if (Array.isArray(dates)) {
      dates.some(function (d) {
        if (typeof d === 'string') {
          if (sameDay(date, new Date(d))) {
            result = 2;
          }
        } else {
          result = betweenDates(date, d);
        }

        return result;
      });
    } else if (sameDay(date, new Date(dates))) {
      result = 2;
    }
  }

  return result;
};

exports.withinDates = withinDates;

var getTimestamp = function getTimestamp(date) {
  return /T.*/.test(date) ? new Date(date).toISOString().split('T')[1] : // for Calendar, explicitly mark that caller has provided
  // value with no timestamp
  false;
}; // Adjust for differences between timestamp on value and
// local timezone of user. Internal Calendar logic relies
// on Javascript date contructor which translates the provided
// date into the equivalent moment for the user's timezone, which
// can create undesired results. The standardizes the input value
// for internal calculations
// Reference: https://www.ursahealth.com/new-insights/dates-and-timezones-in-javascript


exports.getTimestamp = getTimestamp;

var normalizeForTimezone = function normalizeForTimezone(value, timestamp) {
  var adjustedDate;
  var hourDelta;
  var valueOffset = 0;

  if (timestamp && typeof timestamp === 'string') {
    hourDelta = parseInt(timestamp == null ? void 0 : timestamp.split(':')[0], 10);
    valueOffset = hourDelta * 60 * 60 * 1000; // ms
  }

  var localOffset = new Date().getTimezoneOffset() * 60 * 1000;
  adjustedDate = value && (Array.isArray(value) ? value : [value]).map(function (v) {
    return new Date(new Date(v).getTime() - valueOffset + localOffset).toISOString();
  });

  if (typeof value === 'string') {
    var _adjustedDate = adjustedDate;
    adjustedDate = _adjustedDate[0];
  }

  return adjustedDate;
}; // format the date to align with date format caller passed in


exports.normalizeForTimezone = normalizeForTimezone;

var formatDateToPropStructure = function formatDateToPropStructure(date, timestamp) {
  var adjustedDate;

  if (date) {
    if (timestamp) adjustedDate = formatToLocalYYYYMMDD(date).split('T')[0] + "T" + timestamp;else if (timestamp === false) {
      var _formatToLocalYYYYMMD = formatToLocalYYYYMMDD(date).split('T');

      adjustedDate = _formatToLocalYYYYMMD[0];
    } else adjustedDate = date;
  }

  return adjustedDate;
};

exports.formatDateToPropStructure = formatDateToPropStructure;