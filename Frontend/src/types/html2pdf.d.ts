declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      [key: string]: any;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: "portrait" | "landscape";
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface Html2PdfInstance {
    from(element: HTMLElement): Html2PdfInstance;
    set(options: Html2PdfOptions): Html2PdfInstance;
    save(): Promise<void>;
    toPdf(): any;
    toContainer(): any;
    toCanvas(): Promise<HTMLCanvasElement>;
    toImg(): Promise<HTMLImageElement>;
    outputPdf(): any;
    output(type: string, options?: any): any;
  }

  function html2pdf(): Html2PdfInstance;
  function html2pdf(
    element: HTMLElement,
    options?: Html2PdfOptions
  ): Html2PdfInstance;

  export default html2pdf;
}
