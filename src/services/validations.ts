import Validator from "validatorjs";

type RequestBody = {
  [key: string]: string | number;
};

const validateBody = (body: RequestBody, validationSchema: Validator.Rules) => {
  const validation = new Validator(body, validationSchema);

  if (validation.fails()) {
    const errors = validation.errors.all() as Record<string, string[]>;
    const aggregatedErrors: string[] = [];
    Object.values(errors).forEach((error: string[]) => {
      aggregatedErrors.push(...error);
    });

    throw new Error(aggregatedErrors.join(", "));
  }
};

export const validateCreateShortUrl = (body: RequestBody) => {
  validateBody(body, {
    id: "string|min:5|max:10",
    url: "url|required",
  });
};

export const validateUpdateShortUrl = (body: RequestBody) => {
  validateBody(body, {
    url: "url|required",
  });
};
