const Helpers = {
    ucWord: (str) => {
        if (str) {
            return str.toLowerCase().replace(/\b[a-z]/g, function (letra) {
                return letra.toUpperCase();
            });
        } else {
            return ''
        }

    },
    dateConvert: (myDate) => {
        const date = new Date(myDate);
        const monthNames = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${year}`;
    },

    slugify: (str) => str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
}

module.exports = Helpers;
