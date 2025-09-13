// DEPRECATED - NO LONGER BEING USED IN FAVOR OF EXPORTING CSVs
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPdf = async (elementId: string, fileName:string) => {
  const receiptElement = document.getElementById(elementId);
  if (!receiptElement) return;

  const clone = receiptElement.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 3, 
      backgroundColor: null,
    });
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);
  } catch(e) {
    console.error("Error generating PDF", e);
    if(clone.parentElement) {
      document.body.removeChild(clone);
    }
  }
};
