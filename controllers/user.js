const User = require("../models/Users");
const Order = require("../models/Orders");
const Medicine = require("../models/Medicines");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Request = require("../models/Request");

exports.userLogin = (req, res) => {
  res.render("user/login");
};

exports.userLoginVerify = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "user")
      return res.status(403).json({ message: "Users only" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, username: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 31536000000,
    });

    res.redirect("/user/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.sendDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.clearCookie("token");
      return res.redirect("/user/login");
    }
    const medicines = await Medicine.find();
    res.render("user/user-medicine", { medicines, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.sendRequestPage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.clearCookie("token");
      return res.redirect("/user/login");
    }
    res.render("user/request", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ message: "No requests provided" });
    }

    const newRequests = requests.map((reqData) => ({
      user: req.user.id,
      medicineName: reqData.medicineName,
      companyName: reqData.companyName,
      quantity: reqData.quantity,
      shapeAndDose: reqData.shapeAndDose,
      tradeName: reqData.tradeName,
      scientificName: reqData.scientificName,
      description: reqData.description,
    }));

    await Request.insertMany(newRequests);
    res.status(201).json({ message: "Requests sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending request" });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.clearCookie("token");
      return res.redirect("/user/login");
    }

    const requests = await Request.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.render("user/user-requests", { requests, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.createOrder = async (req, res) => {
  try {
    const user = req.user.id;
    const { medicineId, quantity, price } = req.body;

    if (!user || !medicineId || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const totalPrice = price * quantity;

    const newOrder = new Order({
      user: user,
      medicineId: medicineId,
      quantity: quantity,
      status: "pending",
      price: price,
      totalPrice,
    });

    await newOrder.save();
    res.status(200).send("Order placed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error placing order");
  }
};

exports.userLogut = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

exports.getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.clearCookie("token");
      return res.redirect("/user/login");
    }

    const orders = await Order.find({ user: req.user.id })
      .populate("medicineId")
      .sort({ createdAt: -1 });

    res.render("user/user-orders", { orders, user: user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // FIX applied here: Safely handle deleted users
    if (!user) {
      res.clearCookie("token");
      return res.redirect("/user/login");
    }

    res.render("user/user-settings", {
      title: "Settings",
      page: "settings",
      user: user,
      userName: user.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
