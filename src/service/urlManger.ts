import { generateRandomShortVal } from "../utils/url";
import { connectToDatabase, urlModel } from "../db";
import { LambdaResponse } from "../utils/types";

const MAIN_ROUTE = "https://api.webx.in.ua/at";

export const generateShortUrl = async (urlToMinify: string) => {
  try {
    await connectToDatabase();

    let shortUrl = `${MAIN_ROUTE}/${generateRandomShortVal()}`;
    let existingUrl = await urlModel.findOne({ shortUrl });

    while (existingUrl) {
      shortUrl = `${MAIN_ROUTE}/${generateRandomShortVal()}`;
      existingUrl = await urlModel.findOne({ shortUrl });
    }

    const url = new urlModel({
      originalUrl: urlToMinify,
      shortUrl: shortUrl,
      dateCreated: new Date(),
    });
    await url.save();

    return shortUrl;
  } catch (error) {
    console.error("Error generating short URL:", error);
    throw new Error("Could not generate short URL");
  }
};

export const getByUrlShortId = async (id: string) => {
  try {
    await connectToDatabase();

    const { originalUrl } = await urlModel
      .findOne({ shortUrl: `${MAIN_ROUTE}/${id}` }, { originalUrl: 1 })
      .lean();

    if (!originalUrl) {
      throw new Error("Short URL not found");
    }

    return originalUrl;
  } catch (error) {
    throw new Error("Could not retrieve original URL");
  }
};
export const handleMinify = async (
  body: string | undefined
): Promise<LambdaResponse> => {
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Request body is missing",
      }),
    };
  }

  try {
    const data = JSON.parse(body);
    if (!data.urlToMinify) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid request: urlToMinify is required",
        }),
      };
    }

    const shortUrl = await generateShortUrl(data.urlToMinify);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data processed successfully!",
        shortUrl,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
    };
  }
};

export const handleRedirect = async (
  urlId: string
): Promise<LambdaResponse> => {
  try {
    const originalUrl = await getByUrlShortId(urlId);
    return {
      statusCode: 302,
      headers: {
        Location: originalUrl,
      },
      body: JSON.stringify({
        message: `Redirecting to ${originalUrl}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "URL not found",
      }),
    };
  }
};
