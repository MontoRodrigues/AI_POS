

export const defaultConfig = {
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
    image_path: {
        category: "category",
        Product: "products",
        Purchase: "purchase"
    },
    nav: [
        { text: "Home", path: "/" },
        {
            text: "Products", subMenu: [
                { text: "Products", path: "/products" },
                { text: "Add Product", path: "/products/add_product" },
            ]
        },
        {
            text: "Purchase", subMenu: [
                { text: "Purchase", path: "/purchase" },
            ]
        },
        {
            text: "Master", subMenu: [
                { text: "Suppliers", path: "/supplier" },
                { text: "Category", path: "/category" },
                { text: "UOM", path: "/uom" },
                { text: "Brand", path: "/brand" },
                { text: "Sample Product", path: "/sample" }


            ]
        },


    ],
    collections: {
        "brand": { name: "brand" },
        "category": { name: "category" },
        "products": { name: "products" },
        "suppliers": { name: "suppliers" },
        "attribute": { name: "attributes" },
        "uom": { name: "uom" },
        "purchase": { name: "purchase" },
        "inventory": { name: "inventory" },
    }
}

// export class AppDefaultConfig {
//     default_images = {
//         category:
//         {
//             "downloadURL": "/images/default_category.png",
//             "fileName": "default_category.png",
//             "folder": "local"
//         },
//         product:
//         {
//             "downloadURL": "/images/product_default_image.jpg",
//             "fileName": "product_default_image.jpg",
//             "folder": "local"
//         }
//     };

//     image_path = {
//         category: "category",
//         Product: "products"
//     };

//     units = [

//         { "measure": "Each", "abbr": "EA", "type": "Basic" },
//         { "measure": "Piece", "abbr": "Pc", "type": "Basic" },
//         { "measure": "Pair", "abbr": "PR", "type": "Basic" },
//         { "measure": "Dozen", "abbr": "DZ", "type": "Basic" },
//         { "measure": "Gross", "abbr": "GR", "type": "Basic" },

//         { "measure": "Gram", "abbr": "g", "type": "Weight" },
//         { "measure": "Kilogram", "abbr": "kg", "type": "Weight" },
//         { "measure": "Milligram", "abbr": "mg", "type": "Weight" },
//         { "measure": "Pound", "abbr": "lb", "type": "Weight" },
//         { "measure": "Ounce", "abbr": "oz", "type": "Weight" },
//         { "measure": "Tonne", "abbr": "t", "type": "Weight" },

//         { "measure": "Milliliter", "abbr": "ml", "type": "Volume" },
//         { "measure": "Liter", "abbr": "L", "type": "Volume" },
//         { "measure": "Fluid Ounce", "abbr": "fl oz", "type": "Volume" },
//         { "measure": "Gallon", "abbr": "gal", "type": "Volume" },
//         { "measure": "Pint", "abbr": "pt", "type": "Volume" },
//         { "measure": "Quart", "abbr": "qt", "type": "Volume" },

//         { "measure": "Centimeter", "abbr": "cm", "type": "Length/Dimension" },
//         { "measure": "Meter", "abbr": "m", "type": "Length/Dimension" },
//         { "measure": "Inch", "abbr": "in", "type": "Length/Dimension" },
//         { "measure": "Foot", "abbr": "ft", "type": "Length/Dimension" },
//         { "measure": "Yard", "abbr": "yd", "type": "Length/Dimension" },

//         { "measure": "Pack", "abbr": "PK", "type": "Packaging" },
//         { "measure": "Case", "abbr": "CS", "type": "Packaging" },
//         { "measure": "Carton", "abbr": "CTN", "type": "Packaging" },
//         { "measure": "Crate", "abbr": "CRT", "type": "Packaging" },
//         { "measure": "Pallet", "abbr": "PLT", "type": "Packaging" },

//         { "measure": "Roll", "abbr": "RL", "type": "Specialized" },
//         { "measure": "Sheet", "abbr": "SHT", "type": "Specialized" },
//         { "measure": "Strip", "abbr": "STRP", "type": "Specialized" },
//         { "measure": "Blister Pack", "abbr": "BP", "type": "Specialized" },
//         { "measure": "Bundle", "abbr": "BDL", "type": "Specialized" },
//         { "measure": "Set", "abbr": "ST", "type": "Specialized" },

//         { "measure": "Size (XS/S/M/L/XL)", "abbr": "Size", "type": "Apparel" },
//         { "measure": "Numeric Size", "abbr": "NumSize", "type": "Apparel" },
//         { "measure": "Hanger", "abbr": "HNG", "type": "Apparel" },

//         { "measure": "Head", "abbr": "HD", "type": "Food/Produce" },
//         { "measure": "Bunch", "abbr": "BCH", "type": "Food/Produce" },
//         { "measure": "Slice", "abbr": "SLC", "type": "Food/Produce" },
//         { "measure": "Loaf", "abbr": "LF", "type": "Food/Produce" },
//         { "measure": "Stick", "abbr": "STK", "type": "Food/Produce" },
//         { "measure": "Can", "abbr": "CAN", "type": "Food/Produce" },
//         { "measure": "Jar", "abbr": "JAR", "type": "Food/Produce" },
//         { "measure": "Bottle", "abbr": "BTL", "type": "Food/Produce" },

