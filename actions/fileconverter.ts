"use server"
import mammoth from "mammoth"
import connectDB from "@/database/db_configure"
import pdfParse from "pdf-parse"

interface objectt {
    file: File,   // will be null after JSON
    roomId: string
}

export default async function Fileconverter(
    formdata: objectt,
    filename: string,
    filetype: string,
    filedata: string // base64 or plain text
) {
    await connectDB()
    console.log(filename,filetype,filedata)
    const roomId = formdata["roomId"] as string

    if (!filedata) {
        return "Error"
    }

    let text = ""
    let flag = 0
    let buffer: Buffer | null = null

    // Try to decode filedata as base64
    try {
        buffer = Buffer.from(filedata, "base64")
    } catch {
        // If it's not base64, assume it's plain text
        text = filedata
        flag = 1
    }

    const type = filetype || ""
    const name = filename || ""

    if (buffer) {
        if (type === "text/plain") {
            text = buffer.toString("utf-8")
            flag = 1
        } else if (name.endsWith(".docx")) {
            const filetext = await mammoth.extractRawText({ buffer })
            text = filetext.value
            flag = 1
        } else if (type === "application/pdf") {
            const filetext = await pdfParse(buffer)
            text = filetext.text
            console.log("text in server action",text)
            flag = 1
        }
    }

    if (flag === 0) {
        return { Success: false, text: "" }
    } else {
        return { Success: true, text }
    }
}
