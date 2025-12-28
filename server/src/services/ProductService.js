const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, countInStock, price, rating, description } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "The name is already",
        });
      }

      const newProduct = await Product.create({
        name,
        image,
        type,
        countInStock,
        price,
        rating,
        description,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not found",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not found",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "delete SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({_id: ids})
      resolve({
        status: "OK",
        message: "delete SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments(); 
            let allProduct = []

            if (filter) {
                const label = filter[0];
                allProduct = await Product.find({ [label]: { '$regex': filter[1] } })
                    .limit(limit)
                    .skip(page * limit);
            } else if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                allProduct = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);
            } else {
                allProduct = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort({ createdAt: -1, updatedAt: -1 }); // Sắp xếp theo ngày mới nhất
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "OK",
          message: "The product is not found",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
};
