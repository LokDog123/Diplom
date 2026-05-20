import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId, filename, childName) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found');
        return;
    }

    const originalOverflow = element.style.overflow;
    const originalHeight = element.style.height;
    
    element.style.overflow = 'visible';
    element.style.height = 'auto';

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Увеличиваем качество
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true, // Для загрузки изображений с других доменов
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        element.style.overflow = originalOverflow;
        element.style.height = originalHeight;

        const imgData = canvas.toDataURL('image/png');
        
        const imgWidth = 210; // A4 ширина в мм
        const pageHeight = 297; // A4 высота в мм
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        
        // Добавляем заголовок
        pdf.setFontSize(18);
        pdf.setTextColor(41, 128, 185);
        pdf.text(`Отчет о развитии: ${childName}`, 14, 20);
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Дата генерации: ${new Date().toLocaleDateString('ru-RU')}`, 14, 30);
        
        pdf.addImage(imgData, 'PNG', 0, 40, imgWidth, imgHeight, undefined, 'FAST');
        
        let heightLeft = imgHeight - (pageHeight - 40);
        let currentPage = 1;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -(imgHeight - heightLeft + 40), imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
            currentPage++;
            
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`Страница ${currentPage}`, 105, 290, { align: 'center' });
        }
        
        pdf.save(`${filename}.pdf`);
        
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};