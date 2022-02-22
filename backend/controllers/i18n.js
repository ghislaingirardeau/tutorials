const en = 
    [
    {
        id:12,
        name: "Bracelet-1",
        category: "accessory",
        description: "I'm a product detail. I'm a great place to add more information.",
        communityId: 1,
        community: "here from which community it come from",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["blue", "red", "green"]
        },
    {
        id:12,
        name: "Bracelet-2",
        category: "accessory",
        description: "I'm a product detail. I'm a great place to add more information.",
        communityId: 1,
        community: "here from which community it come from",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["blue", "red", "green"]
        },
    {
        id:123,
        name: "Bracelet-3",
        category: "accessory",
        description: "I'm a product detail. I'm a great place to add more information.",
        communityId: 2,
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
        id:1,
        name: "Bracelet-1",
        category: "accessoire",
        description: "Je suis la description du produit",
        communityId: 1,
        community: "Description du village ou de la personne qui fabrique le produit",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["bleu", "rouge", "vert"]
        },
    {
        id:12,
        name: "Bracelet-2",
        category: "accessoire",
        description: "Je suis la description du produit",
        communityId: 1,
        community: "Description du village ou de la personne qui fabrique le produit",
        price: "1200",
        weight: "",
        dimension: "",
        material: "",
        colors: ["bleu", "rouge", "vert"]
        },
    {
        id:123,
        name: "Bracelet-3",
        category: "accessoire",
        description: "Je suis la description du produit",
        communityId: 2,
        community: "Description du village ou de la personne qui fabrique le produit",
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