const Images = [
    { image: require("../assets/banners/pet1.jpg")},
    { image: require("../assets/banners/pet2.jpg")},
    { image: require("../assets/banners/pet3.jpg")},
];

export const markers = [
    {
        coordinate: {
            latitude: 36.9447783,
            longitude: 127.9017519,
        },
        title: "코코",
        description: "충북 충주시 하단7길 11",
        image: Images[0].image,
        user_name: 'taewoong9'
    },
    {
        coordinate: {
            latitude: 36.9519586,
            longitude: 127.9094229,
        },
        title: "마롱",
        description: "충주시 모시래2길 40-10",
        image: Images[1].image,
        user_name: 'yongJun97'
    },
    {
        coordinate: {
            latitude: 36.9528604,
            longitude: 127.90904,
        },
        title: "땡삐",
        description: "충북 충주시 모시래2길 17-1",
        image: Images[2].image,
        user_name: 'woo2020'
    },
]