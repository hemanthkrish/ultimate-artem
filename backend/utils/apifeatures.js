class ApiFeatures {
  constructor(query, querystr) {
    this.query = query; //query is --> Products.find()
    this.querystr = querystr; //querystr is --> everything after ? mark keyword=samosa&....
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.querystr }; //this.querystr is not used because
    //removing some fields from the querystr
    const removeFields = ["keyword", "page", "limit"];

    //console.log(queryCopy);
    removeFields.forEach((key) => delete queryCopy[key]);

    //filter for price and range
    //console.log(queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); //here we have used regular expression

    this.query = this.query.find(JSON.parse(queryStr));
    //console.log(queryStr);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.querystr.page) || 1; //query
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
