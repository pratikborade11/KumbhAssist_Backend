export default class ApiFeatures {
    constructor(query, queryString) {
        (this.query = query), (this.queryString = queryString);
    }

    filtering() {
        const queryObj = { ...this.queryString };
        // console.log(queryObj);

        const excludedFields = ["page", "limit", "sort"];

        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => "$" + match);

        console.log("Query String: ", queryStr);

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");

            this.query = this.query.sort(sortBy);

            // console.log(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    pagination() {
        const page = this.queryString.page * 1 || 1; // multiply 1 to convert string to number

        const limit = this.queryString.limit * 1 || 9;

        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}