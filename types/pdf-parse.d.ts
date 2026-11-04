declare module "pdf-parse" {
  interface PDFResult {
    text: string
    numpages: number
    info: any
    metadata: any
    version: string
  }

  function pdfParse(dataBuffer: Buffer): Promise<PDFResult>

  export = pdfParse
}
