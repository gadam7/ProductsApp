const User = require('../models/user.model');

exports.findAll = async(req, res) => {
  console.log("Find all user's products")

  try{
    const results = await User.find({}, { username: 1, products: 1});
    res.status(200).json({ status: true, data: results});
    console.log("Success in reading all user's products");
  } catch (err) {
    res.status(400).json({ status: false, data: err});
    console.log("Problem in reading user's products");
  }
}

exports.findOne = async(req, res) => {
  const username = req.params.username
  console.log("Find user with username ", username);

  try{
    const result = await User.findOne({ username: username}, { username: 1, products: 1});
    res.status(200).json({ status: true, data: result});
    console.log("Success in reading user's products");
  } catch (err) {
    res.status(400).json({ status: false, data: err});
    console.log("Problem in finding user's products", username);
  }
}

exports.addProduct = async(req, res) => {

  const username = req.body.username;
  const products = req.body.products;

  console.log("Insert product to username ", username);

  try{
    const result = await User.updateOne(
      { username: username },
      {
        $push: {
          products: products
        }
      }
    );
    res.status(200).json({status: true, data: result});
    console.log("Success in saving product");
  } catch (err) {
    res.status(400).json({ status: false, data: err });
    console.log("Problem in saving product", username);
  }
}

exports.updateProduct = async(req, res) => {
  const username = req.params.username;
  const product_id = req.body.product._id;
  const product_quantity = req.body.product.quantity;

  console.log("Update product for username", username, product_id, product_quantity);

  try{
    const result = await User.updateOne(
      { username: username, "products._id": product_id },
      {
        $set: {
          "products.$.quantity": product_quantity
        }
      }
    );
    res.status(200).json({status: true, data: result});
    console.log("Success in updating product");
  } catch {
    res.status(400).json({ status: false, data: err });
    console.log("Problem in updating product for user", username);
  }
}

exports.deleteProduct = async(req, res) => {
  const username = req.params.username;
  const product = req.params.product;

  try{
    const result = await User.updateOne(
      { username: username },
      {
        $pull: {
          products: { product: product }
        }
      }
    );
    res.status(200).json({status: true, data: result});
    console.log("Success in deleting product");
  } catch {
    res.status(400).json({ status: false, data: err });
    console.log("Problem in updating deleting for user", username);
  }
}

exports.stats1 = async(req, res) => {
  console.log("For all users sum by product and count");

  try {
    const result = await User.aggregate(
      [
        {
          $unwind: "$products"
        },
        {
          $project: {
            id: 1,
            username: 1,
            products: 1
          }
        },
        {
          $group: {
            _id: {
              username: "$username",
              product: "$products.product"
            },
            totalAmount: {
              $sum: {
                $multiply: [ "$products.cost", "$products.quantity"]
              }
            },
            count: { $sum: 1 }
          }
        }
      ]
    )
    res.status(200).json({status: true, data: result});
    console.log("Success in stats1");
  } catch (err) {
    res.status(400).json({ status: false, data: err });
    console.log("Problem in stats1", username);
  }
}