const en = 
    [
    {
        name: "Bracelet-1",
        category: "accessory",
        description: "I'm a product detail. I'm a great place to add more information.",
        community: "here from which community it come from",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["blue", "red", "green"]
        },
    {
        name: "Bracelet-2",
        category: "accessory",
        description: "I'm a product detail. I'm a great place to add more information.",
        community: "here from which community it come from",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["blue", "red", "green"]
        },
    {
        name: "Bracelet-3",
        category: "accessory",
        description: "I'm a product detail. I'm a great place to add more information.",
        community: "here from which community it come from",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["blue", "red", "green"]
    }
]

const fr = 
    [
    {
        name: "Bracelet-1",
        category: "accessoire",
        description: "Je suis la description du produit",
        community: "Quel village là produit",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["bleu", "rouge", "vert"]
        },
    {
        name: "Bracelet-2",
        category: "accessoire",
        description: "Je suis la description du produit",
        community: "Quel village là produit",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["bleu", "rouge", "vert"]
        },
    {
        name: "Bracelet-3",
        category: "accessoire",
        description: "Je suis la description du produit",
        community: "Quel village là produit",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["bleu", "rouge", "vert"]
    }
]

exports.getDatas = async (req, res, next) => {
    let jsonToSend
    if (req.body.lang === 'en') {
        jsonToSend = en
    } else {
        jsonToSend = fr
    }
    res.status(200).json(jsonToSend)
}