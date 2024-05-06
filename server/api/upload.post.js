import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const maxFiles = 1;
  let pdfName;
  try {
    const { files } = await readFiles(event, {
      maxFiles: maxFiles
    });

    if (!Object.keys(files).length) {
      console.log("No files found"); 
      throw createError({
        statusMessage: "2001",
        statusCode: 400,
      }); 
    }
    
    for (let index = 0; index < Object.keys(files).length; index++) {
      const filepath = files[index][0].filepath;
      const mimetype = files[index][0].mimetype;

      if (!mimetype.startsWith("application/pdf")) {
        throw createError({
          statusMessage: "2002",
          statusCode: 400,
        }); 
      }
      
      pdfName = `${String(Date.now()) + String(Math.round(Math.random() * 10000000))}.pdf`;
      let newPath = path.join("public", "pdf", pdfName);
      fs.copyFileSync(filepath, newPath);
    }
    console.log(pdfName);

    return {
      status: 200,
      message: "success",
      pdfName: pdfName
    }
  } catch (error) {
    if (error.message === "2001") {
      throw createError({
        statusMessage: "File is required.",
        statusCode: 400,
      });
    }

    if (error.message === "2002") {
      throw createError({
        statusMessage: "Only PDF allowed.",
        statusCode: 400,
      });
    }

    if (error.code === formidableErrors.maxFilesExceeded) {
      throw createError({
        statusMessage: `Can't upload more than ${maxFiles} image.`,
        statusCode: 400,
      });
    }

    throw createError({
	statusMessage: "An unknown error occurred",
	statusCode: 500
    });
  }
});
