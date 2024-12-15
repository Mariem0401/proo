class APIFeatures {
  constructor(queryParams, query) {
    this.queryParams = queryParams;
    this.query = query;
  }

  filter() {
    const removeThis = ["page", "limit", "sort"];
    let queryObj = { ...this.queryParams };

    // Supprimer les paramètres de pagination, tri, etc.
    removeThis.forEach((el) => delete queryObj[el]);

    // Conversion des filtres 'lt', 'lte', 'gt', 'gte' en opérateurs MongoDB
    let str = JSON.stringify(queryObj);
    str = str.replace(/\b(lt|lte|gt|gte)\b/g, (opt) => `$${opt}`);

    // Appliquer le filtrage pour les produits
    if (queryObj.category) {
      this.query = this.query.find({ category: queryObj.category });
    }

    // Appliquer le filtrage sur le prix
    if (queryObj.price) {
      const priceRange = queryObj.price.split(','); // Exemple: "gte,1000,lte,2000"
      this.query = this.query.find({
        price: { [`$${priceRange[0]}`]: priceRange[1], [`$${priceRange[2]}`]: priceRange[3] },
      });
    }

    // Appliquer le filtrage sur la quantité
    if (queryObj.quantity) {
      this.query = this.query.find({
        quantity: { [`$${queryObj.quantity.split(',')[0]}`]: queryObj.quantity.split(',')[1] },
      });
    }

    this.query = this.query.find(JSON.parse(str)); // Appliquer les autres filtres comme la date, etc.
    return this;
  }

  pagination() {
    const page = this.queryParams.page * 1 || 1;
    const limit = this.queryParams.limit * 1 || 5;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
}

module.exports = APIFeatures;



/*class APIFeatures {
    constructor(queryParams, query) {
      this.queryParams = queryParams;
      this.query = query;
    }
    filter() {
      const removeThis = ["page", "limit", "sort"];
      let querry = { ...this.queryParams };
      removeThis.forEach((el) => delete querry[el]);
      let str = JSON.stringify(querry);
      str = str.replace(/\b(lt|lte|gt|gte)\b/g, (opt) => `$${opt}`);
      this.query = this.query.find(JSON.parse(str));
      return this;
    }
    pagination() {
      const page = this.queryParams.page * 1 || 1;
      const limit = this.queryParams.limit * 1 || 5;
      const skip = (page - 1) * limit;
      if (this.queryParams.page) {
        const nbr = this.query.length;
        if (skip >= nbr) {
          res.status(400).json({
            message: "you have passed the limit",
          });
        }
      }
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
    sort() {
      if (this.queryParams.sort) {
        const sortBy = this.queryParams.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-created_at");
      }
      return this;
    }
  }
  module.exports = APIFeatures;*/