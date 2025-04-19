import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {

    try {
        const products = await Product.find({}); //find all products
        res.json({ products });

    } catch (error) {
        console.log('ERROR IN GET ALL PRODUCTS CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}

export const getFeaturedProducts = async (req, res) => {

    //We are going to use redis to store the featured products as cache
    try {
        //Check if we have anything in Redis.
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(parse(featuredProducts));
        }

        //if not in redis, fetch from mongodb.
        // .lean() will return plain js object instead of mongodb doc
        //This is good for performance.
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "  No featured products found" });

        }

        //Store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts)

    } catch (error) {
        console.log('ERROR IN GET FEATURED PRODUCTS CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}


export const createProduct = async (req, res) => {

    try {
        const { name, description, price, category, image } = req.body;
        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' });

        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(201).json(product)

    } catch (error) {

        console.log('ERROR IN CREATE PRODUCT CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}



export const deleteProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.paras.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            //this gets the id of the image 
            const publicId = product.image.split("/").pop().split(".")[0];

            try {

                await cloudinary.uploader.destroy(`products/${publicId}`);

            } catch (error) {
                console.log("ERROR IN DELETING IMAGE FROM CLOUDINARY ", error.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        console.log('ERROR IN DELETE PRODUCT CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }

}


export const getRecommendedProducts = async (req, res) => {

    try {

        const products = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])

        res.json(products)
    } catch (error) {
        console.log('ERROR IN GET RECOMMENDED PRODUCTS CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}


export const getProductsByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        console.log('ERROR IN GET PRODUCTS BY CATEGORY CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}

export const toggleFeaturedProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log('ERROR IN TOGGLE FEATURED PRODUCT CONTROLLER ', error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean(); //get plain js instead of mongodb doc
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log('ERROR IN UPDATE FEATURED PRODUCTS CACHE ', error.message);
    }
}