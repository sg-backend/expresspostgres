const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string(),
});

module.exports = {
  userSchema,
};