//         { "measure": "Watt", "abbr": "W", "type": "Electronics" },
//         { "measure": "Kilowatt", "abbr": "kW", "type": "Electronics" },
//         { "measure": "Ampere", "abbr": "A", "type": "Electronics" },
//         { "measure": "Unit", "abbr": "U", "type": "Electronics" },
//         { "measure": "Set", "abbr": "ST", "type": "Electronics" },

//         { "measure": "Download", "abbr": "DL", "type": "Digital" },
//         { "measure": "License", "abbr": "LIC", "type": "Digital" },
//         { "measure": "User/Seat", "abbr": "USR", "type": "Digital" },
//         { "measure": "Month", "abbr": "MO", "type": "Digital" },
//         { "measure": "Year", "abbr": "YR", "type": "Digital" },

//         { "measure": "Stock Keeping Unit", "abbr": "SKU", "type": "Logistics" },
//         { "measure": "Case Pack Quantity", "abbr": "CPQ", "type": "Logistics" },
//         { "measure": "Inner Pack", "abbr": "IP", "type": "Logistics" },
//         { "measure": "Pallet Load", "abbr": "PL", "type": "Logistics" },
//         { "measure": "Cubic Foot", "abbr": "cu ft", "type": "Logistics" },
//         { "measure": "Cubic Meter", "abbr": "cu m", "type": "Logistics" }


//         // { value: 'pcs', text: "Piece" },
//         // { value: 'g', text: "grams" },
//         // { value: 'kg', text: "Kilogram" },
//         // { value: 'L', text: "Liters" },
//         // { value: 'ml', text: "Liters" },
//         // { value: 'M', text: "Meters" },
//         // { value: 'ft', text: "Feet" },
//         // { value: 'in', text: "Inches" }
//     ];
//     attribute = [
//         { "attribute": "Length", "valueExample": "cm, mm, inch, ft", "type": "Physical Dimensions" },
//         { "attribute": "Width", "valueExample": "cm, mm, inch, ft", "type": "Physical Dimensions" },
//         { "attribute": "Height", "valueExample": "cm, mm, inch, ft", "type": "Physical Dimensions" },
//         { "attribute": "Weight", "valueExample": "g, kg, lb, oz", "type": "Physical Dimensions" },
//         { "attribute": "Volume/Capacity", "valueExample": "ml, L, fl oz, gal", "type": "Physical Dimensions" },
//         { "attribute": "Thickness", "valueExample": "mm, inches", "type": "Physical Dimensions" },
//         { "attribute": "Diameter", "valueExample": "mm, cm, inch", "type": "Physical Dimensions" },
//         { "attribute": "Area/Coverage", "valueExample": "sq ft, sq m, yd²", "type": "Physical Dimensions" },

//         { "attribute": "Pack Size", "valueExample": "1 pc, 3-pack, 12-pack", "type": "Packaging Attributes" },
//         { "attribute": "Case Pack", "valueExample": "24 units per case", "type": "Packaging Attributes" },
//         { "attribute": "Inner Pack", "valueExample": "6 units per inner carton", "type": "Packaging Attributes" },
//         { "attribute": "Pallet Quantity", "valueExample": "48 cases per pallet", "type": "Packaging Attributes" },
//         { "attribute": "Net Content", "valueExample": "250 ml, 500 g", "type": "Packaging Attributes" },
//         { "attribute": "Gross Weight", "valueExample": "1.2 kg, 5 lb", "type": "Packaging Attributes" },

//         { "attribute": "Fabric Type", "valueExample": "cotton, polyester, wool, denim", "type": "Material/Composition" },
//         { "attribute": "Material", "valueExample": "plastic, metal, glass, paperboard", "type": "Material/Composition" },
//         { "attribute": "Blend Ratio", "valueExample": "80% cotton / 20% polyester", "type": "Material/Composition" },
//         { "attribute": "Finish", "valueExample": "matte, glossy, satin, brushed", "type": "Material/Composition" },
//         { "attribute": "Recyclability", "valueExample": "recyclable, compostable, biodegradable", "type": "Material/Composition" },

//         { "attribute": "Apparel Size", "valueExample": "XS, S, M, L, XL, XXL", "type": "Size & Fit" },
//         { "attribute": "Numeric Size", "valueExample": "2, 4, 6 (US); 36, 38 (EU)", "type": "Size & Fit" },
//         { "attribute": "Footwear Size", "valueExample": "US 9, EU 42, UK 8", "type": "Size & Fit" },
//         { "attribute": "Fit Type", "valueExample": "slim, regular, relaxed, skinny", "type": "Size & Fit" },
//         { "attribute": "Waist/Inseam", "valueExample": "32x34", "type": "Size & Fit" },
//         { "attribute": "Cup Size", "valueExample": "A, B, C, D, DD", "type": "Size & Fit" },
//         { "attribute": "Kids Size", "valueExample": "2T, 4Y, 6Y", "type": "Size & Fit" },

