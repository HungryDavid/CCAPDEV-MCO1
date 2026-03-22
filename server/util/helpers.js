const moment = require('moment'); // npm install moment
const hbs = require('hbs');

module.exports = {
    // FORMAT DATE
    formatDate: function (date, format) {
        return moment(date).format(format);
    },

    // EQUALITY CHECK
    eq: function (a, b) {
        return a === b;
    },

    // IS SELECTED
    isSelected: function (a, b) {
        return a === b ? 'selected' : '';
    },

    // NOT EQUAL
    ne: function (a, b) {
        return a !== b;
    },

    // CHECK IF RESERVED
    seatStatus: function (reservation) {
        return reservation ? 'taken' : 'available';
    },

    // ROLE CHECK
    hasRole: function (user, requiredRole, options) {
        if (!user || !user.role) {
            return options.inverse(this);
        }
        const rolesArray = requiredRole.split(',').map(role => role.trim());
        if (rolesArray.includes(user.role)) {
            return options.fn(this);
        }
        return options.inverse(this);
    },

    // DEBUGGING (Dump JSON)
    json: function (context) {
        return JSON.stringify(context, null, 2);
    },

    // MATH (Add)
    add: function (value, addition) {
        return parseInt(value) + parseInt(addition);
    },

    // TRUNCATE TEXT
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            return str.substring(0, len) + '...';
        }
        return str;
    },

    // RENDER ERROR
    renderErrorPage: function (res, err) {
        res.render('error', {
            layout: "plain",  // Default layout
            errorNumber: err.errorNumber || 500,  // Default to 500 if errorNumber is not provided
            errorName: err.errorName || 'Internal Server Error',  // Default to 'Internal Server Error'
            errorMessage: err.errorMessage || 'An unexpected error occurred.'  // Default message
        });
    },

    // FORMAT DATE
    formatDate: function (date) {
        return moment(date).format('YYYY-MM-DD HH:mm');
    },

    // NAV LINK CLASS
    navLinkClass: function (currentPath, targetPath) {
        return currentPath === targetPath
            ? 'active text-white bg-primary'
            : 'text-black';
    },

    // Convert time string "HH:mm" to total minutes
    timeToMinutes: function (timeStr) {
        if (!timeStr) return 0;

        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours * 60) + minutes;
    },

    // Convert total minutes back to "HH:mm" format
    minutesToTime: function (totalMinutes) {
        const total = Math.abs(Math.round(totalMinutes));

        const hours = Math.floor(total / 60) % 24;
        const minutes = total % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    },

    // TIME SLOTS HELPER
    getTimeSlots: function (selectedDate, start, end, interval = 30) {
        const slots = [];
        const dateToCheck = new Date(selectedDate);
        const today = new Date();
        const isToday = dateToCheck.toDateString() === today.toDateString();
        const nowInMinutes = (today.getHours() * 60) + today.getMinutes();

        let current = Math.ceil(start / interval) * interval;
        while (current + interval <= end) {
            if (!isToday || (current + interval > nowInMinutes)) {
                slots.push(current);
            }
            current += interval;
        }

        return slots;
    },

    // CHECK IF LOGGED IN
    isLoggedIn: function (user) {
        return user && user.role;
    },

    isTechnician: function (user) {
        // Make sure 'technician' matches your database string exactly
        return user && user.role === 'technician';
    }
};