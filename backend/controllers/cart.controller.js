import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {

    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        //need to add quantity for each products
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(item => item.id === product.id);
            return { ...product.toJSON(), quantity: item.quantity };
        })
        res.json(cartItems);
    } catch (error) {
        console.log('ERROR IN GET CART PRODUCTS CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}


export const addToCart = async (req, res) => {

    try {

        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log('ERROR IN ADD TO CART CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}

export const removeAllFromCart = async (req, res) => {

    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];

        } else {
            user.cartItems = user.cartItems.filter(item => item.id !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}


export const updateQuantity = async (req, res) => {

    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        }
        else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log('ERROR IN UPDATE QUANTITY CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}


