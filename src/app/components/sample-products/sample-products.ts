import { Component } from '@angular/core';
import { Breadcrumb } from '../shared/breadcrumb/breadcrumb';

let product =[
  {
    "sku": "ORD-NIA-001",
    "barcode": "769915190311",
    "name": "The Ordinary Niacinamide 10% + Zinc 1%",
    "slug": "the-ordinary-niacinamide-10-zinc-1",
    "brand": "The Ordinary",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Blemish Control"]
    },
    "uom": "30ml",
    "searchTokens": ["ordinary", "niacinamide", "zinc", "serum", "blemish", "pores", "skincare"],
    "attributes": [
      { "attribute": "Skin Type", "value": "Oily/Combination" },
      { "attribute": "Main Ingredient", "value": "Niacinamide" }
    ]
  },
  {
    "sku": "CRV-HFC-002",
    "barcode": "3606000537453",
    "name": "CeraVe Hydrating Facial Cleanser",
    "slug": "cerave-hydrating-facial-cleanser",
    "brand": "CeraVe",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-CLEAN"],
      "path": ["Skincare", "Cleansers", "Face Wash"]
    },
    "uom": "355ml",
    "searchTokens": ["cerave", "hydrating", "cleanser", "face wash", "dry skin", "ceramides"],
    "attributes": [
      { "attribute": "Skin Type", "value": "Normal to Dry" },
      { "attribute": "Formulation", "value": "Lotion" }
    ]
  },
  {
    "sku": "MAC-RUBY-003",
    "barcode": "773602048564",
    "name": "MAC Retro Matte Lipstick - Ruby Woo",
    "slug": "mac-retro-matte-lipstick-ruby-woo",
    "brand": "MAC Cosmetics",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-LIPS"],
      "path": ["Makeup", "Lips", "Lipstick"]
    },
    "uom": "3g",
    "searchTokens": ["mac", "ruby woo", "lipstick", "red", "matte", "makeup"],
    "attributes": [
      { "attribute": "Finish", "value": "Matte" },
      { "attribute": "Color", "value": "Red" }
    ]
  },
  {
    "sku": "MAY-LASH-004",
    "barcode": "041554409292",
    "name": "Maybelline Lash Sensational Mascara",
    "slug": "maybelline-lash-sensational-mascara",
    "brand": "Maybelline",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-EYES"],
      "path": ["Makeup", "Eyes", "Mascara"]
    },
    "uom": "9.5ml",
    "searchTokens": ["maybelline", "lash sensational", "mascara", "eyes", "volume", "black"],
    "attributes": [
      { "attribute": "Color", "value": "Very Black" },
      { "attribute": "Waterproof", "value": "No" }
    ]
  },
  {
    "sku": "OLA-NO3-005",
    "barcode": "896364002350",
    "name": "Olaplex No. 3 Hair Perfector",
    "slug": "olaplex-no-3-hair-perfector",
    "brand": "Olaplex",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-TREAT"],
      "path": ["Haircare", "Treatments", "Bond Builder"]
    },
    "uom": "100ml",
    "searchTokens": ["olaplex", "no 3", "hair perfector", "repair", "damaged hair", "treatment"],
    "attributes": [
      { "attribute": "Hair Type", "value": "All Types" },
      { "attribute": "Benefit", "value": "Repair" }
    ]
  },
  {
    "sku": "LRP-ANT-006",
    "barcode": "3337875546409",
    "name": "La Roche-Posay Anthelios Melt-in Milk Sunscreen SPF 60",
    "slug": "la-roche-posay-anthelios-melt-in-milk-spf-60",
    "brand": "La Roche-Posay",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SUN"],
      "path": ["Skincare", "Sunscreen", "Body & Face"]
    },
    "uom": "150ml",
    "searchTokens": ["la roche posay", "anthelios", "sunscreen", "spf 60", "sun protection", "melt-in milk"],
    "attributes": [
      { "attribute": "SPF", "value": 60 },
      { "attribute": "Water Resistant", "value": "80 mins" }
    ]
  },
  {
    "sku": "CT-PIL-007",
    "barcode": "5060332329227",
    "name": "Charlotte Tilbury Pillow Talk Original Lipstick",
    "slug": "charlotte-tilbury-pillow-talk-original",
    "brand": "Charlotte Tilbury",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-LIPS"],
      "path": ["Makeup", "Lips", "Lipstick"]
    },
    "uom": "3.5g",
    "searchTokens": ["charlotte tilbury", "pillow talk", "lipstick", "nude", "matte", "luxury"],
    "attributes": [
      { "attribute": "Finish", "value": "Matte" },
      { "attribute": "Shade", "value": "Nude Pink" }
    ]
  },
  {
    "sku": "FEN-GLO-008",
    "barcode": "810763030095",
    "name": "Fenty Beauty Gloss Bomb Universal Lip Luminizer",
    "slug": "fenty-beauty-gloss-bomb-fenty-glow",
    "brand": "Fenty Beauty",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-LIPS"],
      "path": ["Makeup", "Lips", "Lip Gloss"]
    },
    "uom": "9ml",
    "searchTokens": ["fenty", "gloss bomb", "lip gloss", "rihanna", "shimmer", "fenty glow"],
    "attributes": [
      { "attribute": "Shade", "value": "Fenty Glow" },
      { "attribute": "Finish", "value": "High Shine" }
    ]
  },
  {
    "sku": "EST-ANR-009",
    "barcode": "887167485488",
    "name": "Estée Lauder Advanced Night Repair Serum",
    "slug": "estee-lauder-advanced-night-repair",
    "brand": "Estée Lauder",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Anti-Aging"]
    },
    "uom": "50ml",
    "searchTokens": ["estee lauder", "anr", "advanced night repair", "serum", "anti-aging", "night"],
    "attributes": [
      { "attribute": "Concern", "value": "Fine Lines" },
      { "attribute": "Time of Use", "value": "Night" }
    ]
  },
  {
    "sku": "CHA-NO5-010",
    "barcode": "3145891255300",
    "name": "Chanel No. 5 Eau de Parfum",
    "slug": "chanel-no-5-eau-de-parfum",
    "brand": "Chanel",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-WOMEN"],
      "path": ["Fragrance", "Women", "Perfume"]
    },
    "uom": "100ml",
    "searchTokens": ["chanel", "no 5", "perfume", "fragrance", "luxury", "scent"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Floral Aldehyde" },
      { "attribute": "Concentration", "value": "Eau de Parfum" }
    ]
  },
  {
    "sku": "NAR-ORG-011",
    "barcode": "607845040132",
    "name": "NARS Blush - Orgasm",
    "slug": "nars-blush-orgasm",
    "brand": "NARS",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Blush"]
    },
    "uom": "4.8g",
    "searchTokens": ["nars", "blush", "orgasm", "cheek", "pink", "shimmer"],
    "attributes": [
      { "attribute": "Finish", "value": "Shimmer" },
      { "attribute": "Color", "value": "Peachy Pink" }
    ]
  },
  {
    "sku": "LANE-SLP-012",
    "barcode": "8809643068994",
    "name": "Laneige Lip Sleeping Mask - Berry",
    "slug": "laneige-lip-sleeping-mask-berry",
    "brand": "Laneige",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-LIPS"],
      "path": ["Skincare", "Lip Care", "Masks"]
    },
    "uom": "20g",
    "searchTokens": ["laneige", "lip mask", "sleeping mask", "berry", "hydration", "lips"],
    "attributes": [
      { "attribute": "Flavor", "value": "Berry" },
      { "attribute": "Concern", "value": "Dry Lips" }
    ]
  },
  {
    "sku": "DIO-SAV-013",
    "barcode": "3348901291315",
    "name": "Dior Sauvage Eau de Toilette",
    "slug": "dior-sauvage-eau-de-toilette",
    "brand": "Dior",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-MEN"],
      "path": ["Fragrance", "Men", "Cologne"]
    },
    "uom": "100ml",
    "searchTokens": ["dior", "sauvage", "cologne", "fragrance", "men", "fresh"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Fresh Spicy" },
      { "attribute": "Concentration", "value": "Eau de Toilette" }
    ]
  },
  {
    "sku": "TFA-BTS-014",
    "barcode": "651986701358",
    "name": "Too Faced Better Than Sex Mascara",
    "slug": "too-faced-better-than-sex-mascara",
    "brand": "Too Faced",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-EYES"],
      "path": ["Makeup", "Eyes", "Mascara"]
    },
    "uom": "8ml",
    "searchTokens": ["too faced", "better than sex", "mascara", "volume", "black", "lashes"],
    "attributes": [
      { "attribute": "Benefit", "value": "Volumizing" },
      { "attribute": "Brush Type", "value": "Hourglass" }
    ]
  },
  {
    "sku": "PAU-BHA-015",
    "barcode": "0655439000000",
    "name": "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant",
    "slug": "paulas-choice-2-bha-liquid-exfoliant",
    "brand": "Paula's Choice",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-EXFOL"],
      "path": ["Skincare", "Exfoliators", "Toners"]
    },
    "uom": "118ml",
    "searchTokens": ["paula's choice", "bha", "exfoliant", "salicylic acid", "pores", "blackheads"],
    "attributes": [
      { "attribute": "Active Ingredient", "value": "Salicylic Acid" },
      { "attribute": "Skin Type", "value": "Oily/Combination" }
    ]
  },
  {
    "sku": "RED-ALL-016",
    "barcode": "884486228308",
    "name": "Redken All Soft Shampoo",
    "slug": "redken-all-soft-shampoo",
    "brand": "Redken",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-WASH"],
      "path": ["Haircare", "Shampoo", "Hydrating"]
    },
    "uom": "300ml",
    "searchTokens": ["redken", "all soft", "shampoo", "argan oil", "dry hair", "softness"],
    "attributes": [
      { "attribute": "Key Ingredient", "value": "Argan Oil" },
      { "attribute": "Hair Concern", "value": "Dry/Brittle" }
    ]
  },
  {
    "sku": "ANA-BRO-017",
    "barcode": "689304050016",
    "name": "Anastasia Beverly Hills Brow Wiz",
    "slug": "anastasia-beverly-hills-brow-wiz",
    "brand": "Anastasia Beverly Hills",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-BROWS"],
      "path": ["Makeup", "Eyebrows", "Pencil"]
    },
    "uom": "0.085g",
    "searchTokens": ["abh", "anastasia", "brow wiz", "eyebrow", "pencil", "precision"],
    "attributes": [
      { "attribute": "Type", "value": "Pencil" },
      { "attribute": "Shade", "value": "Medium Brown" }
    ]
  },
  {
    "sku": "CLI-DML-018",
    "barcode": "020714007624",
    "name": "Clinique Dramatically Different Moisturizing Lotion+",
    "slug": "clinique-dramatically-different-lotion",
    "brand": "Clinique",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-MOIST"],
      "path": ["Skincare", "Moisturizers", "Face"]
    },
    "uom": "125ml",
    "searchTokens": ["clinique", "dramatically different", "moisturizer", "yellow lotion", "hydration", "face"],
    "attributes": [
      { "attribute": "Skin Type", "value": "Dry to Very Dry" },
      { "attribute": "Texture", "value": "Lotion" }
    ]
  },
  {
    "sku": "URA-GLO-019",
    "barcode": "850004512345",
    "name": "Urban Decay All Nighter Setting Spray",
    "slug": "urban-decay-all-nighter-setting-spray",
    "brand": "Urban Decay",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-SET"],
      "path": ["Makeup", "Face", "Setting Spray"]
    },
    "uom": "118ml",
    "searchTokens": ["urban decay", "all nighter", "setting spray", "makeup", "long lasting", "setting"],
    "attributes": [
      { "attribute": "Finish", "value": "Natural" },
      { "attribute": "Duration", "value": "16 Hour" }
    ]
  },
  {
    "sku": "MOR-OIL-020",
    "barcode": "7290011521011",
    "name": "Moroccanoil Treatment",
    "slug": "moroccanoil-treatment-original",
    "brand": "Moroccanoil",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-OIL"],
      "path": ["Haircare", "Treatment", "Hair Oil"]
    },
    "uom": "100ml",
    "searchTokens": ["moroccanoil", "argan oil", "hair treatment", "shine", "frizz", "oil"],
    "attributes": [
      { "attribute": "Hair Type", "value": "All Types" },
      { "attribute": "Ingredient", "value": "Argan Oil" }
    ]
  },
  {
    "sku": "TAR-SHA-021",
    "barcode": "846733005549",
    "name": "Tarte Shape Tape Contour Concealer",
    "slug": "tarte-shape-tape-concealer",
    "brand": "Tarte",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Concealer"]
    },
    "uom": "10ml",
    "searchTokens": ["tarte", "shape tape", "concealer", "full coverage", "matte", "contour"],
    "attributes": [
      { "attribute": "Coverage", "value": "Full" },
      { "attribute": "Finish", "value": "Matte" }
    ]
  },
  {
    "sku": "YSL-LIB-022",
    "barcode": "3614272648418",
    "name": "Yves Saint Laurent Libre Eau de Parfum",
    "slug": "ysl-libre-eau-de-parfum",
    "brand": "Yves Saint Laurent",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-WOMEN"],
      "path": ["Fragrance", "Women", "Perfume"]
    },
    "uom": "50ml",
    "searchTokens": ["ysl", "libre", "perfume", "fragrance", "lavender", "orange blossom"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Floral" },
      { "attribute": "Key Note", "value": "Lavender" }
    ]
  },
  {
    "sku": "GLO-CLD-023",
    "barcode": "816507020300",
    "name": "Glossier Cloud Paint",
    "slug": "glossier-cloud-paint-puff",
    "brand": "Glossier",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-CHEEK"],
      "path": ["Makeup", "Face", "Blush"]
    },
    "uom": "10ml",
    "searchTokens": ["glossier", "cloud paint", "blush", "gel-cream", "cheek", "puff"],
    "attributes": [
      { "attribute": "Formula", "value": "Gel-Cream" },
      { "attribute": "Shade", "value": "Puff" }
    ]
  },
  {
    "sku": "KIE-UFC-024",
    "barcode": "3605970360759",
    "name": "Kiehl's Ultra Facial Cream",
    "slug": "kiehls-ultra-facial-cream",
    "brand": "Kiehl's",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-MOIST"],
      "path": ["Skincare", "Moisturizers", "Face Cream"]
    },
    "uom": "50ml",
    "searchTokens": ["kiehls", "ultra facial cream", "moisturizer", "hydration", "squalane", "face"],
    "attributes": [
      { "attribute": "Skin Type", "value": "All Skin Types" },
      { "attribute": "Ingredient", "value": "Squalane" }
    ]
  },
  {
    "sku": "BEN-HUL-025",
    "barcode": "602004037563",
    "name": "Benefit Hoola Matte Bronzer",
    "slug": "benefit-hoola-matte-bronzer",
    "brand": "Benefit Cosmetics",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Bronzer"]
    },
    "uom": "8g",
    "searchTokens": ["benefit", "hoola", "bronzer", "matte", "contour", "face"],
    "attributes": [
      { "attribute": "Finish", "value": "Matte" },
      { "attribute": "Shade", "value": "Hoola" }
    ]
  },
  {
    "sku": "LMA-CRM-026",
    "barcode": "747930000013",
    "name": "La Mer Crème de la Mer",
    "slug": "la-mer-creme-de-la-mer",
    "brand": "La Mer",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-LUX"],
      "path": ["Skincare", "Moisturizers", "Luxury"]
    },
    "uom": "60ml",
    "searchTokens": ["la mer", "creme de la mer", "luxury", "moisturizer", "miracle broth", "anti-aging"],
    "attributes": [
      { "attribute": "Texture", "value": "Rich Cream" },
      { "attribute": "Concern", "value": "Dryness" }
    ]
  },
  {
    "sku": "HER-TER-027",
    "barcode": "3346131400003",
    "name": "Hermès Terre d'Hermès Eau de Toilette",
    "slug": "hermes-terre-d-hermes",
    "brand": "Hermès",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-MEN"],
      "path": ["Fragrance", "Men", "Cologne"]
    },
    "uom": "100ml",
    "searchTokens": ["hermes", "terre d'hermes", "cologne", "men", "woody", "spicy"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Woody Spicy" },
      { "attribute": "Key Note", "value": "Orange" }
    ]
  },
  {
    "sku": "SKI-ESS-028",
    "barcode": "4979006067540",
    "name": "SK-II Facial Treatment Essence",
    "slug": "sk-ii-facial-treatment-essence",
    "brand": "SK-II",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-ESS"],
      "path": ["Skincare", "Treatments", "Essence"]
    },
    "uom": "160ml",
    "searchTokens": ["sk-ii", "pitera", "essence", "anti-aging", "radiance", "japanese skincare"],
    "attributes": [
      { "attribute": "Key Ingredient", "value": "Pitera" },
      { "attribute": "Benefit", "value": "Radiance" }
    ]
  },
  {
    "sku": "HDA-ROS-029",
    "barcode": "6291106031536",
    "name": "Huda Beauty Rose Gold Remastered Palette",
    "slug": "huda-beauty-rose-gold-palette",
    "brand": "Huda Beauty",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-EYES"],
      "path": ["Makeup", "Eyes", "Eyeshadow Palette"]
    },
    "uom": "16.6g",
    "searchTokens": ["huda beauty", "rose gold", "palette", "eyeshadow", "shimmer", "matte"],
    "attributes": [
      { "attribute": "Finish", "value": "Mixed" },
      { "attribute": "Shades", "value": 18 }
    ]
  },
  {
    "sku": "BUM-BRA-030",
    "barcode": "851604006000",
    "name": "Sol de Janeiro Brazilian Bum Bum Cream",
    "slug": "sol-de-janeiro-brazilian-bum-bum-cream",
    "brand": "Sol de Janeiro",
    "categories": {
      "categoryIds": ["CAT-BODY", "CAT-MOIST"],
      "path": ["Body Care", "Moisturizers", "Body Cream"]
    },
    "uom": "240ml",
    "searchTokens": ["sol de janeiro", "bum bum cream", "body cream", "firming", "pistachio", "salted caramel"],
    "attributes": [
      { "attribute": "Scent", "value": "Cheirosa 62" },
      { "attribute": "Benefit", "value": "Tightening" }
    ]
  },
  {
    "sku": "FRE-SOY-031",
    "barcode": "809280112444",
    "name": "Fresh Soy Face Cleanser",
    "slug": "fresh-soy-face-cleanser",
    "brand": "Fresh",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-CLEAN"],
      "path": ["Skincare", "Cleansers", "Face Wash"]
    },
    "uom": "150ml",
    "searchTokens": ["fresh", "soy cleanser", "face wash", "gentle", "makeup remover", "sensitive"],
    "attributes": [
      { "attribute": "Ingredient", "value": "Soy Proteins" },
      { "attribute": "Skin Type", "value": "Sensitive" }
    ]
  },
  {
    "sku": "LIV-PRF-032",
    "barcode": "815305023259",
    "name": "Living Proof Perfect Hair Day Dry Shampoo",
    "slug": "living-proof-phd-dry-shampoo",
    "brand": "Living Proof",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-STYL"],
      "path": ["Haircare", "Styling", "Dry Shampoo"]
    },
    "uom": "198ml",
    "searchTokens": ["living proof", "phd", "dry shampoo", "clean hair", "volume", "oil absorption"],
    "attributes": [
      { "attribute": "Benefit", "value": "Cleans Hair" },
      { "attribute": "Hair Type", "value": "Oily" }
    ]
  },
  {
    "sku": "DRJ-CIC-033",
    "barcode": "8809535805541",
    "name": "Dr. Jart+ Cicapair Tiger Grass Color Correcting Treatment",
    "slug": "dr-jart-cicapair-color-correcting-treatment",
    "brand": "Dr. Jart+",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-TREAT"],
      "path": ["Skincare", "Treatments", "Redness"]
    },
    "uom": "50ml",
    "searchTokens": ["dr jart", "cicapair", "color correcting", "redness", "tiger grass", "cica"],
    "attributes": [
      { "attribute": "Concern", "value": "Redness" },
      { "attribute": "SPF", "value": 30 }
    ]
  },
  {
    "sku": "PAT-MAT-034",
    "barcode": "843004100523",
    "name": "Pat McGrath Labs MatteTrance Lipstick - Flesh 3",
    "slug": "pat-mcgrath-mattetrance-flesh-3",
    "brand": "Pat McGrath Labs",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-LIPS"],
      "path": ["Makeup", "Lips", "Lipstick"]
    },
    "uom": "4g",
    "searchTokens": ["pat mcgrath", "mattetrance", "lipstick", "flesh 3", "luxury", "matte"],
    "attributes": [
      { "attribute": "Finish", "value": "Powder Matte" },
      { "attribute": "Pigment", "value": "High" }
    ]
  },
  {
    "sku": "GIO-AQU-035",
    "barcode": "3360372058861",
    "name": "Giorgio Armani Acqua Di Gio Pour Homme",
    "slug": "armani-acqua-di-gio-homme",
    "brand": "Giorgio Armani",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-MEN"],
      "path": ["Fragrance", "Men", "Cologne"]
    },
    "uom": "100ml",
    "searchTokens": ["armani", "acqua di gio", "cologne", "marine", "fresh", "men"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Aquatic" },
      { "attribute": "Note", "value": "Marine Notes" }
    ]
  },
  {
    "sku": "BRI-DON-036",
    "barcode": "766293141235",
    "name": "Briogeo Don't Despair, Repair! Deep Conditioning Mask",
    "slug": "briogeo-dont-despair-repair-mask",
    "brand": "Briogeo",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-MASK"],
      "path": ["Haircare", "Treatments", "Hair Mask"]
    },
    "uom": "236ml",
    "searchTokens": ["briogeo", "hair mask", "deep conditioner", "repair", "clean beauty", "damaged hair"],
    "attributes": [
      { "attribute": "Hair Type", "value": "Damaged" },
      { "attribute": "Free From", "value": "Sulfates" }
    ]
  },
  {
    "sku": "COS-SNA-037",
    "barcode": "8809416470009",
    "name": "COSRX Advanced Snail 96 Mucin Power Essence",
    "slug": "cosrx-advanced-snail-96-mucin",
    "brand": "COSRX",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-ESS"],
      "path": ["Skincare", "Treatments", "Essence"]
    },
    "uom": "100ml",
    "searchTokens": ["cosrx", "snail mucin", "essence", "hydration", "korean skincare", "repair"],
    "attributes": [
      { "attribute": "Key Ingredient", "value": "Snail Secretion Filtrate" },
      { "attribute": "Benefit", "value": "Hydration" }
    ]
  },
  {
    "sku": "DYSO-AIR-038",
    "barcode": "5025155041797",
    "name": "Dyson Airwrap Multi-Styler",
    "slug": "dyson-airwrap-multi-styler",
    "brand": "Dyson",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-TOOLS"],
      "path": ["Haircare", "Tools", "Styling Tools"]
    },
    "uom": "1 Unit",
    "searchTokens": ["dyson", "airwrap", "hair tool", "curler", "styler", "blowout"],
    "attributes": [
      { "attribute": "Technology", "value": "Coanda Airflow" },
      { "attribute": "Color", "value": "Nickel/Copper" }
    ]
  },
  {
    "sku": "LAU-MER-039",
    "barcode": "736150000316",
    "name": "Laura Mercier Translucent Loose Setting Powder",
    "slug": "laura-mercier-translucent-loose-setting-powder",
    "brand": "Laura Mercier",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Powder"]
    },
    "uom": "29g",
    "searchTokens": ["laura mercier", "setting powder", "translucent", "baking", "face", "makeup"],
    "attributes": [
      { "attribute": "Finish", "value": "Matte" },
      { "attribute": "Shade", "value": "Translucent" }
    ]
  },
  {
    "sku": "SUND-RIL-040",
    "barcode": "850001312356",
    "name": "Sunday Riley Good Genes All-In-One Lactic Acid Treatment",
    "slug": "sunday-riley-good-genes",
    "brand": "Sunday Riley",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Treatments", "Exfoliator"]
    },
    "uom": "30ml",
    "searchTokens": ["sunday riley", "good genes", "lactic acid", "serum", "exfoliation", "brightening"],
    "attributes": [
      { "attribute": "Active", "value": "Lactic Acid" },
      { "attribute": "Benefit", "value": "Brightening" }
    ]
  },
  {
    "sku": "OUA-DET-041",
    "barcode": "815402025001",
    "name": "OUAI Detangling Leave-In Conditioner",
    "slug": "ouai-leave-in-conditioner",
    "brand": "OUAI",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-COND"],
      "path": ["Haircare", "Conditioner", "Leave-In"]
    },
    "uom": "140ml",
    "searchTokens": ["ouai", "leave-in", "conditioner", "detangler", "heat protection", "hair"],
    "attributes": [
      { "attribute": "Scent", "value": "North Bondi" },
      { "attribute": "Benefit", "value": "Heat Protection" }
    ]
  },
  {
    "sku": "VIC-FLO-042",
    "barcode": "871963810015",
    "name": "Viktor&Rolf Flowerbomb Eau de Parfum",
    "slug": "viktor-rolf-flowerbomb",
    "brand": "Viktor&Rolf",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-WOMEN"],
      "path": ["Fragrance", "Women", "Perfume"]
    },
    "uom": "50ml",
    "searchTokens": ["viktor&rolf", "flowerbomb", "perfume", "floral", "sweet", "patchouli"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Floral Oriental" },
      { "attribute": "Notes", "value": "Jasmine, Rose" }
    ]
  },
  {
    "sku": "HOUR-AMB-043",
    "barcode": "877231000123",
    "name": "Hourglass Ambient Lighting Powder - Dim Light",
    "slug": "hourglass-ambient-lighting-powder-dim-light",
    "brand": "Hourglass",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Finishing Powder"]
    },
    "uom": "10g",
    "searchTokens": ["hourglass", "ambient lighting", "powder", "dim light", "glow", "finishing"],
    "attributes": [
      { "attribute": "Finish", "value": "Radiant" },
      { "attribute": "Effect", "value": "Blurring" }
    ]
  },
  {
    "sku": "YOUTH-SUP-044",
    "barcode": "810834030101",
    "name": "Youth to the People Superfood Cleanser",
    "slug": "youth-to-the-people-superfood-cleanser",
    "brand": "Youth to the People",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-CLEAN"],
      "path": ["Skincare", "Cleansers", "Face Wash"]
    },
    "uom": "237ml",
    "searchTokens": ["yttp", "youth to the people", "superfood", "cleanser", "kale", "spinach"],
    "attributes": [
      { "attribute": "Ingredient", "value": "Kale & Spinach" },
      { "attribute": "Skin Type", "value": "Oily/Combo" }
    ]
  },
  {
    "sku": "KER-ELI-045",
    "barcode": "3474630640924",
    "name": "Kérastase Elixir Ultime L'Huile Original Hair Oil",
    "slug": "kerastase-elixir-ultime-oil",
    "brand": "Kérastase",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-OIL"],
      "path": ["Haircare", "Treatment", "Hair Oil"]
    },
    "uom": "100ml",
    "searchTokens": ["kerastase", "elixir ultime", "hair oil", "shine", "frizz control", "luxury hair"],
    "attributes": [
      { "attribute": "Hair Concern", "value": "Dullness" },
      { "attribute": "Ingredient", "value": "Marula Oil" }
    ]
  },
  {
    "sku": "TOM-BLK-046",
    "barcode": "888066000980",
    "name": "Tom Ford Black Orchid Eau de Parfum",
    "slug": "tom-ford-black-orchid",
    "brand": "Tom Ford",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-UNI"],
      "path": ["Fragrance", "Unisex", "Perfume"]
    },
    "uom": "50ml",
    "searchTokens": ["tom ford", "black orchid", "perfume", "unisex", "luxury", "dark floral"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Warm Floral" },
      { "attribute": "Key Note", "value": "Black Truffle" }
    ]
  },
  {
    "sku": "MIL-HYD-047",
    "barcode": "810003000505",
    "name": "Milk Makeup Hydro Grip Primer",
    "slug": "milk-makeup-hydro-grip-primer",
    "brand": "Milk Makeup",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Primer"]
    },
    "uom": "45ml",
    "searchTokens": ["milk makeup", "hydro grip", "primer", "gripping", "hydration", "base"],
    "attributes": [
      { "attribute": "Finish", "value": "Dewy" },
      { "attribute": "Ingredient", "value": "Blue Agave" }
    ]
  },
  {
    "sku": "TATC-WAT-048",
    "barcode": "752830761204",
    "name": "Tatcha The Water Cream",
    "slug": "tatcha-the-water-cream",
    "brand": "Tatcha",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-MOIST"],
      "path": ["Skincare", "Moisturizers", "Face Cream"]
    },
    "uom": "50ml",
    "searchTokens": ["tatcha", "water cream", "moisturizer", "oil-free", "pores", "japanese skincare"],
    "attributes": [
      { "attribute": "Skin Type", "value": "Oily/Combo" },
      { "attribute": "Texture", "value": "Water-Gel" }
    ]
  },
  {
    "sku": "KVD-TAT-049",
    "barcode": "811999000010",
    "name": "KVD Beauty Tattoo Liner - Trooper Black",
    "slug": "kvd-tattoo-liner-trooper",
    "brand": "KVD Beauty",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-EYES"],
      "path": ["Makeup", "Eyes", "Eyeliner"]
    },
    "uom": "0.55ml",
    "searchTokens": ["kvd", "tattoo liner", "eyeliner", "liquid liner", "waterproof", "trooper black"],
    "attributes": [
      { "attribute": "Type", "value": "Liquid" },
      { "attribute": "Color", "value": "Satin Black" }
    ]
  },
  {
    "sku": "JO-PEAR-050",
    "barcode": "690251020308",
    "name": "Jo Malone English Pear & Freesia Cologne",
    "slug": "jo-malone-english-pear-freesia",
    "brand": "Jo Malone London",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-WOMEN"],
      "path": ["Fragrance", "Women", "Cologne"]
    },
    "uom": "100ml",
    "searchTokens": ["jo malone", "english pear", "freesia", "cologne", "floral", "fruity"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Fruity Floral" },
      { "attribute": "Note", "value": "King William Pear" }
    ]
  },
  {
    "sku": "ELE-PRO-051",
    "barcode": "641628002525",
    "name": "Elemis Pro-Collagen Cleansing Balm",
    "slug": "elemis-pro-collagen-cleansing-balm",
    "brand": "Elemis",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-CLEAN"],
      "path": ["Skincare", "Cleansers", "Balm"]
    },
    "uom": "100g",
    "searchTokens": ["elemis", "cleansing balm", "pro-collagen", "makeup remover", "spa", "anti-aging"],
    "attributes": [
      { "attribute": "Texture", "value": "Balm to Oil" },
      { "attribute": "Scent", "value": "Rose & Mimosa" }
    ]
  },
  {
    "sku": "GIV-PRI-052",
    "barcode": "3274872275525",
    "name": "Givenchy Prisme Libre Loose Powder",
    "slug": "givenchy-prisme-libre-powder",
    "brand": "Givenchy",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Powder"]
    },
    "uom": "12g",
    "searchTokens": ["givenchy", "prisme libre", "powder", "color correct", "setting", "luxury"],
    "attributes": [
      { "attribute": "Finish", "value": "Matte" },
      { "attribute": "Effect", "value": "Color Correcting" }
    ]
  },
  {
    "sku": "AMA-BOD-053",
    "barcode": "855909000100",
    "name": "Amika Perk Up Dry Shampoo",
    "slug": "amika-perk-up-dry-shampoo",
    "brand": "Amika",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-STYL"],
      "path": ["Haircare", "Styling", "Dry Shampoo"]
    },
    "uom": "232ml",
    "searchTokens": ["amika", "perk up", "dry shampoo", "volume", "talc-free", "sea buckthorn"],
    "attributes": [
      { "attribute": "Feature", "value": "No White Cast" },
      { "attribute": "Scent", "value": "Signature" }
    ]
  },
  {
    "sku": "CLAR-LIP-054",
    "barcode": "3380810148408",
    "name": "Clarins Lip Comfort Oil",
    "slug": "clarins-lip-comfort-oil",
    "brand": "Clarins",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-LIPS"],
      "path": ["Makeup", "Lips", "Lip Oil"]
    },
    "uom": "7ml",
    "searchTokens": ["clarins", "lip oil", "hydration", "honey", "shine", "gloss"],
    "attributes": [
      { "attribute": "Finish", "value": "High Shine" },
      { "attribute": "Benefit", "value": "Nourishing" }
    ]
  },
  {
    "sku": "BYR-GYP-055",
    "barcode": "7340032806014",
    "name": "Byredo Gypsy Water Eau de Parfum",
    "slug": "byredo-gypsy-water",
    "brand": "Byredo",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-UNI"],
      "path": ["Fragrance", "Unisex", "Perfume"]
    },
    "uom": "50ml",
    "searchTokens": ["byredo", "gypsy water", "perfume", "niche", "woody", "vanilla"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Woody Aromatic" },
      { "attribute": "Notes", "value": "Pine, Sandalwood" }
    ]
  },
  {
    "sku": "RARE-BLU-056",
    "barcode": "840122900019",
    "name": "Rare Beauty Soft Pinch Liquid Blush",
    "slug": "rare-beauty-liquid-blush-joy",
    "brand": "Rare Beauty",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Blush"]
    },
    "uom": "7.5ml",
    "searchTokens": ["rare beauty", "selena gomez", "liquid blush", "soft pinch", "joy", "dewy"],
    "attributes": [
      { "attribute": "Finish", "value": "Dewy" },
      { "attribute": "Shade", "value": "Joy" }
    ]
  },
  {
    "sku": "BIO-MIC-057",
    "barcode": "3401345935571",
    "name": "Bioderma Sensibio H2O Micellar Water",
    "slug": "bioderma-sensibio-h2o",
    "brand": "Bioderma",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-CLEAN"],
      "path": ["Skincare", "Cleansers", "Makeup Remover"]
    },
    "uom": "500ml",
    "searchTokens": ["bioderma", "micellar water", "sensibio", "makeup remover", "sensitive skin", "cleanser"],
    "attributes": [
      { "attribute": "Skin Type", "value": "Sensitive" },
      { "attribute": "Formulation", "value": "Liquid" }
    ]
  },
  {
    "sku": "CHA-TIL-058",
    "barcode": "5060332320002",
    "name": "Charlotte Tilbury Hollywood Flawless Filter",
    "slug": "charlotte-tilbury-flawless-filter",
    "brand": "Charlotte Tilbury",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Highlighter"]
    },
    "uom": "30ml",
    "searchTokens": ["charlotte tilbury", "flawless filter", "highlighter", "glow", "primer", "complexion"],
    "attributes": [
      { "attribute": "Finish", "value": "Glow" },
      { "attribute": "Use", "value": "Multi-purpose" }
    ]
  },
  {
    "sku": "BUM-BB-059",
    "barcode": "607710030058",
    "name": "Bumble and bumble Hairdresser's Invisible Oil",
    "slug": "bumble-and-bumble-invisible-oil",
    "brand": "Bumble and bumble",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-STYL"],
      "path": ["Haircare", "Styling", "Primer"]
    },
    "uom": "250ml",
    "searchTokens": ["bumble and bumble", "invisible oil", "primer", "heat protectant", "frizz", "uv protection"],
    "attributes": [
      { "attribute": "Benefit", "value": "Heat/UV Protection" },
      { "attribute": "Hair Type", "value": "Dry/Coarse" }
    ]
  },
  {
    "sku": "LEL-SAN-060",
    "barcode": "842185110006",
    "name": "Le Labo Santal 33 Eau de Parfum",
    "slug": "le-labo-santal-33",
    "brand": "Le Labo",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-UNI"],
      "path": ["Fragrance", "Unisex", "Perfume"]
    },
    "uom": "50ml",
    "searchTokens": ["le labo", "santal 33", "perfume", "wood", "leather", "niche"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Woody" },
      { "attribute": "Key Notes", "value": "Sandalwood, Papyrus" }
    ]
  },
  {
    "sku": "DRU-ELE-061",
    "barcode": "812343010111",
    "name": "Drunk Elephant Protini Polypeptide Cream",
    "slug": "drunk-elephant-protini",
    "brand": "Drunk Elephant",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-MOIST"],
      "path": ["Skincare", "Moisturizers", "Face Cream"]
    },
    "uom": "50ml",
    "searchTokens": ["drunk elephant", "protini", "moisturizer", "peptides", "firming", "clean beauty"],
    "attributes": [
      { "attribute": "Ingredient", "value": "Signal Peptides" },
      { "attribute": "Concern", "value": "Loss of Firmness" }
    ]
  },
  {
    "sku": "MAC-FIX-062",
    "barcode": "773602123456",
    "name": "MAC Prep + Prime Fix+",
    "slug": "mac-prep-prime-fix-plus",
    "brand": "MAC Cosmetics",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-SET"],
      "path": ["Makeup", "Face", "Setting Spray"]
    },
    "uom": "100ml",
    "searchTokens": ["mac", "fix plus", "setting spray", "hydration", "primer", "refresh"],
    "attributes": [
      { "attribute": "Finish", "value": "Natural" },
      { "attribute": "Benefit", "value": "Soothes/Refreshes" }
    ]
  },
  {
    "sku": "K18-MSK-063",
    "barcode": "850019623000",
    "name": "K18 Leave-In Molecular Repair Hair Mask",
    "slug": "k18-leave-in-repair-mask",
    "brand": "K18",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-TREAT"],
      "path": ["Haircare", "Treatments", "Mask"]
    },
    "uom": "50ml",
    "searchTokens": ["k18", "molecular repair", "hair mask", "damage", "bleach", "peptide"],
    "attributes": [
      { "attribute": "Technology", "value": "K18Peptide" },
      { "attribute": "Time", "value": "4 Minutes" }
    ]
  },
  {
    "sku": "SKC-CE-064",
    "barcode": "635494263008",
    "name": "SkinCeuticals C E Ferulic",
    "slug": "skinceuticals-ce-ferulic",
    "brand": "SkinCeuticals",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Vitamin C"]
    },
    "uom": "30ml",
    "searchTokens": ["skinceuticals", "c e ferulic", "vitamin c", "antioxidant", "anti-aging", "serum"],
    "attributes": [
      { "attribute": "Active", "value": "15% L-Ascorbic Acid" },
      { "attribute": "Benefit", "value": "Environmental Protection" }
    ]
  },
  {
    "sku": "MAI-REP-065",
    "barcode": "3145891726500",
    "name": "Maison Margiela Replica Jazz Club",
    "slug": "maison-margiela-replica-jazz-club",
    "brand": "Maison Margiela",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-MEN"],
      "path": ["Fragrance", "Men", "Eau de Toilette"]
    },
    "uom": "100ml",
    "searchTokens": ["maison margiela", "replica", "jazz club", "fragrance", "tobacco", "boozy"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Woody Spicy" },
      { "attribute": "Memory", "value": "Brooklyn Jazz Club" }
    ]
  },
  {
    "sku": "TUR-RES-066",
    "barcode": "850005678901",
    "name": "Tower 28 SOS Daily Rescue Facial Spray",
    "slug": "tower-28-sos-spray",
    "brand": "Tower 28",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-TONER"],
      "path": ["Skincare", "Toners", "Mist"]
    },
    "uom": "120ml",
    "searchTokens": ["tower 28", "sos spray", "hypochlorous acid", "sensitive", "redness", "acne"],
    "attributes": [
      { "attribute": "Ingredient", "value": "Hypochlorous Acid" },
      { "attribute": "Skin Type", "value": "Sensitive/Stressed" }
    ]
  },
  {
    "sku": "REF-BRO-067",
    "barcode": "817036015555",
    "name": "REFY Brow Sculpt",
    "slug": "refy-brow-sculpt",
    "brand": "REFY",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-BROWS"],
      "path": ["Makeup", "Eyebrows", "Gel"]
    },
    "uom": "8.5ml",
    "searchTokens": ["refy", "brow sculpt", "lamination", "wax", "brows", "hold"],
    "attributes": [
      { "attribute": "Finish", "value": "Laminated" },
      { "attribute": "Color", "value": "Clear" }
    ]
  },
  {
    "sku": "DAV-OI-068",
    "barcode": "8004608247609",
    "name": "Davines OI Shampoo",
    "slug": "davines-oi-shampoo",
    "brand": "Davines",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-WASH"],
      "path": ["Haircare", "Shampoo", "Smoothing"]
    },
    "uom": "280ml",
    "searchTokens": ["davines", "oi shampoo", "roucou oil", "shine", "smoothing", "sulfate free"],
    "attributes": [
      { "attribute": "Ingredient", "value": "Roucou Oil" },
      { "attribute": "Benefit", "value": "Softness/Shine" }
    ]
  },
  {
    "sku": "SUM-FRI-069",
    "barcode": "859068007008",
    "name": "Summer Fridays Jet Lag Mask",
    "slug": "summer-fridays-jet-lag-mask",
    "brand": "Summer Fridays",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-MASK"],
      "path": ["Skincare", "Masks", "Hydrating"]
    },
    "uom": "64g",
    "searchTokens": ["summer fridays", "jet lag mask", "hydration", "mask", "dry skin", "travel"],
    "attributes": [
      { "attribute": "Use", "value": "Leave-on" },
      { "attribute": "Concern", "value": "Dehydration" }
    ]
  },
  {
    "sku": "HER-LIP-070",
    "barcode": "3346132400000",
    "name": "Hermès Rouge Hermès Satin Lipstick",
    "slug": "hermes-rouge-hermes-satin",
    "brand": "Hermès",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-LIPS"],
      "path": ["Makeup", "Lips", "Lipstick"]
    },
    "uom": "3.5g",
    "searchTokens": ["hermes", "rouge hermes", "lipstick", "luxury", "satin", "refillable"],
    "attributes": [
      { "attribute": "Finish", "value": "Satin" },
      { "attribute": "Packaging", "value": "Refillable" }
    ]
  },
  {
    "sku": "GUC-BLO-071",
    "barcode": "8005610481005",
    "name": "Gucci Bloom Eau de Parfum",
    "slug": "gucci-bloom-eau-de-parfum",
    "brand": "Gucci",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-WOMEN"],
      "path": ["Fragrance", "Women", "Perfume"]
    },
    "uom": "50ml",
    "searchTokens": ["gucci", "bloom", "perfume", "floral", "tuberose", "jasmine"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Rich Floral" },
      { "attribute": "Key Notes", "value": "Rangoon Creeper" }
    ]
  },
  {
    "sku": "SUQ-FOU-072",
    "barcode": "4973167923456",
    "name": "SUQQU The Cream Foundation",
    "slug": "suqqu-the-cream-foundation",
    "brand": "SUQQU",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Foundation"]
    },
    "uom": "30g",
    "searchTokens": ["suqqu", "cream foundation", "luxury", "radiance", "japanese makeup", "glow"],
    "attributes": [
      { "attribute": "Finish", "value": "Radiant" },
      { "attribute": "Coverage", "value": "Medium-Full" }
    ]
  },
  {
    "sku": "AUG-RIC-073",
    "barcode": "5060552900226",
    "name": "Augustinus Bader The Rich Cream",
    "slug": "augustinus-bader-the-rich-cream",
    "brand": "Augustinus Bader",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-LUX"],
      "path": ["Skincare", "Moisturizers", "Anti-Aging"]
    },
    "uom": "50ml",
    "searchTokens": ["augustinus bader", "the rich cream", "tfc8", "luxury skincare", "anti-aging", "renewal"],
    "attributes": [
      { "attribute": "Technology", "value": "TFC8" },
      { "attribute": "Skin Type", "value": "Dry/Mature" }
    ]
  },
  {
    "sku": "PAT-MCG-074",
    "barcode": "843004106543",
    "name": "Pat McGrath Mothership V: Bronze Seduction",
    "slug": "pat-mcgrath-mothership-v-bronze",
    "brand": "Pat McGrath Labs",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-EYES"],
      "path": ["Makeup", "Eyes", "Eyeshadow Palette"]
    },
    "uom": "13.2g",
    "searchTokens": ["pat mcgrath", "mothership v", "bronze seduction", "palette", "eyeshadow", "luxury"],
    "attributes": [
      { "attribute": "Shades", "value": 10 },
      { "attribute": "Finish", "value": "Multi-dimensional" }
    ]
  },
  {
    "sku": "GIS-OIL-075",
    "barcode": "700512345678",
    "name": "Gisou Honey Infused Hair Oil",
    "slug": "gisou-honey-infused-hair-oil",
    "brand": "Gisou",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-OIL"],
      "path": ["Haircare", "Treatment", "Hair Oil"]
    },
    "uom": "100ml",
    "searchTokens": ["gisou", "honey oil", "hair oil", "negin mirsalehi", "shine", "hydration"],
    "attributes": [
      { "attribute": "Key Ingredient", "value": "Mirsalehi Honey" },
      { "attribute": "Benefit", "value": "Shine" }
    ]
  },
  {
    "sku": "COL-MAG-076",
    "barcode": "810023456789",
    "name": "Color Wow Dream Coat Supernatural Spray",
    "slug": "color-wow-dream-coat",
    "brand": "Color Wow",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-STYL"],
      "path": ["Haircare", "Styling", "Anti-Frizz"]
    },
    "uom": "200ml",
    "searchTokens": ["color wow", "dream coat", "frizz", "waterproof", "sleek", "humidity"],
    "attributes": [
      { "attribute": "Activation", "value": "Heat Activated" },
      { "attribute": "Benefit", "value": "Humidity Proof" }
    ]
  },
  {
    "sku": "SUL-FAS-077",
    "barcode": "880960831234",
    "name": "Sulwhasoo First Care Activating Serum",
    "slug": "sulwhasoo-first-care-serum",
    "brand": "Sulwhasoo",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Booster"]
    },
    "uom": "60ml",
    "searchTokens": ["sulwhasoo", "first care", "serum", "ginseng", "k-beauty", "anti-aging"],
    "attributes": [
      { "attribute": "Step", "value": "Pre-serum" },
      { "attribute": "Ingredient", "value": "JAUM Activator" }
    ]
  },
  {
    "sku": "KOS-REV-078",
    "barcode": "810002345678",
    "name": "Kosas Revealer Concealer",
    "slug": "kosas-revealer-concealer",
    "brand": "Kosas",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Concealer"]
    },
    "uom": "6ml",
    "searchTokens": ["kosas", "revealer", "concealer", "clean makeup", "creamy", "brightening"],
    "attributes": [
      { "attribute": "Coverage", "value": "Medium" },
      { "attribute": "Finish", "value": "Radiant" }
    ]
  },
  {
    "sku": "MED-B5-079",
    "barcode": "818625020000",
    "name": "Medik8 Hydr8 B5 Intense",
    "slug": "medik8-hydr8-b5-intense",
    "brand": "Medik8",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Hydration"]
    },
    "uom": "30ml",
    "searchTokens": ["medik8", "hydr8 b5", "hyaluronic acid", "serum", "hydration", "intense"],
    "attributes": [
      { "attribute": "Active", "value": "Hyaluronic Acid" },
      { "attribute": "Benefit", "value": "Deep Hydration" }
    ]
  },
  {
    "sku": "CRE-AVE-080",
    "barcode": "3508441001007",
    "name": "Creed Aventus",
    "slug": "creed-aventus",
    "brand": "Creed",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-MEN"],
      "path": ["Fragrance", "Men", "Niche"]
    },
    "uom": "100ml",
    "searchTokens": ["creed", "aventus", "cologne", "luxury", "niche", "pineapple"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Fruity Chypre" },
      { "attribute": "Key Note", "value": "Pineapple" }
    ]
  },
  {
    "sku": "WES-LIT-081",
    "barcode": "850004500123",
    "name": "Westman Atelier Lit Up Highlight Stick",
    "slug": "westman-atelier-lit-up",
    "brand": "Westman Atelier",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Highlighter"]
    },
    "uom": "5g",
    "searchTokens": ["westman atelier", "lit up", "highlighter", "stick", "clean luxury", "glass skin"],
    "attributes": [
      { "attribute": "Finish", "value": "Translucent" },
      { "attribute": "Texture", "value": "Balm" }
    ]
  },
  {
    "sku": "NEC-BOD-082",
    "barcode": "850006789012",
    "name": "Nécessaire The Body Wash",
    "slug": "necessaire-the-body-wash-eucalyptus",
    "brand": "Nécessaire",
    "categories": {
      "categoryIds": ["CAT-BODY", "CAT-CLEAN"],
      "path": ["Body Care", "Cleansers", "Body Wash"]
    },
    "uom": "250ml",
    "searchTokens": ["necessaire", "body wash", "eucalyptus", "clean", "niacinamide", "shower"],
    "attributes": [
      { "attribute": "Scent", "value": "Eucalyptus" },
      { "attribute": "Nutrient", "value": "Vitamins A/B3/C/E" }
    ]
  },
  {
    "sku": "ORA-GOL-083",
    "barcode": "853604000001",
    "name": "Oribe Gold Lust Repair & Restore Shampoo",
    "slug": "oribe-gold-lust-shampoo",
    "brand": "Oribe",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-WASH"],
      "path": ["Haircare", "Shampoo", "Repair"]
    },
    "uom": "250ml",
    "searchTokens": ["oribe", "gold lust", "shampoo", "luxury hair", "repair", "shine"],
    "attributes": [
      { "attribute": "Benefit", "value": "Rejuvenation" },
      { "attribute": "Scent", "value": "Côte d'Azur" }
    ]
  },
  {
    "sku": "CAU-VIN-084",
    "barcode": "3522930001867",
    "name": "Caudalie Vinoperfect Radiance Serum",
    "slug": "caudalie-vinoperfect-serum",
    "brand": "Caudalie",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Brightening"]
    },
    "uom": "30ml",
    "searchTokens": ["caudalie", "vinoperfect", "serum", "dark spots", "brightening", "french pharmacy"],
    "attributes": [
      { "attribute": "Ingredient", "value": "Viniferine" },
      { "attribute": "Concern", "value": "Dark Spots" }
    ]
  },
  {
    "sku": "SHI-ULT-085",
    "barcode": "729238153401",
    "name": "Shiseido Ultimune Power Infusing Concentrate",
    "slug": "shiseido-ultimune-concentrate",
    "brand": "Shiseido",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Immunity"]
    },
    "uom": "50ml",
    "searchTokens": ["shiseido", "ultimune", "concentrate", "serum", "defense", "skin barrier"],
    "attributes": [
      { "attribute": "Technology", "value": "ImuGeneration" },
      { "attribute": "Benefit", "value": "Strengthening" }
    ]
  },
  {
    "sku": "BOB-FAC-086",
    "barcode": "716170027456",
    "name": "Bobbi Brown Vitamin Enriched Face Base",
    "slug": "bobbi-brown-face-base",
    "brand": "Bobbi Brown",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Primer"]
    },
    "uom": "50ml",
    "searchTokens": ["bobbi brown", "face base", "vitamin enriched", "primer", "moisturizer", "makeup prep"],
    "attributes": [
      { "attribute": "Function", "value": "Primer + Moisturizer" },
      { "attribute": "Scent", "value": "Grapefruit" }
    ]
  },
  {
    "sku": "ISO-CL-087",
    "barcode": "890123456789",
    "name": "iS Clinical Active Serum",
    "slug": "is-clinical-active-serum",
    "brand": "iS Clinical",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-SERUM"],
      "path": ["Skincare", "Serums", "Anti-Aging"]
    },
    "uom": "30ml",
    "searchTokens": ["is clinical", "active serum", "acne", "anti-aging", "botanical", "cosmeceutical"],
    "attributes": [
      { "attribute": "Concern", "value": "Acne/Aging" },
      { "attribute": "Sensation", "value": "Tingling" }
    ]
  },
  {
    "sku": "HER-UNJ-088",
    "barcode": "3346132000050",
    "name": "Hermès Un Jardin Sur Le Nil",
    "slug": "hermes-jardin-sur-le-nil",
    "brand": "Hermès",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-UNI"],
      "path": ["Fragrance", "Unisex", "Eau de Toilette"]
    },
    "uom": "100ml",
    "searchTokens": ["hermes", "jardin sur le nil", "perfume", "green", "mango", "fresh"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Green Floral" },
      { "attribute": "Key Note", "value": "Green Mango" }
    ]
  },
  {
    "sku": "AMI-FLA-089",
    "barcode": "855909000222",
    "name": "Amika Flash Instant Shine Mask",
    "slug": "amika-flash-shine-mask",
    "brand": "Amika",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-TREAT"],
      "path": ["Haircare", "Treatments", "Shine"]
    },
    "uom": "200ml",
    "searchTokens": ["amika", "flash mask", "shine", "gloss", "instant", "hair treatment"],
    "attributes": [
      { "attribute": "Time", "value": "60 Seconds" },
      { "attribute": "Result", "value": "High Shine" }
    ]
  },
  {
    "sku": "FAR-GRE-090",
    "barcode": "850000123456",
    "name": "Farmacy Green Clean Makeup Meltaway Cleansing Balm",
    "slug": "farmacy-green-clean",
    "brand": "Farmacy",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-CLEAN"],
      "path": ["Skincare", "Cleansers", "Balm"]
    },
    "uom": "100ml",
    "searchTokens": ["farmacy", "green clean", "cleansing balm", "makeup remover", "clean beauty", "lime"],
    "attributes": [
      { "attribute": "Texture", "value": "Sorbet-to-Oil" },
      { "attribute": "Ingredient", "value": "Moringa/Turmeric" }
    ]
  },
  {
    "sku": "DAN-DYN-091",
    "barcode": "810001112233",
    "name": "Danessa Myricks Beauty Yummy Skin Blurring Balm Powder",
    "slug": "danessa-myricks-blurring-balm",
    "brand": "Danessa Myricks",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Foundation"]
    },
    "uom": "18g",
    "searchTokens": ["danessa myricks", "yummy skin", "blurring balm", "powder", "oil control", "primer"],
    "attributes": [
      { "attribute": "Ingredient", "value": "Upsalite" },
      { "attribute": "Finish", "value": "Soft Matte" }
    ]
  },
  {
    "sku": "BIO-ROS-092",
    "barcode": "851234005678",
    "name": "Biossance Squalane + Vitamin C Rose Oil",
    "slug": "biossance-vitamin-c-rose-oil",
    "brand": "Biossance",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-OIL"],
      "path": ["Skincare", "Face Oil", "Brightening"]
    },
    "uom": "30ml",
    "searchTokens": ["biossance", "vitamin c", "rose oil", "squalane", "brightening", "firming"],
    "attributes": [
      { "attribute": "Key Ingredient", "value": "Sugarcane Squalane" },
      { "attribute": "Form", "value": "Oil" }
    ]
  },
  {
    "sku": "PAT-LIP-093",
    "barcode": "843004100999",
    "name": "Patrick Ta Major Headlines Double-Take Blush Duo",
    "slug": "patrick-ta-blush-duo",
    "brand": "Patrick Ta",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-FACE"],
      "path": ["Makeup", "Face", "Blush"]
    },
    "uom": "10.5g",
    "searchTokens": ["patrick ta", "blush duo", "cream powder", "cheek", "pigment", "layering"],
    "attributes": [
      { "attribute": "Format", "value": "Cream & Powder" },
      { "attribute": "Technique", "value": "Layering" }
    ]
  },
  {
    "sku": "AES-RES-094",
    "barcode": "9319944009756",
    "name": "Aesop Resurrection Aromatique Hand Balm",
    "slug": "aesop-resurrection-hand-balm",
    "brand": "Aesop",
    "categories": {
      "categoryIds": ["CAT-BODY", "CAT-HAND"],
      "path": ["Body Care", "Hands", "Moisturizer"]
    },
    "uom": "75ml",
    "searchTokens": ["aesop", "hand balm", "resurrection", "mandarin", "luxury", "botanical"],
    "attributes": [
      { "attribute": "Scent", "value": "Citrus/Woody" },
      { "attribute": "Texture", "value": "Cream" }
    ]
  },
  {
    "sku": "DIO-LIP-095",
    "barcode": "3348900012345",
    "name": "Dior Addict Lip Glow Oil",
    "slug": "dior-addict-lip-glow-oil",
    "brand": "Dior",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-LIPS"],
      "path": ["Makeup", "Lips", "Lip Oil"]
    },
    "uom": "6ml",
    "searchTokens": ["dior", "lip glow oil", "lip oil", "gloss", "cherry oil", "nourishing"],
    "attributes": [
      { "attribute": "Finish", "value": "Glossy" },
      { "attribute": "Ingredient", "value": "Cherry Oil" }
    ]
  },
  {
    "sku": "SKIN-BOD-096",
    "barcode": "810025000000",
    "name": "SkinFix Barrier+ Triple Lipid-Peptide Cream",
    "slug": "skinfix-barrier-cream",
    "brand": "SkinFix",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-MOIST"],
      "path": ["Skincare", "Moisturizers", "Barrier Repair"]
    },
    "uom": "50ml",
    "searchTokens": ["skinfix", "barrier+", "lipid peptide", "ceramides", "dry skin", "repair"],
    "attributes": [
      { "attribute": "Key Complex", "value": "Triple Lipid" },
      { "attribute": "Benefit", "value": "Barrier Restore" }
    ]
  },
  {
    "sku": "MAI-KURI-097",
    "barcode": "3700559605886",
    "name": "Maison Francis Kurkdjian Baccarat Rouge 540",
    "slug": "mfk-baccarat-rouge-540",
    "brand": "Maison Francis Kurkdjian",
    "categories": {
      "categoryIds": ["CAT-FRAG", "CAT-LUX"],
      "path": ["Fragrance", "Luxury", "Eau de Parfum"]
    },
    "uom": "70ml",
    "searchTokens": ["mfk", "baccarat rouge", "540", "perfume", "luxury", "amber floral"],
    "attributes": [
      { "attribute": "Scent Family", "value": "Amber Floral" },
      { "attribute": "Notes", "value": "Saffron, Jasmine" }
    ]
  },
  {
    "sku": "ANA-DIP-098",
    "barcode": "689304060100",
    "name": "Anastasia Beverly Hills Dipbrow Pomade",
    "slug": "abh-dipbrow-pomade",
    "brand": "Anastasia Beverly Hills",
    "categories": {
      "categoryIds": ["CAT-MAKEUP", "CAT-BROWS"],
      "path": ["Makeup", "Eyebrows", "Pomade"]
    },
    "uom": "4g",
    "searchTokens": ["abh", "dipbrow", "pomade", "eyebrows", "waterproof", "long wearing"],
    "attributes": [
      { "attribute": "Formula", "value": "Pomade" },
      { "attribute": "Finish", "value": "Matte" }
    ]
  },
  {
    "sku": "PAU-AZA-099",
    "barcode": "0655439001234",
    "name": "Paula's Choice 10% Azelaic Acid Booster",
    "slug": "paulas-choice-azelaic-acid",
    "brand": "Paula's Choice",
    "categories": {
      "categoryIds": ["CAT-SKIN", "CAT-TREAT"],
      "path": ["Skincare", "Treatments", "Redness"]
    },
    "uom": "30ml",
    "searchTokens": ["paula's choice", "azelaic acid", "booster", "acne", "rosacea", "redness"],
    "attributes": [
      { "attribute": "Active", "value": "Azelaic Acid" },
      { "attribute": "Concern", "value": "Blemishes/Redness" }
    ]
  },
  {
    "sku": "KEV-SEN-100",
    "barcode": "888066070200",
    "name": "Kevin Murphy Angel.Wash",
    "slug": "kevin-murphy-angel-wash",
    "brand": "Kevin Murphy",
    "categories": {
      "categoryIds": ["CAT-HAIR", "CAT-WASH"],
      "path": ["Haircare", "Shampoo", "Volumizing"]
    },
    "uom": "250ml",
    "searchTokens": ["kevin murphy", "angel wash", "shampoo", "fine hair", "volume", "color safe"],
    "attributes": [
      { "attribute": "Hair Type", "value": "Fine/Colored" },
      { "attribute": "Benefit", "value": "Volumizing" }
    ]
  }
]

declare var showLoader: Function;

@Component({
  selector: 'app-sample-products',
  imports: [],
  templateUrl: './sample-products.html',
  styleUrl: './sample-products.css'
})
export class SampleProducts {
  productList:any[]=product;

  constructor (){
    showLoader(false);
  }
}
