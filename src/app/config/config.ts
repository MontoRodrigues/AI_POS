import { Product } from "../components/product/product";

export const appConfig = {
    default_images: {
        category:
        {
            "downloadURL": "/images/default_category.png",
            "fileName": "default_category.png",
            "folder": "local"
        },
        product:
        {
            "downloadURL": "/images/product_default_image.jpg",
            "fileName": "product_default_image.jpg",
            "folder": "local"
        }
    },
    units: [
        { value: 'pcs', text: "Piece" },
        { value: 'g', text: "grams" },
        { value: 'kg', text: "Kilogram" },
        { value: 'L', text: "Liters" },
        { value: 'ml', text: "Liters" },
        { value: 'M', text: "Meters" },
        { value: 'ft', text: "Feet" },
        { value: 'in', text: "Inches" }
    ],

    collections: {
        "brand": { name: "brand" },
        "category": { name: "category" },
        "products": { name: "products" },
        "suppliers": { name: "suppliers" },
        "attribute":{name:"attribute_master"}
    }
}

export class AppDefaultConfig {
    default_images = {
        category:
        {
            "downloadURL": "/images/default_category.png",
            "fileName": "default_category.png",
            "folder": "local"
        },
        product:
        {
            "downloadURL": "/images/product_default_image.jpg",
            "fileName": "product_default_image.jpg",
            "folder": "local"
        }
    };

    image_path ={
        category:"category",
        Product:"products"
    };

    units = [
        { value: 'pcs', text: "Piece" },
        { value: 'g', text: "grams" },
        { value: 'kg', text: "Kilogram" },
        { value: 'L', text: "Liters" },
        { value: 'ml', text: "Liters" },
        { value: 'M', text: "Meters" },
        { value: 'ft', text: "Feet" },
        { value: 'in', text: "Inches" }
    ];

    collections = {
        "brand": { name: "brand" },
        "category": { name: "category" },
        "products": { name: "products" },
        "suppliers": { name: "suppliers" },
        "attribute": { name: "attribute_master" },

        
    };

}