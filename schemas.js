const Joi = require('joi');


module.exports.tshirtSchema = Joi.object({
        tshirt : Joi.object({
            title : Joi.string().required(),
            price: Joi.number().required(),
            colour : Joi.string(),
            discount : Joi.number().required(),
            sprice : Joi.number().required(),
            description : Joi.string(),
            material : Joi.string(),
            status : Joi.string()
        }).required(),
        image : Joi.array()
    });