//         { "attribute": "Color", "valueExample": "red, blue, black, HEX code, Pantone", "type": "Color & Appearance" },
//         { "attribute": "Shade/Tone", "valueExample": "light, dark, pastel, neon", "type": "Color & Appearance" },
//         { "attribute": "Pattern", "valueExample": "striped, solid, floral, plaid", "type": "Color & Appearance" },
//         { "attribute": "Finish", "valueExample": "matte, glossy, metallic, pearlescent", "type": "Color & Appearance" },

//         { "attribute": "Shelf Life", "valueExample": "12 months, 30 days", "type": "Food & Grocery" },
//         { "attribute": "Storage Condition", "valueExample": "ambient, refrigerated, frozen", "type": "Food & Grocery" },
//         { "attribute": "Serving Size", "valueExample": "30 g, 200 ml", "type": "Food & Grocery" },
//         { "attribute": "Nutrition Values", "valueExample": "250 kcal, 10 g protein, 5 g sugar", "type": "Food & Grocery" },
//         { "attribute": "Dietary Tag", "valueExample": "organic, vegan, non-GMO, gluten-free", "type": "Food & Grocery" },
//         { "attribute": "Grade", "valueExample": "USDA Prime, AA Eggs, Fairtrade", "type": "Food & Grocery" },

//         { "attribute": "Power Rating", "valueExample": "100 W, 1.5 kW", "type": "Electronics & Appliances" },
//         { "attribute": "Battery Capacity", "valueExample": "4000 mAh, 10 Wh", "type": "Electronics & Appliances" },
//         { "attribute": "Screen Size", "valueExample": "6.5 inch, 55 inch", "type": "Electronics & Appliances" },
//         { "attribute": "Resolution", "valueExample": "1920x1080, 4K, 8K", "type": "Electronics & Appliances" },
//         { "attribute": "Memory/Storage", "valueExample": "64 GB, 1 TB", "type": "Electronics & Appliances" },
//         { "attribute": "Processor Speed", "valueExample": "2.5 GHz, 3.2 GHz", "type": "Electronics & Appliances" },
//         { "attribute": "Connectivity", "valueExample": "WiFi, Bluetooth, USB-C", "type": "Electronics & Appliances" },

//         { "attribute": "Dimensions", "valueExample": "LxWxH in cm/in", "type": "Furniture & Home" },
//         { "attribute": "Assembly Required", "valueExample": "Yes, No", "type": "Furniture & Home" },
//         { "attribute": "Weight Capacity", "valueExample": "100 kg, 250 lb", "type": "Furniture & Home" },
//         { "attribute": "Material", "valueExample": "wood, metal, glass", "type": "Furniture & Home" },
//         { "attribute": "Finish/Upholstery", "valueExample": "leather, fabric, PU coating", "type": "Furniture & Home" },

//         { "attribute": "Net Volume/Weight", "valueExample": "50 ml, 100 g, 1 oz", "type": "Cosmetics & Personal Care" },
//         { "attribute": "SPF Rating", "valueExample": "SPF 15, SPF 30, SPF 50", "type": "Cosmetics & Personal Care" },
//         { "attribute": "Fragrance/Flavor", "valueExample": "lavender, vanilla, citrus", "type": "Cosmetics & Personal Care" },
//         { "attribute": "Skin Type Suitability", "valueExample": "dry, oily, sensitive", "type": "Cosmetics & Personal Care" },
//         { "attribute": "Shade", "valueExample": "light beige, deep red, #C72C48", "type": "Cosmetics & Personal Care" },

//         { "attribute": "License Duration", "valueExample": "1 month, 1 year", "type": "Digital/Subscription" },
//         { "attribute": "Users/Seats", "valueExample": "1 user, 5 users", "type": "Digital/Subscription" },
//         { "attribute": "Download Size", "valueExample": "500 MB, 2 GB", "type": "Digital/Subscription" },
//         { "attribute": "Streaming Quality", "valueExample": "HD, Full HD, 4K, HDR", "type": "Digital/Subscription" },

//         { "attribute": "GTIN/UPC/EAN", "valueExample": "UPC: 012345678905", "type": "Logistics & Supply Chain" },
//         { "attribute": "SKU/Style Code", "valueExample": "SKU12345, Model X100", "type": "Logistics & Supply Chain" },
//         { "attribute": "Country of Origin", "valueExample": "Made in India, Made in USA", "type": "Logistics & Supply Chain" },
//         { "attribute": "Hazardous Classification", "valueExample": "Hazardous, Non-Hazardous", "type": "Logistics & Supply Chain" },
//         { "attribute": "Temperature Control", "valueExample": "2°C-8°C, -18°C frozen", "type": "Logistics & Supply Chain" }
//     ];
//     collections = {
//         "brand": { name: "brand" },
//         "category": { name: "category" },
//         "products": { name: "products" },
//         "suppliers": { name: "suppliers" },
//         "attribute": { name: "attribute_master" },
//         "uom": { name: "uom" },
//         "purchase": { name: "purchase" },

//     };

// }